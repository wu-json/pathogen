# Set to devnet
solana config set --url devnet

# Keeps requesting airdrop in intervals of 60 seconds
while true; do solana airdrop 1; sleep 60; done
