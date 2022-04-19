import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useStickyState from './hooks/useStickyState';
import Home from './screens/Home';
import setTheme from './styles/setTheme';

const App = () => {
  const [isDarkMode] = useStickyState<boolean>(true, 'darkMode');

  useEffect(() => setTheme(isDarkMode), [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
