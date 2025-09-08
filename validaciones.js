// Utilidades de validación y perfil mock
export function getProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function isBirthday(profile) {
  if (!profile) return false;
  // profile.birthDate expected as ISO YYYY-MM-DD
  if (!profile.birthDate) return false;
  try {
    const bd = new Date(profile.birthDate);
    const now = new Date();
    return bd.getDate() === now.getDate() && bd.getMonth() === now.getMonth();
  } catch (e) { return false; }
}

export function isOver50(profile) {
  if (!profile) return false;
  if (!profile.birthDate) return false;
  try {
    const bd = new Date(profile.birthDate);
    const now = new Date();
    let age = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
    return age >= 50;
  } catch (e) { return false; }
}

export function validateCoupon(code) {
  if (!code) return { valid: false };
  const c = String(code).trim().toUpperCase();
  if (c === 'FELICES50') return { valid: true, type: 'percent', percent: 10, name: 'FELICES50' };
  // future coupons can be added here
  return { valid: false };
}

// Helper to seed a mock profile (for dev). Not used automatically.
export function seedMockProfile() {
  const example = { name: 'Usuario Ejemplo', birthDate: '1970-09-08' };
  try { localStorage.setItem('userProfile', JSON.stringify(example)); } catch (e) {}
}
