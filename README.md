# Privacy Betting PoC

This project demonstrates a privacy-preserving betting system for video events using zk-SNARKs (Circom) and Ethereum.

## Structure

- `circuits/bet.circom` — Circom circuit for generating privacy-preserving commitments
- `contracts/Betting.sol` — Minimal Solidity contract for storing bets
- `frontend/` — Next.js PoC frontend for interacting with contract
- `test/Betting.ts` — Hardhat test for betting contract
- `hardhat.config.ts` — Hardhat configuration

## Setup

### 1. Compile Circom circuit

- Install [circom](https://docs.circom.io/getting-started/installation/)
- Compile: `circom circuits/bet.circom --r1cs --wasm --sym`

### 2. Deploy the smart contract

- Copy `.env.example` to `.env` and add your Sepolia private key
- `npx hardhat run scripts/deploy.ts --network sepolia`
- Save the deployed address in `frontend/pages/index.tsx`

### 3. Run frontend

- `cd frontend && npm install && npm run dev`
- Open [localhost:3000](http://localhost:3000)

### 4. Run tests

- `npx hardhat test`

## Notes

- This PoC uses keccak256 as a commitment hash in frontend and tests for simplicity; replace with real Poseidon hash for production.
- ZKP proof generation & verification are stubbed out; see Circom/zk-SNARK docs to integrate real proof workflow.

## License

MIT
