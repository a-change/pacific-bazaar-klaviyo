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
import React, {useState} from 'react';
//bloomreach sdk
import {Page} from '@bloomreach/spa-sdk';
//hocs
import {Cart, CurrentCustomer} from '@/hocs/HocTypes';
//functions
import {sessionService} from '@/utils/SessionService';
import {identifyExponeaUser} from '@/components/exponea/ExponeaUtils';
import {extractNamesFromEmail, mockApiCall} from '@/utils/MockUtils';
//Config JSON
import {CartMock, UserMock} from '../../../mocks/data/UserCartOrderMocks';

export interface LoginProps {
  login: (prefilledUsername: any) => Promise<CurrentCustomer | undefined>;
  loading: boolean;
  customer?: CurrentCustomer;
  cart?: Cart;
}

interface PageProps {
  page: Page;
}

interface DialogProps {
  toggleDialog: () => void;
}

function withLoginBase<P>(Component: React.ComponentType<P & LoginProps>) {
  // eslint-disable-next-line react/display-name
  return (props: P & PageProps & DialogProps) => {
    const [loading, setLoading] = useState(false);

    const channelProps = props.page!.getChannelParameters();
    const [customer, setCustomer] = useState<CurrentCustomer>();
    const [cart, setCart] = useState<Cart>();

    const cyrb53 = (str: string, seed = 0) => {
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
      h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
      h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };

    const login = async (username) => {
      setLoading(true);
      try {
        const customerResult = {
          ...UserMock,
          ...extractNamesFromEmail(username!),
        } as CurrentCustomer;

        const cartResult = CartMock() as Cart;

        await mockApiCall(500);

        // generate unique userid based on email
        customerResult.id = cyrb53(customerResult.email).toString();
        customerResult.contentSegments = '';
        customerResult.discoverySegments = '';
        customerResult.merchandisingSegments = '';

        setCustomer(customerResult);
        setCart(cartResult);

        sessionService.setCartIdInSession(cartResult.id);

        return customerResult;
      } catch (error: any) {
        return undefined;
      } finally {
        /*
        console.log('[SEGMENTATION]', 'createSubscription');
        const sub: any = segmentsSubscription((props) => {
          console.log('[SEGMENTATION]', props);
          // sub.unsubscribe();
          // console.log('[SEGMENTATION]', 'unsubscribed');
          setLoading(false);
          setRefreshing(true);
        });
        const timeout = setTimeout(() => {
          console.log('[SEGMENTATION]', 'No segmentation changes detected after x seconds');
          clearTimeout(timeout);
          setLoading(false);
        }, 6000);
        */
        identifyExponeaUser(username, () => {
          setLoading(false);
        });
      }
    };

    return (
      <Component
        login={login}
        loading={loading}
        customer={customer}
        cart={cart}
        {...props}
      />
    );
  };
}

export function withLogin<P>(Component: React.ComponentType<P & LoginProps>) {
  return withLoginBase(Component);
}
