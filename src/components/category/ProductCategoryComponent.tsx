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
import {usePathname, useSearchParams} from 'next/navigation';
//bloomreach sdk
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {Status} from '@/components/common/status/Status';
//types
import {SorterOption} from '@/components/common/sorter/SorterTypes';
import {ProductCategoryComponentCustomProps} from '@/components/category/ProductCategoryComponentTypes';
import {SearchComponentParams} from '@/components/search/SearchComponentTypes';
//functions
import {getFacetFieldFilters, getSearchParams, QUERY_PARAM_FACET} from '@/utils/SearchUtil';
import {getGroupByOptions} from '@/components/common/product-groups/ProductGroupsUtils';
import {getBanners, getCategoryId} from '@/components/category/ProductCategoryComponentUtils';
//templates
import {ProductCategory} from '@/components/category/ProductCategory';

export const ProductCategoryComponent = (props: BrProps<ContainerItem> & ProductCategoryComponentCustomProps) => {
  const {page, component, params} = props;
  const {t} = useTranslation(['search', 'common']);

  const {query: routerQuery, asPath} = useRouter();
  const searchParams = useSearchParams();
  const channelId = usePathname()?.split('/')?.[1];

  // Page Component
  const {
    title,
    subTitle: subTitleContent,
    category,
    alternateCategoryId,
    widget,
    isDynamic: isDynamicInput = false,
    slotBanner,
    relatedSearch: relatedSearches,
  }: any = getContainerItemContent<any>(component, page); //component?.getContent(page) ?? {};

  const subTitle = subTitleContent?.value;

  const {userSegmentState: {userSegment}} = useContext(UserContext)!;
  const {globalSearchParams, categoryNavigators} = useContext(GlobalSearchContext);

  // Category ID
  const categoryIdInput = getCategoryId(category, asPath, alternateCategoryId);

  const [categoryId, setCategoryId] = useState(categoryIdInput);

  // Slot banners
  const banners = getBanners(slotBanner);

  // parameters
  const componentParams = component.getParameters();
  const productCategoryComponentParams = {...componentParams, ...params} as SearchComponentParams;

  const {productUrl, template = 'default', showCaption} = productCategoryComponentParams;

  const {
    pageSize,
    pageNumber,
    sort,
    segment,
    viewId,
    widgetId: widgetIdInput,
    groupBy,
    groupLimit,
  } = getSearchParams(productCategoryComponentParams, routerQuery, null, userSegment, globalSearchParams);

  const [widgetId, setWidgetId] = useState(widgetIdInput);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    if (categoryId !== categoryIdInput) {
      setCategoryId(categoryIdInput);
    }
  }, [categoryIdInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (widgetId !== widgetIdInput) {
      setWidgetId(widgetIdInput);
    }
  }, [widgetIdInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page.isPreview() && !categoryId) {
      const navigatorCategoryId = categoryNavigators?.[channelId]?.categoryNavigatorContent?.categoryItem?.childCategoryItems?.[0]?.id;
      if (categoryId !== navigatorCategoryId) {
        setCategoryId(navigatorCategoryId);
        if (!mock) {
          setMock(true);
        }
      }
    }
  }, [categoryNavigators, channelId]); // eslint-disable-line react-hooks/exhaustive-deps

  // GroupBy options
  const groupByOptions: Array<SorterOption> = getGroupByOptions(page);

  // Facet filters
  const facetFieldFilters = getFacetFieldFilters(routerQuery, QUERY_PARAM_FACET, globalSearchParams);

  const isDynamic = isDynamicInput || searchParams.get('is_dynamic') === 'true';

  if (!categoryId) {
    if (!page.isPreview()) {
      return <Status container error status={t('category-not-provided')} />;
    } else {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Category', ns: 'common'})} />;
    }
  }

  return (
    <ProductCategory
      {...{
        contentTitle: title,
        contentSubTitle: subTitle,
        template,
        categoryId,
        pageNumber,
        pageSize,
        facetFieldFilters,
        segment,
        viewId,
        widgetId: widgetId || widget?.widgetid,
        sortFields: sort,
        banners,
        relatedSearches,
        groupBy,
        groupLimit,
        groupByOptions,
        productUrl,
        showCaption,
        isDynamic,
        mock,
      }}
      {...props}
    />
  );
};
