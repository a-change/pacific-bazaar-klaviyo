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
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
import {UserContext} from '@/contexts/UserContext';
//components
import {Status} from '@/components/common/status/Status';
import {ProductWidget} from '@/components/widget/ProductWidget';
//types
import {
  ProductWidgetComponentCustomProps,
  ProductWidgetComponentParams,
  WidgetType,
} from '@/components/widget/ProductWidgetComponentTypes';
//functions
import {getSearchParams} from '@/utils/SearchUtil';
import {extractWidgetPairs, extractWidgetParameters} from '@/components/widget/ProductWidgetComponentUtils';
import {getBanners} from '@/components/category/ProductCategoryComponentUtils';

export const ProductWidgetComponent = (props: BrProps<ContainerItem> & ProductWidgetComponentCustomProps) => {
  const {page, component, params} = props;
  const {t} = useTranslation('common');

  const {globalSearchParams} = useContext(GlobalSearchContext);
  const {
    userSegmentState: {userSegment},
    userState: {user},
    recentSearchesState: {recentSearches},
  } = useContext(UserContext)!;

  const router = useRouter();
  const routerQuery = router.query;

  // models
  const content = getContainerItemContent<any>(component, page);

  const widgetPairs = extractWidgetPairs(content);
  const [widget, setWidget] = useState(widgetPairs?.[0]);

  useEffect(() => {
    //if (widgetPairs?.[0]?.widgetId !== widget?.widgetId ) {
    if (JSON.stringify(widgetPairs?.[0]) !== JSON.stringify(widget)) {
      setWidget(widgetPairs?.[0]);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(widgetPairs)]);

  if (widgetPairs.length === 0) {
    if (page.isPreview()) {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Widget'})} />;
    } else {
      return <Status error status={'Widget not configured!'} />;
    }
  }

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ProductWidgetComponentParams;

  const {
    template,
    showAttributeBadge,
    badgeAttribute,
    pageSize,
    numberOfColumns,
    showCaption,
    hideComponentForEmptyResultSet,
  } = mergedParams;

  let {
    pageNumber,
    segment,
    viewId,
    query: searchQuery,
  } = getSearchParams(componentParams, routerQuery, null, userSegment, globalSearchParams);

  if (!widget?.widgetId /*|| !widget?.widgetAlgorithm*/) {
    if (page.isPreview()) {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Widget'})} />;
    } else {
      return <Status error status={'Widget not configured!'} />;
    }
  }

  // Extract additional widget parameters
  const lastSearchTerm = recentSearches && recentSearches.length >= 1 ? recentSearches?.[recentSearches?.length - 1] : '';
  // Pass the last search term as query if the query is not available
  const {widgetId, widgetType, parameters, additionalWidgetAlgorithm} = widget;

  if (!widgetType && additionalWidgetAlgorithm) {
    widget.widgetType = additionalWidgetAlgorithm as WidgetType;
  }

  const widgetParameters = extractWidgetParameters(widget, user, router, searchQuery || lastSearchTerm);

  // Slot banners
  const banners = getBanners(content?.slotBanner);
  const {title, subTitle: subTitleContent} = content;
  const subTitle = subTitleContent?.value;

  const limit = pageSize || numberOfColumns || 4;
  const start = ((pageNumber || 1) - 1) * limit;

  return (
    <ProductWidget
      {...{
        contentTitle: title,
        contentSubTitle: subTitle,
        widgetId,
        family: widget.widgetType,
        limit,
        start,
        segment,
        viewId,
        template,
        showAttributeBadge,
        badgeAttribute,
        showCaption,
        widgets: widgetPairs,
        widget,
        setWidget,
        banners,
        hideComponentForEmptyResultSet,
      }}
      {...widgetParameters}
      {...props}
    />
  );
};
