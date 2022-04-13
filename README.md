# pathogen

Senior thesis project for using Solana to store public health data. More updates coming soon...

## Quick Start

- Install node (v16 recommended)
- Install yarn
- Install Rust v1.56.1 or later from [https://rustup.rs/](https://rustup.rs/)
- Install Solana v1.8.14 or later from [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools)

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

### Start local Solana cluster

This example connects to a local Solana cluster by default.

Start a local Solana cluster:

```bash
solana-test-validator
```
