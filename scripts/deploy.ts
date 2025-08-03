import { ethers } from "hardhat";
import { poseidonContract } from "circomlibjs";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);

    // 1) Deploy Poseidon contract directly from circomlibjs
    const abi = poseidonContract.generateABI(3); // 3-input Poseidon
    const bytecode = poseidonContract.createCode(3);

    const PoseidonFactory = new ethers.ContractFactory(abi, bytecode, deployer);
    const poseidon = await PoseidonFactory.deploy();
    await poseidon.deployed();
    console.log("Poseidon deployed at:", poseidon.address);

    // 2) Deploy Verifier (already compiled from circuits)
    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();
    console.log("Verifier deployed at:", verifier.address);

    // 3) Deploy Betting contract, passing Poseidon address
    const Betting = await ethers.getContractFactory("Betting");
    const betting = await Betting.deploy(verifier.address, poseidon.address);
    await betting.deployed();
    console.log("Betting deployed at:", betting.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
