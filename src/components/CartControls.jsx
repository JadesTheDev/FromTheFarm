import {useState} from 'react';
import {useShop} from '../context/ShopContext';
export default function CartControls({product}) {
  const {quantities,change,busy,loading} = useShop();
  const [amount,setAmount] = useState('1');
  const current=quantities[product.id] || 0;
  const available=Math.max(0,Math.min(999,product.stock)-current);
  return <div className="cart-controls">
    <p>Product ID: {product.id} · In cart: {current}</p>
    <form onSubmit={async e=>{e.preventDefault();await change('add',product.id,Number(amount));}}>
      <label>Quantity for {product.name}<input type="number" min="1" max={available || 1} step="1" required value={amount} onChange={e=>setAmount(e.target.value)} disabled={!available || busy || loading}/></label>
      <button type="submit" disabled={!available || busy || loading}>{available ? 'Add to Cart' : 'Unavailable'}</button>
    </form>
    {current > 0 && <div className="cart-buttons">
      <button type="button" aria-label={`Decrease ${product.name}`} disabled={busy} onClick={()=>change('update',product.id,current-1)}>−</button>
      <button type="button" aria-label={`Increase ${product.name}`} disabled={busy || !available} onClick={()=>change('update',product.id,current+1)}>+</button>
      <button type="button" disabled={busy} onClick={()=>change('remove',product.id)}>Remove</button>
    </div>}
  </div>;
}
