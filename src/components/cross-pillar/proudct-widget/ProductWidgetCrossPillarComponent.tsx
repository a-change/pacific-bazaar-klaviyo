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
import React, {useContext, useEffect, useState} from 'react';
//next
import {useRouter} from 'next/router';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
//contexts
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
import {UserContext} from '@/contexts/UserContext';
//components
import {ProductWidget} from '@/components/widget/ProductWidget';
//types
import {ProductWidgetComponentParams, WidgetPair} from '@/components/widget/ProductWidgetComponentTypes';
//functions
import {getSearchParams} from '@/utils/SearchUtil';
import {extractWidgetParameters} from '@/components/widget/ProductWidgetComponentUtils';
import {Status} from '@/components/common/status/Status';
import {ProductCategory} from '@/components/category/ProductCategory';
import {productUrl} from '@/components/cross-pillar';

export const ProductWidgetCrossPillarComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;
  const useSearchContext = () => useContext(GlobalSearchContext);
  const {globalSearchParams} = useSearchContext()!;
  const {
    userSegmentState: {userSegment},
    userState: {user},
  } = useContext(UserContext)!;

  const router = useRouter();

  const routerQuery = router.query;
  // models
  const content = getContainerItemContent<any>(component, page);

  const {title, widget: {widgetpickerid}, search, limit, offset, sortFields} = content;

  const widgetPairs: Array<WidgetPair> = [{
    title,
    subTitle: '',
    widgetId: widgetpickerid,
    widgetType: 'item',
  }];
  const [widget, setWidget] = useState(widgetPairs?.[0]);

  useEffect(() => {
    if (widgetPairs?.[0]?.widgetId !== widget?.widgetId) {
      setWidget(widgetPairs?.[0]);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(widgetPairs)]);

  if (widgetPairs.length === 0) {
    return <Status error customMessage={'Widget not configured!'} />;
  }

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams} as ProductWidgetComponentParams;

  const {
    template,
    showAttributeBadge,
    badgeAttribute,
    numberOfColumns,
    showCaption,
  } = mergedParams;

  let {
    pageSize,
    pageNumber,
    sort,
    segment,
    viewId,
    query: searchQuery,
    groupBy,
    groupLimit,
  } = getSearchParams(componentParams, routerQuery, null, userSegment, globalSearchParams);

  // Extract additional widget parameters
  const widgetParameters = extractWidgetParameters(widget, user, router, searchQuery);

  const {widgetId, widgetType} = widget;

  if (search?.[0]?.category) {
    const categoryId = search?.[0]?.category?.categoryid;

    return <ProductCategory
      {...{
        caption: title,
        categoryId,
        widgetId,
        family: widgetType,
        limit: pageSize || numberOfColumns || 4,
        segment,
        viewId,
        template: 'default',
        showAttributeBadge,
        badgeAttribute,
        showCaption: true,
        widgets: widgetPairs,
        widget,
        setWidget,
        sortFields: sort,
        pageNumber,
        pageSize,
        groupBy,
        groupLimit,
        groupByOptions: [],
        productUrl,
      }}
      {...widgetParameters}
      {...props}
    />;
  }

  return (
    <ProductWidget
      {...{
        caption: title,
        widgetId,
        family: widgetType,
        limit: pageSize || numberOfColumns || 4,
        segment,
        viewId,
        template,
        showAttributeBadge,
        badgeAttribute,
        showCaption,
        widgets: widgetPairs,
        widget,
        setWidget,
        showContent: false,
        productUrl,
      }}
      {...widgetParameters}
      {...props}
    />
  );
};
