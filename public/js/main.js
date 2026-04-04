(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const form = document.querySelector('[data-donation-form]');
  const msg = document.querySelector('[data-form-msg]');

  if (form && msg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      msg.classList.remove('error', 'success');

      const fd = new FormData(form);
      const payload = {
        donor_name: fd.get('donor_name')?.toString().trim(),
        donor_email: fd.get('donor_email')?.toString().trim(),
        amount: Number(fd.get('amount')),
        payment_method: fd.get('payment_method'),
        message: fd.get('message')?.toString().trim() || null,
      };

      try {
        const res = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          msg.textContent = data.error || 'Something went wrong. Try again.';
          msg.classList.add('error');
          return;
        }

        msg.textContent = 'Thank you — your pledge was recorded. Follow the payment instructions you receive.';
        msg.classList.add('success');
        form.reset();
      } catch {
        msg.textContent = 'Network error — is the server running?';
        msg.classList.add('error');
      }
    });
  }
})();
