import { network } from "hardhat";

// const { ethers } = await network.connect({
//   network: "hardhatOp",
//   chainType: "op",
// });

// console.log("Sending transaction using the OP chain type");

// const [sender] = await ethers.getSigners();

// console.log("Sending 1 wei from", sender.address, "to itself");

// console.log("Sending L2 transaction");
// const tx = await sender.sendTransaction({
//   to: sender.address,
//   value: 1n,
// });

// await tx.wait();

// console.log("Transaction sent successfully");




const main = async () =>
{

  const { ethers } = await network.connect({
    network: "hardhatOp",
    chainType: "op",
  });
  // const { ethers } = await network.connect(
  //   {
  //     network: "sepolia",
  //     chainType: "l1",
  //   }
  // )

  console.log("Deploying contract to Sepolia testnet");

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const Factory = await ethers.getContractFactory("Transactions");
  const transactions = await Factory.deploy();
  console.log("Transactions : ",await transactions.getAddress);

  // await transactions.deployed();

  
}

const runMain = async () =>
{
  try 
  {
    await main();
    process.exit(0);
  }
  catch (error)
  {
    console.error(error);
    process.exit(1);
  }
}


await runMain();


