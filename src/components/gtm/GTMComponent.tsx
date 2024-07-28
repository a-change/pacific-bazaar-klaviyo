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
import {useContext, useEffect, useRef} from 'react';
//next
import {useRouter} from 'next/router';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//other libs
import TagManager from 'react-gtm-module';
//contexts
import {UserContext} from '@/contexts/UserContext';
//types
import {GTMProps} from './GTMComponentTypes';
import {
  BRX_CATEGORY_EVENT_NAME,
  BRX_CONTENT_EVENT_NAME,
  BRX_ORDER_EVENT_NAME,
  BRX_PRODUCT_EVENT_NAME,
  BRX_SEARCH_EVENT_NAME,
  BRX_THEMATIC_EVENT_NAME,
  BRX_USER_EVENT_NAME,
  withGtmEvent,
} from '@/hocs/gtm/GtmEventHoc';
import {
  AFFINITY_PARAM_NAME,
  CAMPAIGN_PARAM_NAME,
  isSaas,
  SEGMENT_PARAM_NAME,
  SEGMENT_SAAS_PARAM_NAME,
} from '@/utils/SearchUtil';
//functions
import * as DataLayerUtils from '@/utils/DataLayerUtils';
import {getCurrentSegment} from '@/utils/DataLayerUtils';
import {hash} from './GTMComponentUtils';

export const BRX_PAGE_EVENT_NAME = 'brx.page.refresh';

export const gtmRequiredEvents: any = {
  'Article Detail': [BRX_CONTENT_EVENT_NAME],
  'Order Detail': [BRX_ORDER_EVENT_NAME],
  'Product': [BRX_PRODUCT_EVENT_NAME],
  'Product Detail': [BRX_PRODUCT_EVENT_NAME],
  'Product Grid (Search)': [BRX_SEARCH_EVENT_NAME],
  'Search': [BRX_SEARCH_EVENT_NAME],
  'Product Grid (Category)': [BRX_CATEGORY_EVENT_NAME],
  'Category': [BRX_CATEGORY_EVENT_NAME],
  'Header Toolbar': [BRX_USER_EVENT_NAME],
  'Header': [BRX_USER_EVENT_NAME],
  'Thematic Page': [BRX_SEARCH_EVENT_NAME, BRX_THEMATIC_EVENT_NAME],
};

