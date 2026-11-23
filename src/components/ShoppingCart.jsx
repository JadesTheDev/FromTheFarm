// SDC310L Week 2: cart page framework within the original application.
function ShoppingCart({ onContinueShopping }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div><p className="page-eyebrow">Your local picks</p><h2>Shopping Cart</h2></div>
      </div>
      <div className="community-banner">
        <div>
          <h3>Your cart is empty.</h3>
          <p>Shopping cart features are under construction. You will be able to review quantities, item totals, tax, and shipping here.</p>
        </div>
        <button type="button" onClick={onContinueShopping}>Continue Shopping</button>
      </div>
    </section>
  );
}
export default ShoppingCart;
