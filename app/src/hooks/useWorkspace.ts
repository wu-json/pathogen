import { AnchorProvider, Idl, Program } from '@project-serum/anchor';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

import idl from '../idl/pathogen.json';

type Workspace = {
  wallet: AnchorWallet | null;
  connection: Connection;
  provider: AnchorProvider | null;
  program: Program | null;
};

const netUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.devnet.solana.com'
    : 'http://127.0.0.1:8899';

const programID = new PublicKey((idl as any).metadata.address);
const connection = new Connection(netUrl);

const useWorkspace = (): Workspace => {
  const wallet = useAnchorWallet();

  const provider = useMemo(
    () => (wallet ? new AnchorProvider(connection, wallet, {}) : null),
    [wallet],
  );
  const program = useMemo(
    () => (provider ? new Program(idl as Idl, programID, provider) : null),
    [provider],
  );

  return {
    wallet: wallet ?? null,
    connection,
    provider,
    program,
  };
};

export default useWorkspace;