function GTMBase() {
  const userContext = useContext(UserContext)!;
  const {gtmEvent, setGtmEvent} = userContext.gtmEventState;
  const {userSegment, setUserSegment} = userContext.userSegmentState;

  const page: any = useContext(BrPageContext)!;
  const router = useRouter();

  const {
    discoveryRealm,
    discoveryDomainKey,
    discoveryAccountId,
    smDomainKey,
    smAccountId,
  } = page!.getChannelParameters();

  const domainKey = discoveryDomainKey || smDomainKey;
  const accountId = discoveryAccountId || smAccountId;

  const segment = getCurrentSegment();
  useEffect(() => {
    if (segment !== userSegment?.primary) {
      setUserSegment({primary: segment});
    }
  }, [segment]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const queryParameters = router.query;
    const paramName = isSaas() ? SEGMENT_SAAS_PARAM_NAME : SEGMENT_PARAM_NAME;
    const segmentParam = queryParameters[paramName] as string;
    if (segmentParam !== userSegment?.secondary) {
      setUserSegment({secondary: segmentParam});
    }
    const campaignParam = queryParameters[CAMPAIGN_PARAM_NAME] as string;
    if (campaignParam !== userSegment?.campaign) {
      setUserSegment({campaign: campaignParam});
    }
    const affinityParam = queryParameters[AFFINITY_PARAM_NAME] as string;
    if (affinityParam !== userSegment?.affinity) {
      setUserSegment({affinity: affinityParam});
    }
  }, [router.asPath, router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    const gtmProps: GTMProps = {
      gtmId: process.env.NEXT_PUBLIC_GTM_KEY || 'undefined',
    };
    if (document.body) {
      TagManager.initialize(gtmProps);
      //console.log('[GTM]', 'TagManager initialized');
    } else {
      console.error('[GTM]', 'Failed to initialize TagManager');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pageComponents = useRef<any>({});
  useEffect(() => {
    pageComponents.current = {};
    const findComponents = (parent: any) => {
      const componentId = parent?.model?.id;
      const componentLabel = parent?.model?.label;
      const componentType = parent?.model?.type;

      // Make sure component with children won't be included since they can have the names we are looking for
      if (componentId && componentLabel && componentType !== 'CONTAINER_COMPONENT' && gtmRequiredEvents[componentLabel] && !parent?.children?.length) {
        pageComponents.current[componentId] = componentLabel;
      }
      parent?.children.forEach((child: any) => {
        findComponents(child);
      });
    };
    findComponents(page?.root);
    //console.log('[GTM]', 'Constructed page component list', pageComponents);
    // Update GTM events based on the page
    const componentIds = Object.keys(pageComponents.current);
    const gtmEventKeys = Object.keys(gtmEvent);
    let keyUpdated = gtmEventKeys.find((key) => key !== 'url' && !componentIds.includes(key));
    if (!keyUpdated) {
      keyUpdated = componentIds.find((key) => !gtmEventKeys.includes(key));
    }
    if (keyUpdated) {
      setGtmEvent({
        cleanup: true,
        componentIds,
      });
      //console.log('[GTM]', 'Cleaning up GtmEvent...', componentIds, gtmEventKeys);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const notFullyCollected = Object.keys(pageComponents.current)
      .filter((componentId) => {
        const requiredGtmEvents = gtmRequiredEvents[pageComponents.current[componentId]];
        return Array.isArray(requiredGtmEvents) && requiredGtmEvents.length > 0;
      })
      .some((componentId) => {
        const requiredGtmEvents = gtmRequiredEvents[pageComponents.current[componentId]];
        const componentGtmEvents = gtmEvent[componentId];
        if (componentGtmEvents) {
          const notCollected = requiredGtmEvents.some((requiredGtmEvent: any) => {
            return !componentGtmEvents[requiredGtmEvent];
          });
          //console.log('[GTM]', componentId, pageComponents.current[componentId], notCollected ? 'Not collected' : 'collected');
          return notCollected;
        } else {
          //console.log('[GTM]', componentId, pageComponents.current[componentId], 'no event yet');
          return true;
        }
      });
    //console.log('[GTM]', 'GtmEvent =>', gtmEvent, 'NotFullyCollected =>', notFullyCollected, 'gtmRequiredEvents =>', gtmRequiredEvents, 'PageComponents =>', pageComponents);
    if (!notFullyCollected) {
      const gtmEventsToBePushed: any = {
        url: gtmEvent.url,
      };
      const componentIds = Object.keys(pageComponents.current);
      Object.keys(gtmEvent).filter((key) => key !== 'url' && componentIds.includes(key)).forEach((key) => {
        const gtmEventValues = gtmEvent[key];
        if (gtmEventValues) {
          Object.keys(gtmEventValues).forEach((gtmEventValueKey) => {
            const gtmEventValue = gtmEventValues[gtmEventValueKey];
            const gtmEventToBePushed = gtmEventsToBePushed[gtmEventValueKey];
            if (gtmEventToBePushed) {
              if (Array.isArray(gtmEventToBePushed)) {
                gtmEventsToBePushed[gtmEventValueKey].push(gtmEventValue);
              } else {
                gtmEventsToBePushed[gtmEventValueKey] = [gtmEventToBePushed, gtmEventValue];
              }
            } else {
              gtmEventsToBePushed[gtmEventValueKey] = gtmEventValue;
            }
          });
        }
      });
      //console.log('[GTM]', 'gtmEventsToBeUnFlattened ==>', gtmEventsToBePushed);
      // Unflatten the payload
      let unFlattenedPayload: any = {};

      const {page_version, campaign, segmentIds} = page.model.meta ?? {};
      Object.keys(gtmEventsToBePushed).forEach(key => {
        if (key === 'url') {
          // Remove channel segment from the url
          try {
            const url = new URL(gtmEventsToBePushed.url);
            const pathSegments = url.pathname.split('/');
            const channel = pathSegments?.[1] ?? '';
            const notProduction = discoveryRealm === 'STAGING'
              || url.hostname !== process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN
              || (process.env.NEXT_PUBLIC_PIXEL_EXCLUDED_DOMAINS ?? '').split(',').indexOf(channel) !== -1;
            const updatedUrl = `${url.origin}${pathSegments.join('/')}${url.search ? '?' + url.searchParams : ''}`;
            unFlattenedPayload = {
              ...unFlattenedPayload, ...{
                brx: {
                  page: {
                    newUrl: updatedUrl,
                    domain_key: domainKey,
                    account_id: accountId,
                    test_data: notProduction,
                  },
                  meta: {
                    segmentIds,
                    campaign,
                    page_version,
                    keyHash: hash(JSON.stringify(page.toJSON())),
                  },
                },
              },
            };
          } catch (e) {
            console.log('[ERROR]', gtmEventsToBePushed.url);
          }
        } else if (key.startsWith('brx')) {
          let itemPayload = unFlattenedPayload;
          const keySegments = key.split('.');
          const len = keySegments.length;
          for (let i = 0; i < len - 1; i++) {
            const keySegment = keySegments[i];
            itemPayload[keySegment] = itemPayload[keySegment] || {};
            itemPayload = itemPayload[keySegment];
          }
          const lastSegment = keySegments[len - 1];
          if (itemPayload[lastSegment]) {
            if (Array.isArray(itemPayload[lastSegment])) {
              itemPayload[lastSegment].push(gtmEventsToBePushed[key]);
            } else {
              itemPayload[lastSegment] = [itemPayload[lastSegment], gtmEventsToBePushed[key]];
            }
          } else {
            itemPayload[lastSegment] = gtmEventsToBePushed[key];
          }
        }
      });
      //console.log('[GTM]', 'gtmEventsToBePushed ==>', unFlattenedPayload);
      DataLayerUtils.push(BRX_PAGE_EVENT_NAME, unFlattenedPayload);
    }
  }, [JSON.stringify(gtmEvent)]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export const GTMComponent = withGtmEvent(GTMBase);
