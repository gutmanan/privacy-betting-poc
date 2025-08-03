import { useState } from "react";
import { ethers } from "ethers";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xYourContractAddressHere";
const ABI = [
  "function placeBet(bytes32 commitment) external",
  "function getUserBets(address user) external view returns (bytes32[])",
];

export default function Home() {
  const [videoId, setVideoId] = useState(1);
  const [stake, setStake] = useState(1);
  const [secret, setSecret] = useState("");
  const [txHash, setTxHash] = useState("");
  const [userBets, setUserBets] = useState<string[]>([]);

  async function placeBet() {
    if (!window.ethereum) return alert("No wallet found!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Simple commitment
    const commitment = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "uint256"],
        [videoId, stake, secret ? parseInt(secret) : 0]
      )
    );

    const tx = await contract.placeBet(commitment);
    await tx.wait();
    setTxHash(tx.hash);
    fetchUserBets(signer);
  }

  async function fetchUserBets(signer?: any) {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = signer || (await provider.getSigner());
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);
    const bets = await contract.getUserBets(await _signer.getAddress());
    setUserBets(bets.map((b: string) => b));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Privacy Betting PoC</h1>
      <div>
        <label>
          Video ID:
          <input
            type="number"
            value={videoId}
            min={1}
            max={10}
            onChange={e => setVideoId(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Stake:
          <input
            type="number"
            value={stake}
            min={1}
            max={100}
            onChange={e => setStake(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Secret:
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
          />
        </label>
      </div>
      <button onClick={placeBet}>Place Bet</button>
      {txHash && <div>Tx Hash: {txHash}</div>}
      <hr />
      <button onClick={() => fetchUserBets()}>Refresh My Bets</button>
      <ul>
        {userBets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}