// Simple token debug
const token = process.argv[2];
if (!token) {
  console.log('Usage: node debug_token.js <token>');
  process.exit(1);
}

const parts = token.split('.');
console.log('Token parts:', parts.length);
console.log('Part 1 (header):', parts[0]);
console.log('Part 2 (payload):', parts[1]);
console.log('Part 3 (signature):', parts[2]);

if (parts.length === 3) {
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    console.log('Decoded payload:', payload);
    console.log('Token expires at:', new Date(payload.exp * 1000));
    console.log('Current time:', new Date());
  } catch (e) {
    console.log('Failed to decode:', e.message);
  }
}
