/*
 * Copyright 2023 Hippo B.V. (http://www.onehippo.com)
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

const SESSION_CART = 'cartId';
const SM_VIEW_ID_ITEM_NAME = 'smViewId';
const CART_SESSION_STORAGE_KEY = 'cartDetails';
const SESSION_ORDER = 'orderDetails';
const SESSION_COMPLETED_ORDERS = 'completedOrders';

const EMPTY_CART = {
  totalQuantity: 0,
  entries: [],
  totalPurchasePrice: {
    moneyAmounts: [
      {
        amount: 0,
        currency: 'USD',
      },
    ],
  },
  state: 'Shopping',
};

class SessionService {
  setCartIdInSession(cartId: string | undefined): void {
    if (typeof sessionStorage === 'undefined') return;
    if (cartId) {
      sessionStorage.setItem(SESSION_CART, cartId);
    } else {
      sessionStorage.removeItem(SESSION_CART);
    }
  }

  getCartIdFromSession(): string | undefined {
    if (typeof sessionStorage === 'undefined') return '';
    return sessionStorage.getItem(SESSION_CART) ?? undefined;
  }

  getPreferredSmViewId(): string {
    if (typeof sessionStorage === 'undefined') return '';
    return sessionStorage.getItem(SM_VIEW_ID_ITEM_NAME) ?? '';
  }

  setPreferredSmViewId(smViewId: string | undefined): void {
    if (typeof sessionStorage === 'undefined') return;
    if (smViewId) {
      sessionStorage.setItem(SM_VIEW_ID_ITEM_NAME, smViewId);
    } else {
      sessionStorage.removeItem(SM_VIEW_ID_ITEM_NAME);
    }
  }

  getCart(): any {
    if (typeof sessionStorage === 'undefined') {
      return EMPTY_CART;
    }

    const cart = sessionStorage.getItem(CART_SESSION_STORAGE_KEY);
    if (cart == null) {
      return EMPTY_CART;
    } else {
      return JSON.parse(cart);
    }
  }

  setCart(cart: any): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(CART_SESSION_STORAGE_KEY, JSON.stringify(cart));
  }

  removeCart(): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(CART_SESSION_STORAGE_KEY);
  }

  saveOrderToSession = (order: any | undefined) => {
    if (typeof sessionStorage === 'undefined') return;
    order ? sessionStorage.setItem(SESSION_ORDER, JSON.stringify(order)) : sessionStorage.removeItem(SESSION_ORDER);
  };

  readOrderFromSession = (): any | undefined => {
    if (typeof sessionStorage === 'undefined') {
      return undefined;
    }
    const item = sessionStorage.getItem(SESSION_ORDER);
    return item ? JSON.parse(item) : undefined;
  };

  saveCompletedOrderToSession = (order: any | undefined) => {
    if (typeof sessionStorage === 'undefined') return undefined;
    if (order) {
      const items = sessionStorage.getItem(SESSION_COMPLETED_ORDERS);
      if (items) {
        const orders = (JSON.parse(items) as any[]);
        orders.unshift(order);
        sessionStorage.setItem(SESSION_COMPLETED_ORDERS, JSON.stringify(orders));
      } else {
        sessionStorage.setItem(SESSION_COMPLETED_ORDERS, JSON.stringify([order]));
      }
    }
  };

  removeCompleteOrders(): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(SESSION_COMPLETED_ORDERS);
  }

  readCompletedOrderFromSession = (orderId: string): any | undefined => {
    if (typeof sessionStorage === 'undefined') return undefined;
    const items = sessionStorage.getItem(SESSION_COMPLETED_ORDERS);
    return items ? JSON.parse(items).find((item: any) => item.id === orderId) : undefined;
  };

  readCompletedOrdersFromSession = (): any[] | undefined => {
    if (typeof sessionStorage !== 'undefined') {
      const item = sessionStorage.getItem(SESSION_COMPLETED_ORDERS);
      return item ? JSON.parse(item) : undefined;
    } else {
      return undefined;
    }
  };
}

export const sessionService = new SessionService();
