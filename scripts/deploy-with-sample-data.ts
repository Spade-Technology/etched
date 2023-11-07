import { ethers, tenderly, run } from "hardhat";
const fs = require("fs");
const path = require("path");

const ETeamPermissions = {
  NONE: 0,
  READ: 1,
  READWRITE: 2,
};

const EOrgPermissions = {
  NONE: 0,
  MEMBER: 1,
  ADMIN: 2,
};

const DocName = "Fake Doc Name";
const IPFSCid = "Fake IPFSCid";

async function main () {
  const signers = await ethers.getSigners();

  console.log("Deploying contracts with the account:", signers[0].address);

  const Org = await ethers.getContractFactory("Organisations");
  const orgContract = await Org.deploy()
  const resOrg = await orgContract.deployed();
  console.log("Org deployed to:", orgContract.address);
  console.log("Adding node to ORG");
  await orgContract.addNode(signers[0].address)
  // await orgContract.addNode("0x138b743c7176C51CBd8694A0e8764b93325D4041") // Obirijah
  console.log("Organisations deployed to:", orgContract.address);
  // console.dir(resOrg)


  // console.log("Deploying ENS with the account:", signers[0].address);
  // const ENS = await ethers.getContractFactory("EtchENS");
  // const ensContract = await ENS.deploy(orgContract.address, {
  //   nonce: Math.floor(Math.random() * (10000 - 1 + 1) + 1),
  //   gasLimit:250_000
  // })
  //const resEns = await ensContract.deployed();
  // await ensContract.connect(signers[0]).safeMint(signers[0].address, "admin.etched")


  // console.log("ENS deployed to:", ensContract.address);


  console.log("Deploying TEAMS with the account:", signers[0].address);
  const Team = await ethers.getContractFactory("Teams");
  
  const teamContract = await Team.deploy(orgContract.address, {
    nonce: Math.floor(Math.random() * (10000 - 1 + 1) + 1),
    gasLimit: 250_000,
  });
  
  const resTeam = await teamContract.deployed();
  console.log("Teams deployed to:", teamContract.address);
  // console.dir(resTeam)

  console.log("Deploying ETCH with the account:", signers[0].address);
  const Etch = await ethers.getContractFactory("Etches");
  const etchContract = await Etch.deploy(teamContract.address, {
    nonce: Math.floor(Math.random() * (10000 - 1 + 1) + 1),
    gasLimit: 250_000
  });
  await etchContract.deployed();

  console.log("Etches deployed to:", etchContract.address);

  console.log(process.env.EXPORTED_CONTRACT_FILE);

  const network = process.env.HARDHAT_NETWORK || "";
  const exportedContractFile = process.env.EXPORTED_CONTRACT_FILE || "";
  const exportedContractPath = path.join(__dirname, "../../web/src/contracts/", exportedContractFile + network + ".json");

  console.log("exportedContractPath", exportedContractPath);
  const exportedContract = {
    Org: orgContract.address,
    Team: teamContract.address,
    Etch: etchContract.address,
    // ENS: ensContract.address,
  };

  fs.writeFileSync(exportedContractPath, JSON.stringify(exportedContract));




  if (network != "hardhat" && network != "") {
    //   await tenderly.verify({
    //     name: "EtchENS",
    //     address: orgContract.address,
    //   });


    // await tenderly.verify({
    //   name: "Organisations",
    //   address: orgContract.address,
    // });

    // await tenderly.verify({
    //   name: "Teams",
    //   address: teamContract.address,
    // });

    // await tenderly.verify({
    //   name: "Etches",
    //   address: etchContract.address,
    // });

    const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    sleep(1000);

    // await run("verify:verify", {
    //   address: ensContract.address,
    //   constructorArguments: [orgContract.address],
    // });

    await run("verify:verify", {
      address: orgContract.address,
      constructorArguments: [],
    });

    await run("verify:verify", {
      address: teamContract.address,
      constructorArguments: [orgContract.address],
    });

    await run("verify:verify", {
      address: etchContract.address,
      constructorArguments: [teamContract.address],
    });
  }

  const totalSupply = Number(await etchContract.getTotalSupply());
  const totalSupplyTeam = Number(await teamContract.getNumberOfTeamsCreated());
  const totalSupplyOrg = Number(await orgContract.getNumberOfOrganisationsCreated());

  await etchContract.safeMint(signers[0].address, DocName, IPFSCid);
  console.log("1: created etchId");

  let tx = await teamContract.createTeam(signers[0].address, "The first ever Team", []);
  await tx.wait(1);
  console.log("2: created teamId");

  await etchContract.safeMintForTeam(1, DocName, IPFSCid); // for teamId = 1
  console.log("3: created etchId for team");

  tx = await teamContract.createTeam(signers[1].address, "The second ever Team", []);
  await tx.wait(1);
  console.log("4: created teamId");

  tx = await teamContract["safeTransferFrom(address,address,uint256)"](
    signers[0].address,
    signers[1].address,
    1 + totalSupplyTeam
  );
  await tx.wait(1);
  console.log("5: transferred teamId");

  tx = await teamContract
    .connect(signers[1])
  ["safeTransferFrom(address,address,uint256)"](signers[1].address, signers[0].address, 1 + totalSupplyTeam);
  await tx.wait(1);
  console.log("6: transferred teamId");

  await etchContract.connect(signers[0]).transferToTeam(2 + totalSupply, 2 + totalSupplyTeam); // etchId = 2, teamId = 2
  console.log("7: transferred etchId to team");

  tx = await teamContract.createTeam(signers[0].address, "The third ever Team", []);
  await tx.wait(1);
  console.log("8: created teamId");

  tx = await teamContract.setPermission(3 + totalSupplyTeam, signers[1].address, ETeamPermissions.READWRITE);
  await tx.wait(1);
  console.log("9: set permission");

  await etchContract.connect(signers[1]).safeMintForTeam(3 + totalSupplyTeam, DocName, IPFSCid);
  console.log("10: created etchId for team");

  tx = await teamContract.connect(signers[0]).createTeam(signers[0].address, "The fourth ever Team", []);
  await tx.wait(1);
  console.log("11: created teamId");

  await etchContract.connect(signers[0]).safeMintForTeam(4 + totalSupplyTeam, DocName, IPFSCid);
  console.log("12: created etchId for team");

  await orgContract.connect(signers[0]).createOrganisation(signers[0].address, "The first ever Org", []);
  tx = await teamContract.connect(signers[0]).transferToOrganisation(4 + totalSupplyTeam, 1 + totalSupplyOrg); // teamId = 4, orgId = 1
  await tx.wait(1);
  console.log("13: transferred teamId to org");

  tx = await orgContract["safeTransferFrom(address,address,uint256)"](signers[0].address, signers[1].address, 1 + totalSupplyOrg);
  await tx.wait(1);
  console.log("14: transferred orgId");

  tx = await orgContract
    .connect(signers[1])
  ["safeTransferFrom(address,address,uint256)"](signers[1].address, signers[0].address, 1 + totalSupplyOrg);
  await tx.wait(1);
  console.log("15: transferred orgId");

  tx = await orgContract.setPermission(1 + totalSupplyOrg, signers[1].address, EOrgPermissions.ADMIN);
  await tx.wait(1);
  console.log("16: set permission");

  await orgContract.connect(signers[1]).setPermission(1 + totalSupplyOrg, signers[2].address, EOrgPermissions.MEMBER);
  console.log("17: set permission");

  await teamContract.connect(signers[1]).setPermission(4 + totalSupplyTeam, signers[1].address, ETeamPermissions.READWRITE);
  console.log("18: set permission");

  await teamContract.connect(signers[1]).setPermission(4 + totalSupplyTeam, signers[2].address, ETeamPermissions.READ);
  console.log("19: set permission");

  console.log("done.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});