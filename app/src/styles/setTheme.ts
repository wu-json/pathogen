const setTheme = (isDarkMode: boolean) => {
  const html = document.querySelector('html');
  if (html) {
    html.dataset.theme = isDarkMode ? 'theme-dark' : 'theme-light';
  }
};

export default setTheme;
