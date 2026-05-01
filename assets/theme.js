// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE MENU ──
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-item, .step, .testi-card, .product-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  revealObserver.observe(el);
});

// ── CART AJAX ADD ──
const productForm = document.getElementById('product-form');
if (productForm) {
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = productForm.querySelector('[name="add"]');
    const originalText = btn.textContent;
    btn.textContent = 'Adding...';
    btn.disabled = true;

    try {
      const formData = new FormData(productForm);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, quantity: parseInt(data.quantity) || 1 })
      });

      if (res.ok) {
        btn.textContent = '✓ Added!';
        btn.style.background = '#4a7c59';

        // Update cart count
        const cartRes = await fetch('/cart.js');
        const cart = await cartRes.json();
        const countEl = document.getElementById('cart-count');
        if (countEl) countEl.textContent = cart.item_count;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 2000);
      } else {
        throw new Error('Add to cart failed');
      }
    } catch (err) {
      btn.textContent = 'Error — Try Again';
      btn.style.background = '#8b3a3a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    }
  });
}

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
