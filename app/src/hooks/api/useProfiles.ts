import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

import useWorkspace from '../useWorkspace';

const useProfiles = (pathogenPublicKey: PublicKey) => {
  const { program } = useWorkspace();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [ready, setReady] = useState<boolean>(true);

  useEffect(() => {
    if (program) {
      program.account.profile
        .all([
          {
            memcmp: {
              offset:
                8 + // Discriminator
                32, // Creator public key
              bytes: pathogenPublicKey.toBase58(),
            },
          },
        ])
        .then(results => {
          setProfiles(results);
          setReady(true);
        });
    }
  }, [program]);

  return { profiles, setProfiles, profilesReady: ready };
};

export default useProfiles;
