/**
 * Grades API base URL (no trailing slash).
 * Override at build time with VITE_API_URL, e.g. VITE_API_URL=https://api.example.com npm run build
 */
export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
