#!/usr/bin/env node
/* VIGNOVATE site checker (no dependencies): verifies internal links/assets, unique titles/descriptions, one H1 per page,
   canonical URLs and sitemap coverage. Run: node scripts/check-site.js */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const pages = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!['node_modules', '.git', 'scripts'].includes(f)) walk(p); } else if (f.endsWith('.html')) pages.push(p); } })(root);
let errors = 0; const titles = new Map(), descs = new Map();
const err = m => { errors++; console.log('ERROR', m); };
const sitemap = fs.existsSync(path.join(root, 'sitemap.xml')) ? fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8') : '';
for (const p of pages) {
  const rel = path.relative(root, p).replace(/\\/g, '/'), s = fs.readFileSync(p, 'utf8');
  const t = (s.match(/<title>(.*?)<\/title>/) || [])[1], d = (s.match(/name="description" content="(.*?)"/) || [])[1];
  if (!t) err(rel + ': missing title'); else { if (titles.has(t)) err(`${rel}: duplicate title with ${titles.get(t)}`); titles.set(t, rel); if (t.length > 65) err(`${rel}: title long (${t.length})`); }
  if (!d) err(rel + ': missing description'); else { if (descs.has(d)) err(`${rel}: duplicate description`); descs.set(d, rel); if (d.length > 165) err(`${rel}: description long (${d.length})`); }
  const h1 = (s.match(/<h1[ >]/g) || []).length; if (h1 !== 1) err(`${rel}: ${h1} h1 elements`);
  if (rel !== '404.html') { if (!s.includes('rel="canonical"')) err(rel + ': missing canonical'); const url = 'https://vignovate.in/' + (rel === 'index.html' ? '' : rel); if (!sitemap.includes('<loc>' + url + '</loc>')) err(rel + ': not in sitemap'); }
  const base = path.dirname(p);
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let u = m[1]; if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue; u = u.split('#')[0].split('?')[0]; if (!u) continue;
    const target = rel === '404.html' ? path.join(root, u) : path.resolve(base, u);
    if (!fs.existsSync(target)) err(`${rel}: broken reference ${m[1]}`);
  }
}
console.log(`${pages.length} pages checked, ${errors} problem(s)`); process.exit(errors ? 1 : 0);
