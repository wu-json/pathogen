import { useEffect, useState } from 'react';

import useWorkspace from '../useWorkspace';

const usePathogens = () => {
  const { program } = useWorkspace();
  const [pathogens, setPathogens] = useState<any[]>([]);
  const [ready, setReady] = useState<boolean>(true);

  useEffect(() => {
    if (program) {
      program.account.pathogen.all().then(results => {
        setPathogens(results);
        setReady(true);
      });
    }
  }, [program]);

  return { pathogens, setPathogens, pathogensReady: ready };
};

export default usePathogens;
