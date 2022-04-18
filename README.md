# pathogen

Pathogen is my senior thesis project, and is a Solana dApp for storing public health data. Organizations that need public health data for a certain disease can create pathogen bounties in SOL/lamports. Accounts can then submit their diagnostic data in exchange for shares of the bounty. Once I finish writing my thesis, I will link it somewhere in this ReadMe...

## Quick Start

- Install node (v16 recommended)
- Install yarn
- Install Rust v1.56.1 or later from [https://rustup.rs/](https://rustup.rs/)
- Install Solana v1.8.14 or later from [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools)
- Install Anchor v0.24.2 or later from [https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)

### Configure Solana CLI

> If you're on Windows, it is recommended to use [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run these commands

1. Set config URL to localhost cluster

```bash
solana config set --url localhost
```

2. Create CLI Keypair

If this is your first time using the Solana CLI, you will need to generate a new keypair:

```bash
solana-keygen new
```

### Run the dApp

To run the app, we need to install npm packages, run a local Solana cluster and deploy our dApp, and whip up a client instance:

```bash
# Installs npm packages for dApp and client app
yarn install:all

# Starts local Solana cluster + test validator and deploys app to it
yarn anchor:localnet

# Start the React client
yarn client:start
```

Once you run all of the commands above, you should have Pathogen running on your local machine!

## Other Dev Commands

These aren't required to run Pathogen locally per se, but they are useful for development.

### Start local Solana cluster and logs

Start a local Solana cluster:

```bash
# Runs local cluster
solana-test-validator

# Runs fresh local cluster
solana-test-validator --reset
```

To log transactions on the cluster, you can run the following:

```bash
solana logs
```

### Deploying the On-chain Program

To deploy the on-chain program, run the following command. Note that the local Solana cluster must be running for the deploy step to work.

```bash
yarn anchor:build-and-deploy
```

### Accessing Deployed Program ID

Once the program has been deployed to your local Solana cluster, you can get the program id like so:

```bash
yarn solana:program-id
```

### Airdrop SOL into your default account

If your keypair account balance is zero request SOL from your local Solana cluster faucet:

```bash
# replace n with the amount of solana to airdrop
solana airdrop n
```
