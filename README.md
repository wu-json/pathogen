# pathogen

Senior thesis project for using Solana to store public health data. More updates coming soon...

## Quick Start

- Install node (v16 recommended)
- Install yarn
- Install Rust v1.56.1 or later from [https://rustup.rs/](https://rustup.rs/)
- Install Solana v1.8.14 or later from [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools)
- Install Anchor v0.24.2 or later from [https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)

### Configure CLI

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

### Start local Solana cluster and logs

This example connects to a local Solana cluster by default.

Start a local Solana cluster:

```bash
solana-test-validator
```

To log transactions on the cluster, you can run the following:

```bash
solana logs
```

### Deploying the On-chain Program

To deploy the on-chain program, run the following commands:

```bash
yarn build:program-rust
yarn deploy:program-rust
```

Once the program is deployed, you can then run the client like so:

```bash
yarn start:client
```

### Airdrop SOL into your default account

If your keypair account balance is zero request SOL from your local Solana cluster faucet:

```bash
# replace n with the amount of solana to airdrop
solana airdrop n
```
