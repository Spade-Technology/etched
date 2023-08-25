// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

abstract contract IOrganisation is IERC721 {
    enum EPermissions {
        None, // Id 0 is reserved for None, as it is the default value
        Member, // Currently has not direct purpose, but may be used in the future. Especially in the U.I.
        Admin
    }

    function isAdmin(
        uint256 orgId,
        address user
    ) public view virtual returns (bool _isAdmin);

    function isMember(
        uint256 orgId,
        address user
    ) public view virtual returns (bool _isMember);

    function createOrganisation(
        address to
    ) external virtual returns (uint256 newOrgId);

    function setPermission(
        uint256 orgId,
        address user,
        EPermissions permission
    ) external virtual;

    function getNumberOfOrganisationsCreated()
        external
        view
        virtual
        returns (uint256);
}