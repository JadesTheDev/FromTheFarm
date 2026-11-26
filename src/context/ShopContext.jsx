import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {isPreview, requestShop} from '../services/shop';
const Context = createContext(null);
export const money = cents => `$${(cents / 100).toFixed(2)}`;
export function ShopProvider({children}) {
  const [state,setState] = useState({products:[],quantities:{},totals:{subtotal:0,tax:0,shipping:0,total:0}});
  const [loading,setLoading] = useState(true), [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState('');
  const lock = useRef(false);
  const refresh = useCallback(async()=>{
    setLoading(true); setError('');
    try {setState(await requestShop());} catch(e){setError(e.message);} finally{setLoading(false);}
  },[]);
  useEffect(()=>{refresh();},[refresh]);
  const change = async(action,id,quantity)=>{
    if(lock.current || loading) return false;
    lock.current=true;setBusy(true);setError('');setNotice('');
    try {setState(await requestShop(action,id,quantity));setNotice(action==='checkout'?'Checkout complete. Your cart has been cleared.':'Cart updated.');return true;}
    catch(e){setError(e.message);return false;}
    finally{lock.current=false;setBusy(false);}
  };
  return <Context.Provider value={{...state,loading,busy,error,notice,refresh,change,isPreview}}>{children}</Context.Provider>;
}
export const useShop = () => useContext(Context);
export function ShopStatus(){
  const shop=useShop();
  return <>
    {shop.isPreview && <p className="status-message">Interactive preview — cart changes are saved in this browser. The PHP/MySQL version runs in XAMPP.</p>}
    {shop.error && <div role="alert" className="status-message">{shop.error} <button type="button" onClick={shop.refresh} disabled={shop.loading || shop.busy}>Retry</button></div>}
    {shop.notice && <p role="status" className="status-message">{shop.notice}</p>}
  </>;
}
