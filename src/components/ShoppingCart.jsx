import {useShop,money} from '../context/ShopContext';
import './ShoppingCart.css';
export default function ShoppingCart({onContinueShopping}) {
  const {products,quantities,totals,loading,busy,change,error} = useShop();
  const items=products.filter(p=>quantities[p.id]>0);
  return <section className="content-section">
    <div className="section-heading-row"><div><p className="page-eyebrow">Your local picks</p><h2>Shopping Cart</h2></div><button type="button" onClick={onContinueShopping}>Continue Shopping</button></div>
    {loading ? <p>Loading your cart…</p> : !items.length ? <p>{error ? 'Your cart could not be loaded.' : 'Your cart is empty.'}</p> : <>
      <div className="cart-table-wrap"><table className="cart-table"><caption>Your selected products</caption><thead><tr><th>Product ID</th><th>Product</th><th>Quantity</th><th>Unit cost</th><th>Product total</th><th>Actions</th></tr></thead><tbody>
        {items.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{quantities[p.id]}</td><td>{money(p.unitPriceCents)}</td><td>{money(p.unitPriceCents*quantities[p.id])}</td><td><div className="cart-buttons">
          <button type="button" disabled={busy} aria-label={`Decrease ${p.name}`} onClick={()=>change('update',p.id,quantities[p.id]-1)}>−</button>
          <button type="button" disabled={busy || quantities[p.id]>=Math.min(999,p.stock)} aria-label={`Increase ${p.name}`} onClick={()=>change('update',p.id,quantities[p.id]+1)}>+</button>
          <button type="button" disabled={busy} onClick={()=>change('remove',p.id)}>Remove</button>
        </div></td></tr>)}
      </tbody></table></div>
      <dl className="cart-totals"><dt>Items subtotal</dt><dd>{money(totals.subtotal)}</dd><dt>Tax (5%)</dt><dd>{money(totals.tax)}</dd><dt>Shipping and handling (10%)</dt><dd>{money(totals.shipping)}</dd><dt>Order total</dt><dd><strong>{money(totals.total)}</strong></dd></dl>
      <p>Course checkout clears your cart. No payment is collected.</p>
      <button type="button" disabled={busy} onClick={async()=>{if(await change('checkout'))onContinueShopping();}}>Check Out</button>
    </>}
  </section>;
}
