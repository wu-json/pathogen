import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { DateTime } from 'luxon';
import { useCallback } from 'react';

import { TestResult } from '../../types';
import useWorkspace from '../useWorkspace';

const useCreateProfile = () => {
  const { wallet, program } = useWorkspace();

  const createProfile = useCallback(
    async (
      pathogen: PublicKey,
      latestTestResult: TestResult,
      latestTestResultDate: DateTime,
      age: number,
    ) => {
      if (!wallet || !program) {
        return null;
      }

      const profile = web3.Keypair.generate();

      await program.methods
        .createProfile(
          latestTestResult,
          new BN(latestTestResultDate.toMillis()),
          age,
        )
        .accounts({
          pathogen,
          profile: profile.publicKey,
          creator: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([profile])
        .rpc();

      const profileAccount = await program.account.profile.fetch(
        profile.publicKey,
      );

      return {
        publicKey: profile.publicKey,
        account: profileAccount,
      };
    },
    [wallet, program],
  );

  return { createProfile };
};

export default useCreateProfile;
