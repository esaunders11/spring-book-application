function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;

  fetch('http://localhost:8080/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error('Invalid register');
      return res.json();
    })
    .then(user => {
      console.log("Registered user:", user);
      window.location.href = "index.html";
    })
    .catch(err => {
      document.getElementById('register-error').textContent = 'Registry failed. Try again.';
    });
}