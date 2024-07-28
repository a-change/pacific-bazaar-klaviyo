import {BrProduct} from '@/utils/CommonTypes';
import {createContext, FC, ReactNode, useContext, useEffect, useMemo, useReducer, useState} from 'react';

// =================================================================================
type InitialState = {cart: CartItem[]};

// export type CartItem = {
//   qty: number;
//   name: string;
//   slug: string;
//   price: number;
//   imgUrl?: string;
//   id: string | number;
// };

// interface BrProduct extends BrSearchResult {
//   pid: string;
//   sale_price: number;
//   price: number;
//   sale_price_range: number[];
//   price_range: number[];
//   description: string;
//   thumb_image: string;
//   brand?: string;
//   variants: BrProductVariant[];
//   sku_color?: string;
//   sku_price?: string[];
//   sku_sale_price?: string[];
//   sku_size?: string;
//   inStock?: string;
//   onSale?: string;
// }

// interface BrProductVariant {
//   skuid?: string[] | string;
//   sku_swatch_images?: string[];
//   sku_thumb_images?: string[];
//   mainItem: BrProduct;
//   sku_color?: string;
//   sku_price?: string[];
//   sku_sale_price?: string[];
//   sku_size?: string;
// }

export interface CartItem extends Omit<BrProduct, 'sale_price_range' | 'price_range'> {
  //   pid: string;
  //   sale_price: number;
  //   price: number;
  //   sale_price_range: number[];
  //   price_range: number[];
  //   description: string;
  //   thumb_image: string;
  //   brand?: string;
  //   variants: BrProductVariant[];
  //   sku_color?: string;
  //   sku_price?: string[];
  //   sku_sale_price?: string[];
  //   sku_size?: string;
  //   inStock?: string;
  //   onSale?: string;
  skuid: string;
  qty: number;
}

type CartActionType = {
  type: 'CHANGE_CART_AMOUNT' | 'CLEAR_CART' | 'SET_CART';
  payload: CartItem | CartItem[] | null;
};
type ActionType = CartActionType;

// =================================================================================

const INITIAL_CART = [];

const INITIAL_STATE = {cart: INITIAL_CART};

interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  //@ts-ignore
  state: INITIAL_STATE,
  dispatch: () => {
  },
});

const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case 'CHANGE_CART_AMOUNT':
      let cartList = state.cart;
      let cartItem = action.payload as CartItem;
      let exist = cartList.find(
        (item) => item.skuid === cartItem.skuid && item.pid === cartItem.pid,
      );

      if (cartItem.qty < 1) {
        const filteredCart = cartList.filter(
          (item) => item.pid !== cartItem.pid || item.skuid !== cartItem.skuid,
        );
        return {...state, cart: filteredCart};
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (exist) {
        const newCart = cartList.map((item) =>
          item.skuid === cartItem.skuid && item.pid === cartItem.pid
            ? {...item, qty: cartItem.qty}
            : item,
        );

        return {...state, cart: newCart};
      }

      return {...state, cart: [...cartList, cartItem]};
    case 'CLEAR_CART':
      return {...state, cart: []};
    case 'SET_CART':
      return {...state, cart: action.payload as CartItem[]};
    default: {
      return state;
    }
  }
};

// =======================================================
type AppProviderProps = {children: ReactNode};
// =======================================================

export const AppProvider: FC<AppProviderProps> = ({children}) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isClient, setIsClient] = useState(false);
  //console.log(`[${new Date().toLocaleString()}] [INFO] AppContext.tsx : AppProvider state `, state);

  //keep state stored in local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient)
      sessionStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem('cart') ?? '[]');
    dispatch({type: 'SET_CART', payload: cart});
    setIsClient(true);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: ContextProps = useMemo(() => ({state, dispatch}), [state, dispatch]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
