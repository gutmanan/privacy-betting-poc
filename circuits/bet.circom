pragma circom 2.0.0;

include "circomlib/poseidon.circom";

template Bet(
    N,         // max videoId
    MIN_STAKE, // minimum stake value
    MAX_STAKE  // maximum stake value
) {
    // Private inputs
    signal input videoId;
    signal input stake;
    signal input userSecret;

    // Public output
    signal output commitment;

    // Range checks
    videoId --> isLessEq(videoId, N);
    videoId --> isGreaterEq(videoId, 1);

    stake --> isLessEq(stake, MAX_STAKE);
    stake --> isGreaterEq(stake, MIN_STAKE);

    // Poseidon commitment
    component hash = Poseidon(3);
    hash.inputs[0] <== videoId;
    hash.inputs[1] <== stake;
    hash.inputs[2] <== userSecret;

    commitment <== hash.out;
}

// Helper circuits for range checks
template isLessEq(a, b) {
    signal input a;
    signal input b;
    assert(a <= b);
}

template isGreaterEq(a, b) {
    signal input a;
    signal input b;
    assert(a >= b);
}

// Instantiate with parameters
component main = Bet(10, 1, 100); // N=10 videos, stake 1..100
