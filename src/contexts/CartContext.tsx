/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {createContext, useEffect, useReducer} from 'react';
import {sessionService} from '@/utils/SessionService';
import {CartMock} from '../../mocks/data/UserCartOrderMocks';

export const CART_SESSION_STORAGE_KEY = 'cartDetails';

const CartContext = createContext({});

function CartProvider(props: any) {
  const [cartDetails, setCartDetails] = useReducer((cart: any, newCart: any) => {
    if (newCart === null) {
      sessionStorage.removeItem(CART_SESSION_STORAGE_KEY);
      return CartMock();
    }
    return {...cart, ...newCart};
  }, sessionService.getCart());

  useEffect(() => {
    setCartDetails(JSON.parse(sessionStorage.getItem(CART_SESSION_STORAGE_KEY) as string));
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CART_SESSION_STORAGE_KEY, JSON.stringify(cartDetails));
  }, [cartDetails]);

  return (
    <CartContext.Provider value={{cartDetails, setCartDetails}}>
      {props.children}
    </CartContext.Provider>
  );
}

export {CartContext, CartProvider};
