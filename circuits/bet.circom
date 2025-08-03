pragma circom 2.0.0;

template BetCommitment() {
    signal input videoId;
    signal input stake;
    signal input secret;
    signal output commitment;

    // For demo purposes: just add values (replace with Poseidon/MiMC hash for production)
    commitment <== videoId + stake + secret;
}

component main = BetCommitment();
