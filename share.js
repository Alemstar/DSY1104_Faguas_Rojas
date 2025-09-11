const shareBtn = document.getElementById('share-btn');
const shareMenu = document.getElementById('share-menu');
const url = window.location.href;
const title = document.title || 'Mil Sabores';

function openFallbackMenu() {
  document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
  document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  shareMenu.hidden = false;
  shareBtn.setAttribute('aria-expanded', 'true');
  shareMenu.querySelector('.share-link').focus();
}

function closeFallbackMenu() {
  shareMenu.hidden = true;
  shareBtn.setAttribute('aria-expanded', 'false');
  shareBtn.focus();
}

shareBtn.addEventListener('click', async (e) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      openFallbackMenu();
    }
  } else {
    openFallbackMenu();
  }
});

shareBtn.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (shareMenu.hidden) openFallbackMenu(); else closeFallbackMenu();
  }
});

shareMenu.addEventListener('keydown', (e) => {
  const links = Array.from(shareMenu.querySelectorAll('.share-link'));
  const idx = links.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = links[(idx + 1) % links.length];
    next.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = links[(idx - 1 + links.length) % links.length];
    prev.focus();
  } else if (e.key === 'Escape') {
    closeFallbackMenu();
  }
});

document.addEventListener('click', (e) => {
  if (!shareBtn.contains(e.target) && !shareMenu.contains(e.target) && !shareMenu.hidden) {
    closeFallbackMenu();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (shareMenu) shareMenu.hidden = true;
});

window.__openShareFallback = openFallbackMenu;
