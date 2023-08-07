const { expect } = require("chai");
const { ethers } = require('hardhat');
const { BN } = require('web3-utils');

// const { keccak256, signMessage, arrayify } = require("ethers/lib/utils");

describe("Organization and OrganizationFactory Contracts", function () {
    let Organization, organization, admin, paymaster, user1, user2, other;

    const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
    // console.log("Admin Role: ", ADMIN_ROLE);

    const TRANSFER_ROLE = "0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c";
    // console.log("Transfer Role: ", TRANSFER_ROLE);

    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    // console.log("Default Admin Role: ", DEFAULT_ADMIN_ROLE);

    let signature;

    const generateSignature = async (signer, target, blocklimit = 50) => {
        let encodedParams = ethers.utils.defaultAbiCoder.encode(["address"], ["uint256"], [target, await ethers.provider.getBlockNumber() + blocklimit]);
        let hashedParams = ethers.utils.keccak256(encodedParams);
        const signature = await signer.signMessage(ethers.utils.arrayify(hashedParams));
        return [encodedParams, hashedParams, signature, signer.address];

    }

    before(async function () {
        // Deploy contracts
        Organization = await ethers.getContractFactory("Organization");

        organization = await Organization.deploy(paymaster.address);
        await organization.deployed();
    });

    describe("Organization Contract", function () {
        it("should set correct initial roles", async () => {
            const isAdmin = await organization.hasRole(await organization.ADMIN_ROLE(), admin);
            const isDefaultAdmin = await organization.hasRole(await organization.DEFAULT_ADMIN_ROLE(), admin);
            const isTransferRole = await organization.hasRole(await organization.TRANSFER_ROLE(), admin);
            const isPaymaster = await organization.hasRole(await organization.PayMaster(), paymaster.address);
            expect(isAdmin).to.be.true;
            expect(isDefaultAdmin).to.be.true;
            expect(isTransferRole).to.be.true;
            expect(isPaymaster).to.be.true;
        });

        it("should allow default admin to add new admin", async () => {
            let signature = await generateSignature(admin, organization.address);
            await organization.connect(paymaster).grantRole(signature, ADMIN_ROLE, user1.address);
            const isAdmin = await organization.hasRole(await organization.ADMIN_ROLE(), user1.address);
            expect(isAdmin).to.be.true;
        });

        it("should not allow non-admin to add new admin", async () => {
            let signature = await generateSignature(user1, organization.address);
            await expect(await organization.connect(paymaster).grantRole(signature, ADMIN_ROLE, user2.address)).to.be.revertedWith("Unauthorized");
        });

        it("should allow the admin to set default permissions", async () => {
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(admin, organization.address);
            await organization.setDefaultPermission(signature, user1.address, perm);
            const newPerm = await organization.connect(admin).defaultPermissions(user1.address);
            expect(newPerm.toString()).to.equal(perm.toString());
        });

        it("should not allow non-admin to set default permissions", async () => {
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(user1, organization.address);
            await expect(await organization.setDefaultPermission(signature, user2.address, perm)).to.be.revertedWith("Unauthorized");
        });

        it("should not allow third person to call contract to set default permissions", async () => {
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(admin, organization.address);
            await expect(await organization.connect(user2).setDefaultPermission(signature, user2.address, perm)).to.be.revertedWith("Invalid sender");
        });

        it("should allow the admin to set default permissions from paymaster", async () => {
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(admin, organization.address);
            await organization.connect(paymaster).setDefaultPermission(signature, user2.address, perm);
            const newPerm = await organization.defaultPermissions(user2.address);
            expect(newPerm.toString()).to.equal(perm.toString());
        });

        it("should allow the admin to set specific permissions", async () => {
            const tokenId = new BN(1000);
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(admin, organization.address);
            await organization.connect(paymaster).setPermission(signature, user1.address, tokenId, perm);
            const newPerm = await organization.permissions(user1.address, tokenId);
            expect(newPerm.toString()).to.equal(perm.toString());
        });

        it("should not allow non-admin to set specific permissions", async () => {
            const tokenId = new BN(1000);
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(user1, organization.address);
            await expect(await organization.connect(paymaster).setPermission(signature, user1.address, tokenId, perm)).to.be.revertedWith("Unauthorized");
        });

        it("should allow secondary-admin to set specific permissions", async () => {
            let signature = await generateSignature(admin, organization.address);
            await organization.connect(paymaster).grantRole(signature, ADMIN_ROLE, user1.address);
            const isAdmin = await organization.hasRole(await organization.ADMIN_ROLE(), user1.address);
            expect(isAdmin).to.be.true;

            const tokenId = new BN(1000);
            const perm = new BN(2); // Permission.Write
            signature = await generateSignature(user1, organization.address);
            await organization.connect(paymaster).setPermission(signature, user2.address, tokenId, perm);
            const newPerm = await organization.permissions(user2.address, tokenId);
            expect(newPerm.toString()).to.equal(perm.toString());
        });

        it("should get correct effective permissions from default permissions", async () => {
            const tokenId = new BN(1000);
            const perm = new BN(2); // Permission.Write
            let signature = await generateSignature(admin, organization.address);
            await organization.connect(paymaster).setDefaultPermission(signature, user2.address, perm);
            const newPerm = await organization.effectivePermissions(user1.address, tokenId);
            expect(newPerm.toString()).to.equal(perm.toString());
        })
    });

});
