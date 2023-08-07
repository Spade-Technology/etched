// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

// hardhat tools
// DEV ENVIRONMENT ONLY
// import "hardhat/console.sol";
abstract contract Verifiable {
    address signer; //0x52e4589601c6a2831Cc9EC0565d9A6eaD6a6489F (USEFUL FOR TEST AGAINST config.json)
    event SignerModified(address indexed sender, address signer);

    struct SVerify {
        bytes encoded_message;
        bytes32 message_hash;
        bytes signature;
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length.  Must be 65!");
        assembly {
            r := mload(add(sig, 32)) // first 32 bytes, after the length prefix
            s := mload(add(sig, 64)) // second 32 bytes
            v := byte(0, mload(add(sig, 96))) // final byte (first byte of the next 32 bytes)
        }
    }

    function getMessageHash(
        bytes memory _data
    ) internal pure returns (bytes32) {
        return keccak256(_data);
    }

    function getEthSignedMessageHash(
        bytes32 message_hash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    message_hash
                )
            );
    }

    function recoverSigner(
        bytes32 eth_signed_message_hash,
        bytes memory _signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(eth_signed_message_hash, v, r, s);
    }

    function _verify(
        SVerify memory verification,
        address requiredSigner
    ) internal view {
        require(
            requiredSigner != address(0),
            "Signer not set: cannot verify signature. Please contact an Administrator."
        );
        require(
            getMessageHash(verification.encoded_message) ==
                verification.message_hash,
            "The message hash doesn't match the original!"
        );
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(
            verification.message_hash
        );
        address recoveredSigner = recoverSigner(
            ethSignedMessageHash,
            verification.signature
        );
        require(
            recoveredSigner == requiredSigner,
            "Invalid signer! Please contact an Administrator."
        );
    }

    // make sure the data is signed by the backend
    modifier verify(SVerify memory verification, address requiredSigner) {
        _verify(verification, requiredSigner);
        _;
        // usedSignatures[verification.signature] = true; Do we want to do this?
    }

    modifier signerOrWallet(
        address requiredSigner,
        SVerify memory verification
    ) {
        if (msg.sender != requiredSigner) _verify(verification, requiredSigner);
        _;
    }
}
