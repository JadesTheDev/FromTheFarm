import { catalogProducts } from '../data/marketplaceData';

export const isPreview = window.location.hostname.endsWith('.github.io');
const key = 'from-the-farm-preview-cart-v1';
const descriptions = ['Fresh heirloom tomatoes.', 'Fragrant fresh basil.', 'Local wildflower honey.', 'Fresh sweet corn.', 'Farm fresh eggs.', 'Tender baby spinach.', 'Seasonal golden peaches.', 'Local chicken breast.', 'Small-batch bacon.'];
export function decorate(rows) {
  return rows.map(row => {
    const original = catalogProducts.find(p => p.id === row.id);
    return {...original, ...row, image: original?.image, supplier: original?.supplier || {name: 'Local producer', description: '', rating: '—'}, category: original?.category || 'Local Food',
      price: `$${(row.unitPriceCents / 100).toFixed(2)} / ${row.unit}`,
      availability: row.stock === 0 ? 'Out of Stock' : row.stock < 15 ? 'Low Stock' : 'In Stock'};
  });
}
export function calculateTotals(products, quantities) {
  const subtotal = products.reduce((sum, p) => sum + p.unitPriceCents * (quantities[p.id] || 0), 0);
  const tax = Math.round(subtotal * .05), shipping = Math.round(subtotal * .10);
  return {subtotal, tax, shipping, total: subtotal + tax + shipping};
}
function previewState() {
  const products = decorate(catalogProducts.map((p,i) => ({id:p.id, name:p.name, description:descriptions[i], unitPriceCents:Math.round(Number(p.price.split(' / ')[0].slice(1))*100), unit:p.price.split(' / ')[1], stock: p.availability === 'Out of Stock' ? 0 : p.availability === 'Low Stock' ? 10 : 30})));
  let saved = {};
  try {saved = JSON.parse(localStorage.getItem(key) || '{}') || {};} catch {}
  const quantities = {};
  products.forEach(p => {if (Number.isInteger(saved[p.id]) && saved[p.id] > 0 && saved[p.id] <= p.stock) quantities[p.id] = saved[p.id];});
  return {products, quantities, totals:calculateTotals(products, quantities)};
}
let token = '';
export async function requestShop(action, productId, quantity) {
  if (isPreview) {
    const state = previewState();
    if (action === 'checkout') state.quantities = {};
    else if (action) {
      const product = state.products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found.');
      const next = action === 'remove' ? 0 : action === 'add' ? (state.quantities[productId] || 0) + quantity : quantity;
      if (!Number.isInteger(next) || next < 0 || next > Math.min(999,product.stock)) throw new Error('Enter a whole-number quantity within the available stock.');
      if (next === 0) delete state.quantities[productId]; else state.quantities[productId] = next;
    }
    localStorage.setItem(key,JSON.stringify(state.quantities));
    return {...state,totals:calculateTotals(state.products,state.quantities)};
  }
  const options = action ? {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action, productId, quantity, csrfToken:token})} : {credentials:'same-origin'};
  const response = await fetch(new URL('api.php', window.location.href), options);
  let data;
  try {data = await response.json();} catch {throw new Error('The PHP shop service could not be reached. Open this app through XAMPP.');}
  if (!response.ok) throw new Error(data.error || 'Unable to update the cart.');
  token = data.csrfToken;
  return {...data,products:decorate(data.products)};
}
