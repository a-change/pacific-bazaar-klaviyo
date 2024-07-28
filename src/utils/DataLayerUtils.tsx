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

import TagManager from 'react-gtm-module';
import {BRX_PAGE_EVENT_NAME} from '@/components/gtm/GTMComponent';

export const push = (key: string, val: any) => {
  //Re-enabled GTM for RTCS project (sandbox_product01)
  const dataLayerEntry: any = {...{event: key}, ...val};
  TagManager.dataLayer({dataLayer: dataLayerEntry});

};

export const brxEvent = (eventName: string, props: any) => {
  //Re-enabled GTM for RTCS project (sandbox_product01)
  let dataLayerEntry: any = {};
  dataLayerEntry['event'] = eventName;
  dataLayerEntry = {...dataLayerEntry, ...props};

  //console.log('[GTM]', 'Event', eventName);
  if (eventName !== BRX_PAGE_EVENT_NAME) {
    // BrTrk need to be available before pushing event
    const waitForGlobal = setTimeout(function() {
      if ((window as any).BrTrk) {
        //console.log('[GTM]', 'GotBrTrk', eventName);
        TagManager.dataLayer({dataLayer: dataLayerEntry});
        //console.log('[GTM]', 'Done TagManager.dataLayer', eventName, dataLayerEntry);
        clearTimeout(waitForGlobal);
      } else {
        console.log('[GTM]', 'BrTrk not available...wait...');
      }
    }, 1000);
  } else {
    TagManager.dataLayer({dataLayer: dataLayerEntry});
    //console.log('[GTM]', 'Done TagManager.dataLayer', eventName, dataLayerEntry);
  }
};

export const getCurrentSegment = () => {
  // read dataLayer.br.user.customer_profile
  let currentSegment = '';

  if (typeof window === 'undefined') {
    return currentSegment;
  }

  try {
    // Following code assumes segment value is picked from dataLayer
    // let dlBrx = (window as any)['google_tag_manager']['GTM-NV9N7FP'].dataLayer.get ('brx');
    // let dlBrx = (window as any).dataLayer;
    // if (dlBrx)
    //  currentSegment = dlBrx.user.customer_profile;

    // Following code assumes segment value is picked from br_data
    // as per current assumptions for Exponea demo
    let brData = (window as any)?.['br_data'];
    if (brData) {
      if (brData.customer_profile)
        currentSegment = brData.customer_profile;
    }

    const exponeaCustomer = (window as any)?.['exp_customer'];
    if (exponeaCustomer?.favorite_style) {
      currentSegment = exponeaCustomer?.favorite_style;
    }
    //console.log('[GTM] Current segment', currentSegment);
  } catch (err) {
    console.log('[GTM]', 'Error retrieving current segment', err);
  }
  return currentSegment;
};

