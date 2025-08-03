pragma circom 2.0.0;

include "lib/poseidon.circom";

template Bet() {
    // Public inputs
    signal input entryId;
    signal input stake;

    // Private input
    signal input userSecret;

    // Output
    signal output commitment;

    // Poseidon hash commitment
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== entryId;
    poseidon.inputs[1] <== stake;
    poseidon.inputs[2] <== userSecret;

    commitment <== poseidon.out;
}

component main = Bet();
