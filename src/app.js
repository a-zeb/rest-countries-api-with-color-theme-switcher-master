const themeButton = document.getElementById('theme-toggle');

function start() {
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

start();
