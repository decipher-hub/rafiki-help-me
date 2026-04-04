const TOKEN_KEY = 'token';
const USER_KEY = 'rafiki_user';

function showMessage(el, text, kind) {
  if (!el) return;
  el.textContent = text || '';
  el.classList.remove('msg--error', 'msg--success');
  if (kind === 'error') el.classList.add('msg--error');
  if (kind === 'success') el.classList.add('msg--success');
  el.hidden = !text;
}

async function parseJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function postAuth(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  return { res, data };
}

function persistSession(data) {
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
}

function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    window.location.href = next;
    return;
  }
  window.location.href = '/dashboard.html';
}

async function onLoginSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.querySelector('[data-auth-message]');
  showMessage(msg, '', null);

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showMessage(msg, 'Please enter email and password.', 'error');
    return;
  }

  const { res, data } = await postAuth('/api/auth/login', { email, password });

  if (!res.ok) {
    showMessage(msg, data.error || 'Login failed.', 'error');
    return;
  }

  persistSession(data);
  showMessage(msg, 'Welcome back — redirecting…', 'success');
  redirectAfterAuth();
}

async function onSignupSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.querySelector('[data-auth-message]');
  showMessage(msg, '', null);

  const email = form.email.value.trim();
  const password = form.password.value;
  const name = form.name?.value?.trim() || '';

  if (!email || !password) {
    showMessage(msg, 'Email and password are required.', 'error');
    return;
  }
  if (password.length < 6) {
    showMessage(msg, 'Password must be at least 6 characters.', 'error');
    return;
  }

  const { res, data } = await postAuth('/api/auth/signup', {
    email,
    password,
    name: name || undefined,
  });

  if (!res.ok) {
    showMessage(msg, data.error || 'Sign up failed.', 'error');
    return;
  }

  persistSession(data);
  showMessage(msg, 'Account created — redirecting…', 'success');
  redirectAfterAuth();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', onLoginSubmit);
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', onSignupSubmit);
  }
});
