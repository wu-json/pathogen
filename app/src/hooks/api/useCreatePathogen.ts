import { web3 } from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from 'bn.js';
import { useCallback } from 'react';

import useWorkspace from '../useWorkspace';

const useCreatePathogen = () => {
  const { wallet, program } = useWorkspace();

  const createPathogen = useCallback(
    async (
      code: string,
      name: string,
      bounty: number,
      rewardPerProfile: number,
    ) => {
      if (!wallet || !program) {
        return null;
      }

      const pathogen = web3.Keypair.generate();

      const signature = await program.methods
        .createPathogen(
          code,
          name,
          new BN(bounty * LAMPORTS_PER_SOL),
          new BN(rewardPerProfile * LAMPORTS_PER_SOL),
        )
        .accounts({
          pathogen: pathogen.publicKey,
          creator: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([pathogen])
        .rpc();

      await program.provider.connection.confirmTransaction(signature);

      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey,
      );

      return pathogenAccount;
    },
    [wallet, program],
  );

  return { createPathogen };
};

export default useCreatePathogen;
