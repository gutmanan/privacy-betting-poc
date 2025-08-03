import { ethers } from "hardhat";
import { expect } from "chai";

describe("Betting", function () {
  it("should store commitments", async function () {
    const Betting = await ethers.getContractFactory("Betting");
    const betting = await Betting.deploy();
    await betting.deployed();

    const [user] = await ethers.getSigners();
    const commitment = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "uint256"],
        [3, 50, 123456]
      )
    );
    await betting.connect(user).placeBet(commitment);

    const userBets = await betting.getUserBets(user.address);
    expect(userBets[0]).to.equal(commitment);

    const allBets = await betting.getAllBets();
    expect(allBets[0]).to.equal(commitment);
  });
});
