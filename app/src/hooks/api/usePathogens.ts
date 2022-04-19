import { useEffect, useState } from 'react';

import useWorkspace from '../useWorkspace';

const usePathogens = () => {
  const { program } = useWorkspace();
  const [pathogens, setPathogens] = useState<any[]>([]);

  useEffect(() => {
    if (program) {
      program.account.pathogen.all().then(results => setPathogens(results));
    }
  }, [program]);

  return pathogens;
};

export default usePathogens;
