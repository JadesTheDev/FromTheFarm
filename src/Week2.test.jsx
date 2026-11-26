import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from './App';
const products=[{id:1,name:'Heirloom Tomatoes',description:'Fresh tomatoes.',unitPriceCents:399,unit:'lb',stock:30}];
beforeEach(()=>{global.fetch=jest.fn(async()=>({ok:true,json:async()=>({products,quantities:{},totals:{subtotal:0,tax:0,shipping:0,total:0},csrfToken:'test-token'})}));});
test('original homepage and menu lead to the database catalog and cart',async()=>{
 render(<App/>);
 expect(screen.getByText('Come eat local.')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Menu'}));
 fireEvent.click(screen.getByRole('menuitem',{name:/Shopping Cart/}));
 await screen.findByText('Your cart is empty.');
 fireEvent.click(screen.getByRole('button',{name:'Continue Shopping'}));
 await screen.findByText('1 local items');
 expect(screen.getByRole('button',{name:'Add to Cart'})).toBeTruthy();
});
test('database failure is shown and does not silently use demo products',async()=>{
 global.fetch=jest.fn(async()=>({ok:false,json:async()=>({error:'Database unavailable'})}));
 render(<App/>);
 await screen.findByRole('alert');
 fireEvent.click(screen.getByRole('button',{name:'Browse Listings'}));
 expect(screen.queryByRole('button',{name:'Add to Cart'})).toBeNull();
});
test('add uses the server quantity and checkout returns to listings',async()=>{
 let quantities={};
 global.fetch=jest.fn(async(url,options)=>{
  if(options.method==='POST'){
   const body=JSON.parse(options.body);expect(body.csrfToken).toBe('test-token');
   if(body.action==='add')quantities={1:body.quantity};
   if(body.action==='checkout')quantities={};
  }
  const subtotal=(quantities[1]||0)*399;
  return {ok:true,json:async()=>({products,quantities,csrfToken:'test-token',totals:{subtotal,tax:Math.round(subtotal*.05),shipping:Math.round(subtotal*.1),total:subtotal+Math.round(subtotal*.05)+Math.round(subtotal*.1)}})};
 });
 render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Browse Listings'}));
 const add=await screen.findByRole('button',{name:'Add to Cart'});
 await waitFor(()=>expect(add.disabled).toBe(false));
 fireEvent.click(add);await screen.findByText('Product ID: 1 · In cart: 1');
 fireEvent.click(screen.getByRole('button',{name:'Menu'}));fireEvent.click(screen.getByRole('menuitem',{name:/Shopping Cart/}));
 expect(screen.getByText('$4.59')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Check Out'}));await screen.findByRole('heading',{name:'Listings'});
});
