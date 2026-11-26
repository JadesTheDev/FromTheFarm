import {calculateTotals} from './shop';
test('currency is calculated in cents, with 5% tax and 10% shipping',()=>{
 expect(calculateTotals([{id:1,unitPriceCents:399},{id:3,unitPriceCents:900}],{1:2,3:1})).toEqual({subtotal:1698,tax:85,shipping:170,total:1953});
 expect(calculateTotals([],{})).toEqual({subtotal:0,tax:0,shipping:0,total:0});
});
