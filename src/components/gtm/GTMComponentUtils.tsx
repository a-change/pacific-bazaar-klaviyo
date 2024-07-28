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

import {trackCartUpdate} from '@/components/exponea/ExponeaUtils';
import {WidgetProps} from '@/components/gtm/GTMComponentTypes';
import {CartItem} from '@/contexts/AppContext';
import * as DataLayerUtils from '@/utils/DataLayerUtils';

export const BRX_AUTOSUGGEST_EVENT_NAME = 'brx.event.suggest';

export type GTM_CART_EVENT_TYPE = 'remove' | 'add' | 'update';

export const pushGtmEventSuggestion = (term: string, query: string) => {
  const props = {
    brx: {
      event: {
        suggest: {
          selected_term: term,
          query_term: query,
        },
      },
    },
  };
  DataLayerUtils.brxEvent(BRX_AUTOSUGGEST_EVENT_NAME, props);
};

export const BRX_WIDGET_EVENT_NAME = 'brx.widget.view';

export const pushGtmEventWidget = (widgetProps?: WidgetProps) => {
  if (widgetProps) {
    const {rid, id, type} = widgetProps || {};

    const props = {
      brx: {
        widget: {
          view: {
            wrid: rid,
            wq: '',
            wid: id,
            wty: type,
          },
        },
      },
    };

    DataLayerUtils.brxEvent(BRX_WIDGET_EVENT_NAME, props);
  }
};

export const BRX_WIDGET_CLICK_EVENT_NAME = 'brx.widget.click';

export const pushGtmEventWidgetClick = (widgetProps: any, variantItemId: string) => {
  if (widgetProps) {
    const {rid, id, type} = widgetProps;
    const props = {
      brx: {
        widget: {
          click: {
            wrid: rid,
            wq: '',
            wid: id,
            wty: type,
            item_id: variantItemId,
          },
        },
      },
    };
    DataLayerUtils.brxEvent(BRX_WIDGET_CLICK_EVENT_NAME, props);
  }
};

export const BRX_SEARCH_EVENT_NAME = 'brx.event.search';

export const pushGtmEventSearch = (searchTerm: any, domainKey: any) => {
  if (searchTerm) {
    const props = {
      brx: {
        event: {
          search: {
            search_term: searchTerm,
            catalogs: domainKey,
          },
        },
      },
    };

    DataLayerUtils.brxEvent(BRX_SEARCH_EVENT_NAME, props);
  }
};

export const BRX_UPDATE_CART_EVENT_NAME = 'brx.event.updatecart';

export const pushGtmEventUpdateCart = (id: string, code: string, quantity: number) => {
  const props = {
    brx: {
      event: {
        updatecart: {
          prodId: id,
          code: code,
          quantity,
        },
      },
    },
  };
  DataLayerUtils.brxEvent(BRX_UPDATE_CART_EVENT_NAME, props);
};

export const BRX_REMOVE_FROM_CART_EVENT_NAME = 'brx.event.removefromcart';

export const pushGtmEventRemoveFromCart = (id: string, code: string, quantity: number) => {
  const props = {
    brx: {
      event: {
        removefromcart: {
          prodId: id,
          code: code,
          quantity: quantity,
        },
      },
    },
  };
  DataLayerUtils.brxEvent(BRX_REMOVE_FROM_CART_EVENT_NAME, props);
};

export const BRX_ADD_TO_CART_WIDGET_EVENT_NAME = 'brx.widget.addtocart';
export const BRX_ADD_TO_CART_EVENT_NAME = 'brx.event.addtocart';

export const pushGtmEventAddToCart = (
  widgetProps: any,
  id: string,
  code: string,
  quantity: number,
) => {
  if (widgetProps) {
    const {rid, id, type} = widgetProps;
    DataLayerUtils.brxEvent(BRX_ADD_TO_CART_WIDGET_EVENT_NAME, {
      brx: {
        widget: {
          addtocart: {
            wrid: rid,
            wq: '',
            wid: id,
            wty: type,
            item_id: id,
            sku: code,
          },
        },
      },
    });
  } else {
    DataLayerUtils.brxEvent(BRX_ADD_TO_CART_EVENT_NAME, {
      brx: {
        event: {
          addtocart: {
            prodId: id,
            code: code,
            quantity,
          },
        },
      },
    });
  }
};

export const pushCartEvents = (
  state: {cart: CartItem[]},
  widgetProps: WidgetProps | null,
  id: string,
  code: string,
  price: number,
  title: string,
  quantity: number,
  increment: boolean,
  type: GTM_CART_EVENT_TYPE,
) => {
  const cart = state.cart ?? [];
  const items = cart.map((item) => {
    return {
      product_id: item.skuid,
      quantity: item.qty,
    };
  });
  switch (type) {
    case 'add':
      items.push({
        product_id: code,
        quantity,
      });

      trackCartUpdate({
        action: 'add',
        product_id: id,
        product_list: items,
        price,
        total_quantity: 1,
        total_price: price,
        title,
      });
      pushGtmEventAddToCart(widgetProps, id, code, quantity);
      break;
    case 'remove':
      const arr = items.filter((x) => x.product_id !== code);
      trackCartUpdate({
        action: 'remove',
        product_id: id,
        product_list: arr,
        price,
        total_quantity: arr.reduce((acc, item) => acc + item.quantity, 0),
        total_price: price,
        title,
      });
      pushGtmEventRemoveFromCart(id, code, quantity);
      break;
    case 'update':
      pushGtmEventUpdateCart(id, code, quantity);
      break;
  }
};

export const hash = (payload: string) => {
  let hash = 0,
    i,
    chr;
  if (payload.length === 0) return hash;
  for (i = 0; i < payload.length; i++) {
    chr = payload.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
