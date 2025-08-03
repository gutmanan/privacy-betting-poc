import { execSync } from "child_process";

const CIRCUITS = ["bet"];

for (const circuit of CIRCUITS) {
    execSync(`circom circuits/${circuit}.circom --r1cs --wasm --sym -o build/`, { stdio: 'inherit' });
    execSync(`snarkjs groth16 setup build/${circuit}.r1cs pot12_final.ptau build/${circuit}_0000.zkey`, { stdio: 'inherit' });
    execSync(`snarkjs zkey contribute build/${circuit}_0000.zkey build/${circuit}_final.zkey --name="${circuit} contribution"`, { stdio: 'inherit' });
    execSync(`snarkjs zkey export verificationkey build/${circuit}_final.zkey build/${circuit}_verification_key.json`, { stdio: 'inherit' });
    execSync(`snarkjs zkey export solidityverifier build/${circuit}_final.zkey contracts/${circuit.charAt(0).toUpperCase() + circuit.slice(1)}Verifier.sol`, { stdio: 'inherit' });
}
console.log("Setup complete");
