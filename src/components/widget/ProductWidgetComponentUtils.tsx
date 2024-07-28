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

//next
import {NextRouter} from 'next/router';
//types
import {WidgetPair, WidgetType} from '@/components/widget/ProductWidgetComponentTypes';
import {WidgetParamsInputProps} from '@/hocs/product/ProductGridWidgetHoc';
import {UserType} from '@/contexts/UserContext';
//functions
import {getSelectedPair, getSelectValue} from '@/utils/SelectUtils';
import {getProductIdFromUrl} from '@/components/product/ProductComponentUtils';

export const extractWidgetPairs = (content: any): Array<WidgetPair> => {
  return content?.widgetPair?.map((widgetPair: any) => {
    const {title, subTitle, widget, parameters, additionalWidgetAlgorithm, filters} = widgetPair;
    const selectWidget = widget?.[0] ?? widget;
    const widgetId = selectWidget?.widgetid;
    const {key, label} = getSelectedPair(selectWidget?.widgetalgo);
    const keyPairs = key?.split('.');
    return {
      parameters,
      widgetAlgorithm: keyPairs?.[1],
      widgetType: keyPairs?.[0] as WidgetType,
      widgetId,
      title: title || label,
      subTitle: subTitle?.value,
      additionalWidgetAlgorithm: getSelectValue(additionalWidgetAlgorithm),
      filters,
    };
  }) ?? [];
};

export const extractWidgetParameters = (widget: WidgetPair, user: Partial<UserType>, router: NextRouter, searchQuery: string): WidgetParamsInputProps => {
  const {widgetType, parameters, filters} = widget;

  const item_ids = parameters || (router.query['pid'] ?? getProductIdFromUrl(true, router.asPath) ?? '') as string;
  const user_id = parameters || (user?.id && user?.id.length > 0 ? user?.id : 'NO-USER-ID');

  let widgetParamsInputProps: WidgetParamsInputProps;
  switch (widgetType) {
    case 'category':
      // TODO: extra way to get category???
      widgetParamsInputProps = {
        cat_id: parameters,
      };
      break;
    case 'item':
      widgetParamsInputProps = {
        item_ids,
      };
      break;
    case 'keyword':
      widgetParamsInputProps = {
        query: parameters || searchQuery,
      };
      break;
    case 'personalized':
      widgetParamsInputProps = {
        user_id,
      };
      break;
    case 'visual_search':
      widgetParamsInputProps = {
        api_type: 'visual_search',
        rows: '50',
        item_ids,
      };
      break;
    case 'global':
    default:
      widgetParamsInputProps = {};
      break;
  }

  if (filters) {
    widgetParamsInputProps.filters = filters?.split(',');
  }

  return widgetParamsInputProps;
};