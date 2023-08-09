// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SignatureVerifier.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
    @title Team Contract
    @notice This contract manages permissions and roles within a team of an organization.
 */
contract Team is SignatureVerifier {

    // Enum to describe the permission levels
    enum Permission {
        NoAccess,
        Read,
        Write
    }

    // Mapping from address to token ID to permission level
    mapping(address => mapping(uint256 => Permission)) public permissions;

    // Mapping for default permissions for users
    mapping(address => Permission) public defaultPermissions;

    /**
        @notice Initializes the Organization contract with an admin address.
        @param _admin The address of the admin.
     */
    constructor(
        address _paymaster,
        address _admin
    ) SignatureVerifier(_paymaster) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, _admin);
    }

    // Function to set default permissions for a user
    function setDefaultPermission(
        Signature memory signature,
        address account,
        Permission perm
    ) external verifySignature(DEFAULT_ADMIN_ROLE, signature) {
        defaultPermissions[account] = perm;
    }

    // Function to set permissions
    function setPermission(
        Signature memory signature,
        address account,
        uint256 tokenId,
        Permission perm
    ) external verifySignature(ADMIN_ROLE, signature) {
        permissions[account][tokenId] = perm;
    }

    // Function to get effective permission
    function getEffectivePermission(
        address account,
        uint256 tokenId
    ) public view returns (Permission) {
        Permission specificPerm = permissions[account][tokenId];
        if (specificPerm != Permission.NoAccess) {
            return specificPerm;
        }
        return defaultPermissions[account];
    }

    // Function to check read permission
    function canRead(
        address account,
        uint256 tokenId
    ) external view returns (bool) {
        return getEffectivePermission(account, tokenId) >= Permission.Read;
    }

    // Function to check write permission
    function canWrite(
        address account,
        uint256 tokenId
    ) external view returns (bool) {
        return getEffectivePermission(account, tokenId) == Permission.Write;
    }

}
