import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useStickyState from './hooks/useStickyState';
import setTheme from './styles/setTheme';

const App = () => {
  const [isDarkMode] = useStickyState<boolean>(true, 'darkMode');

  useEffect(() => setTheme(isDarkMode), [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
