const form = document.querySelector('form');
const usernameInput = document.querySelector('form input[id=username]');
const passwordInput = document.querySelector('form input[id=password]');

form.addEventListener('submit', event => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  logIn(username, password);
});
 
function logIn(user, password) {}
