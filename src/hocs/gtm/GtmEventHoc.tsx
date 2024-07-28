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

//react
import React, {useContext} from 'react';
//bloomreach sdk
import {BrComponentContext} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
import {CartItem} from '@/contexts/AppContext';

export const BRX_PRODUCT_EVENT_NAME = 'brx.page.product';
export const BRX_USER_EVENT_NAME = 'brx.user';
export const BRX_CONTENT_EVENT_NAME = 'brx.page.content';
export const BRX_AUTOSUGGEST_EVENT_NAME = 'brx.event.suggest';
export const BRX_CATEGORY_EVENT_NAME = 'brx.page.category';
export const BRX_SEARCH_EVENT_NAME = 'brx.page.search';
export const BRX_ORDER_EVENT_NAME = 'brx.basket';
export const BRX_THEMATIC_EVENT_NAME = 'brx.page.thematic';

export const BRX_USER_ANONYMOUS_ID = '1112223334445';

export interface GtmEventSearch {
  search_term?: string;
  catalogs?: string;
}

export interface GtmEventCategory {
  catId?: string,
  catName?: string
}

export interface GtmEventProduct {
  prodId?: string,
  prodName?: string,
  code?: string
}

export interface GtmEventThematic {
  theme?: string;
}

export interface GtmEventProps {
  setGtmEventProduct: Function,
  setGtmEventUser: Function,
  setGtmEventContent: Function,
  setGtmEventCategory: Function,
  setGtmEventSearch: Function,
  setGtmEventOrder: Function,
  setGtmEventThematic: Function
}

function withGtmEventBase<P>(Component: React.ComponentType<P & GtmEventProps>) {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const component = useContext(BrComponentContext)!;
    const {userState: {user}, gtmEventState: {setGtmEvent}}: any = useContext(UserContext);

    const setGtmEventProduct = (product: any) => {
      if (product) {
        //console.log('[GTM]', 'Product', product);
        const productEvent: GtmEventProduct = product as GtmEventProduct;
        const componentId = component.getId();
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_PRODUCT_EVENT_NAME] = productEvent;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventUser = (componentId: string, globalSearchParams: any) => {
      if (componentId) {
        const searchParams = JSON.parse(sessionStorage.getItem('searchContext') || '{}');
        let customer_profile = searchParams.segment || '';
        if (customer_profile.startsWith('customer_profile:')) {
          customer_profile = customer_profile.substring('customer_profile:'.length);
        }
        const userEvent: any = {
          view_id: globalSearchParams.view_id,
          customer_profile,
        };
        if (user?.id) {
          userEvent.user_id = user?.id;
        } else {
          userEvent.user_id = BRX_USER_ANONYMOUS_ID;
        }
        //console.log('[GTM]', 'USER', userEvent);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_USER_EVENT_NAME] = userEvent;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventContent = (content: any) => {
      if (content) {
        const {id: item_id, name: item_name} = content.getData();
        const componentId = component.getId();
        const contentEvent: any = {
          item_id,
          item_name,
          catalogs: [{name: process.env.NEXT_PUBLIC_CONTENT_SEARCH_CATALOG_NAME}],
        };
        console.log('[GTM', contentEvent);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_CONTENT_EVENT_NAME] = contentEvent;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventCategory = (category: any) => {
      if (category) {
        const componentId = component.getId();
        //DataLayerUtils.push( BRX_CATEGORY_EVENT_NAME, category );
        //console.log('[GTM]', 'Add Category', category);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_CATEGORY_EVENT_NAME] = category;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventSearch = (queryKeyword: any, discoveryDomainKey: any) => {
      if (queryKeyword) {
        const componentId = component.getId();
        const searchEvent: GtmEventSearch = {
          'search_term': queryKeyword,
          'catalogs': discoveryDomainKey,
        };
        //DataLayerUtils.push(BRX_SEARCH_EVENT_NAME, searchEvent);
        //console.log('[GTM]', 'Search', searchEvent);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_SEARCH_EVENT_NAME] = searchEvent;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventOrder = (order: any) => {
      if (order) {
        const orderEvent: any = {};
        orderEvent.items = order?.items?.map((orderItem: CartItem) => {
          const {qty, pid, skuid, title, price} = orderItem!;

          return {
            prodId: pid,
            code: skuid ?? '',
            prodName: title,
            price: price,
            quantity: qty,
          };
        });
        orderEvent.order_id = order.id;
        orderEvent.basket_value = order.totalAmount;

        const componentId = component.getId();
        //console.log('[GTM]', 'OrderEvent:', orderEvent);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_ORDER_EVENT_NAME] = orderEvent;
        setGtmEvent(updatedGtmEvent);
      }
    };

    const setGtmEventThematic = (queryKeyword: any, discoveryDomainKey: any, theme: string) => {
      if (theme) {
        const componentId = component.getId();
        const thematicEvent: GtmEventThematic = {
          theme,
        };
        //console.log('[GTM]', 'Thematic', thematicEvent);
        const updatedGtmEvent: any = {};
        updatedGtmEvent[componentId] = {};
        updatedGtmEvent[componentId][BRX_THEMATIC_EVENT_NAME] = thematicEvent;

        if (queryKeyword) {
          const searchEvent: GtmEventSearch = {
            'search_term': queryKeyword,
            'catalogs': discoveryDomainKey,
          };
          //DataLayerUtils.push(BRX_SEARCH_EVENT_NAME, searchEvent);
          //console.log('[GTM]', 'Search', searchEvent);
          updatedGtmEvent[componentId][BRX_SEARCH_EVENT_NAME] = searchEvent;
        }

        setGtmEvent(updatedGtmEvent);
      }
    };

    return (
      <Component
        setGtmEventProduct={setGtmEventProduct}
        setGtmEventUser={setGtmEventUser}
        setGtmEventContent={setGtmEventContent}
        setGtmEventCategory={setGtmEventCategory}
        setGtmEventSearch={setGtmEventSearch}
        setGtmEventOrder={setGtmEventOrder}
        setGtmEventThematic={setGtmEventThematic}
        {...props}
      />
    );
  };
}

export function withGtmEvent<P>(Component: React.ComponentType<P & GtmEventProps>) {
  return withGtmEventBase(Component);
}
