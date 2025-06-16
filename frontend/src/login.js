function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error('Invalid login');
      return res.json();
    })
    .then(user => {
      console.log("Logged in user:", user);
      window.location.href = "home.html";
    })
    .catch(err => {
      document.getElementById('login-error').textContent = 'Login failed. Try again.';
    });
}

function register() {
  window.location.href = "register.html";
}