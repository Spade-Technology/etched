// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./forks/ERC721.sol";
import "./ITeams.sol";
import "./IEtches.sol";

import "./CNodeHandler.sol";

import "hardhat/console.sol";

contract Etches is ERC721, IEtches, NodeHandler {
    using Counters for Counters.Counter;

    // The total number of Etches minted
    Counters.Counter private totalSupply;

    // The address of the Teams contract
    address public teams;

    // Mapping of Etch ID to Team ID
    mapping(uint256 etch => uint256 team) public teamOf;

    // External Individual Permissions
    mapping(uint256 etch => mapping(address user => ITeams.EPermissions permission)) public individualPermissionsOf;

    // External Team Permissions
    mapping(uint256 etch => mapping(uint256 team => ITeams.EPermissions permission))
        public teamPermissionsOf;

    // Mapping of Etch Id to the Etch's metadata
    mapping(uint256 etch => SEtch metadata) public metadataOf;
    mapping(uint256 etch => SComments comments) commentsOf;

    /**
     * @notice Creates a new Etches contract
     *
     * @param teamsContract The address of the Teams contract
     */
    constructor(address teamsContract) ERC721("Etches", "ETCH") NodeHandler(teamsContract) {
        teams = teamsContract;
    }

    /**
     * @notice Creates a new Etch, mints it to the specified address
     *
     * @param to The address to mint the Etch to
     */
    function safeMint(
        address to,
        string calldata documentName,
        string calldata ipfsCid
    ) external virtual override {
        totalSupply.increment();
        uint256 tokenId = totalSupply.current();

        _safeMint(to, tokenId, "");

        metadataOf[tokenId] = SEtch({
            creator: _msgSender(),
            documentName: documentName,
            ipfsCid: ipfsCid,
            commentsCount: 0,
            timestamp: block.timestamp
        });

        emit EtchCreated(tokenId, to, ipfsCid, documentName);
    }

    /**
     * @notice Comments on an Etch (Ex: Signature, Approval, etc.)
     *
     * @param tokenId The Etch's ID to comment on
     * @param commentIpfsCid The IPFS CID of the comment's document
     *
     * @dev This function can only be called by a user with read permission for the Etch
     */
    function commentOnEtch(uint256 tokenId, string memory commentIpfsCid) external virtual override {
        require(hasWritePermission(_msgSender(), tokenId), "ETCH: Not allowed to read this Etch");

        commentsOf[tokenId] = SComments({commentIpfsCid: commentIpfsCid, timestamp: block.timestamp});

        metadataOf[tokenId].commentsCount++;

        emit CommentAdded(tokenId, metadataOf[tokenId].commentsCount, commentsOf[tokenId]);
    }

    /**
     * @notice Transfers an Etch to the specified team
     *
     * @param tokenId The Etch's ID to transfer
     * @param teamId The team to transfer the Etch to, will revert if the team does not exist
     *
     * @dev This function can only be called by a user with ownership of the Etch
     */
    function transferToTeam(uint256 tokenId, uint256 teamId) external virtual override {
        require(ITeams(teams).getNumberOfTeamsCreated() >= teamId, "ETCH: Team does not exist");
        _transfer(_msgSender(), teams, tokenId);

        if (teamOf[tokenId] > 0){
            teamPermissionsOf[tokenId][teamOf[tokenId]] = ITeams.EPermissions.None;
        }
        teamOf[tokenId] = teamId;
        teamPermissionsOf[tokenId][teamId] = ITeams.EPermissions.ReadWrite;

        emit EtchTransferedToTeam(tokenId, _msgSender(), teamId); // Transfer the Etch to the team
    }

    /**
     * @notice Mints an Etch for the specified team
     *
     * @param teamId The `team` to mint the Etch for, will revert if the `team` does not exist
     *
     * @dev This function can only be called by a user with read/write permission for the `team`
     */
    function safeMintForTeam(uint256 teamId, string calldata documentName, string calldata ipfsCid) external virtual override {
        // TODO: Change to write permission on team
        require(
            ITeams(teams).hasPermission(teamId, _msgSender(), ITeams.EPermissions.ReadWrite),
            "ETCH: Not allowed to mint for this team"
        );

        totalSupply.increment();
        uint256 tokenId = totalSupply.current();

        _safeMint(to, tokenId, "");

        metadataOf[tokenId] = SEtch({
            creator: _msgSender(),
            documentName: documentName,
            ipfsCid: ipfsCid,
            commentsCount: 0,
            timestamp: block.timestamp
        });
        teamOf[tokenId] = teamId;
        teamPermissionsOf[tokenId][teamId] = ITeams.EPermissions.ReadWrite;

        emit EtchCreated(tokenId, to, ipfsCid, documentName);
    }

    /**
     * @notice Checks if the account has read permission for the `etch`
     *
     * @param account The account to check for read permission
     * @param tokenId The `etch`'s ID to check for read permission
     *
     * @return bool True if the account has read permission for the `etch`
     */
    function hasReadPermission(
        address account,
        uint256 tokenId
    ) public view virtual override returns (bool) {
        return
            _checkPermssion(account, tokenId, 0, ITeams.EPermissions.Read);
    }

    /**
     * @notice Sets the individual permissions for the Etch
     *
     * @param tokenId The Etch's ID to set the permissions for
     * @param account The account to set the permissions for
     * @param permission The permission to set, See EPermissions for more details
     *
     * @dev This function can only be called by the owner of the Etch
     */
    function setIndividualPermissions(
        uint256 tokenId,
        address account,
        ITeams.EPermissions permission
    ) external virtual override {
        require(ownerOf(tokenId) == _msgSender(), "ETCH: Not allowed to set permissions for this Etch");

        individualPermissionsOf[tokenId][account] = permission;
        emit InvididualPermissionsUpdated(tokenId, account, permission);
    }

    /**
     * @notice Sets the team permissions for the Etch
     *
     * @param tokenId The Etch's ID to set the permissions for
     * @param teamId The team to set the permissions for
     * @param permission The permission to set, See EPermissions for more details
     *
     * @dev This function can only be called by the owner of the Etch
     */
    function setTeamPermissions(
        uint256 tokenId,
        uint256 teamId,
        ITeams.EPermissions permission
    ) external {
        require(
            ownerOf(tokenId) == _msgSender(),
            "ETCH: Not allowed to set permissions for this Etch"
        );

        teamPermissionsOf[tokenId][teamId] = permission;
    }

    /**
     * @notice Checks if the account has write permission for the Etch
     *
     * @param account The account to check for write permission
     * @param tokenId The Etch's ID to check for write permission
     *
     * @return bool True if the account has write permission for the Etch
     */
    function hasWritePermission(address account, uint256 tokenId) public view virtual override returns (bool) {
        return
            _checkPermssion(account, tokenId, 0, ITeams.EPermissions.ReadWrite);
    }

    /**
     * @notice Override of the ERC721 implementation to allow for the teams contract to be the owner of the Etch, through User, Team, or Organisation ownership
     *
     * @param tokenId The Etch's ID to check the owner of
     *
     * @return address The owner of the Etch
     */
    function _ownerOf(uint256 tokenId) internal view virtual override returns (address) {
        address owner = _owners[tokenId];

        // is owner by the teams contract.
        // We now need to get which team this UINT is part of...
        if (owner == teams) return ITeams(teams).ownerOf(teamOf[tokenId]);
        else return owner;
    }

    function _checkPermssion(
        address account,
        uint256 tokenId,
        uint256 teamId,
        ITeams.EPermissions permission
    ) internal view virtual returns (bool) {
        if (teamId > 0) {
            return (teamPermissionsOf[tokenId][teamId] >= permission &&
                ITeams(teams).hasPermission(teamId, account, permission));
        } else {
            return
                account == ownerOf(tokenId) ||
                individualPermissionsOf[tokenId][account] >= permission;
        }
    }

    // Should we implement a safety check like this ?
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 firstTokenId,
    //     uint256 batchSize
    // ) internal virtual override {
    //     require(
    //         from == address(0) || to != teams,
    //         "ETCH: Cannot transfer to teams contract"
    //     );
    // }
}
