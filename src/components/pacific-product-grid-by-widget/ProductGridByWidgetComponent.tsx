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
import React, {useContext, useState} from 'react';
//next
import {useRouter} from 'next/router';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGridByWidget} from '@/components/pacific-product-grid-by-widget/ProductGridByWidget';
//types
import {
  ProductGridByWidgetComponentCustomProps,
  ProductGridByWidgetComponentParams,
} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentTypes';
//functions
import {
  constructWidgetParameters,
  extractWidgetPairs,
} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentUtils';
import {getSearchParams} from '@/utils/SearchUtil';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
import {getSegmentWithPrefix, UserContext} from '@/contexts/UserContext';

export const ProductGridByWidgetComponent = (props: BrProps & ProductGridByWidgetComponentCustomProps) => {
  const {page, component, params} = props;

  const useSearchContext = () => useContext(GlobalSearchContext);
  const {globalSearchParams} = useSearchContext()!;
  const {
    userSegmentState: {userSegment},
    userState: {user},
  } = useContext(UserContext)!;

  const router = useRouter();

  const routerQuery = router.query;

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ProductGridByWidgetComponentParams;

  const {
    template,
    showAttributeBadge,
    badgeAttribute,
    widgetType,
    widgetParameter,
    pageSize,
    numberOfColumns,
  } = mergedParams;

  const widgets = extractWidgetPairs(mergedParams); //useMemo(() => extractWidgetPairs(mergedParams), [mergedParams]);
  const [widget, setWidget] = useState(widgets[0]);

  if (!widgets || widgets.length === 0) {
    return (
      <Status
        error
        status={`This Product Grid (Widget - ${widgetType}) has not been configured with any widgetId:title combinations`}
      />
    );
  }

  let {
    segment,
    viewId,
    query: searchQuery,
  } = getSearchParams(componentParams, routerQuery);

  const {widgetParameters, error} = constructWidgetParameters(
    widgetType,
    widgetParameter,
    router,
    searchQuery,
    user,
    page,
  );

  if (!widget) {
    return null;
  }

  const {widgetId} = widget;

  if (error) {
    return <Status error status={error} />;
  }

  if (!viewId) {
    viewId = globalSearchParams.view_id;
  }

  if (!segment) {
    segment = getSegmentWithPrefix(userSegment?.secondary || userSegment?.primary) || '';
  }


  return (
    <ProductGridByWidget
      {...{
        widgetId,
        family: widgetType,
        limit: pageSize || numberOfColumns || 4,
        segment,
        viewId,
        template,
        showAttributeBadge,
        badgeAttribute,
        widgets,
        widget,
        setWidget,
      }}
      {...widgetParameters}
      {...props}
    />
  );
};
