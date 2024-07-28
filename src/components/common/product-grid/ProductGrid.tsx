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
import {useTranslation} from 'next-i18next';
//mui
import {useTheme} from '@mui/material/styles';
import {Box, Grid, Stack} from '@mui/material';
//bloomreach-sdk
import {Reference} from '@bloomreach/spa-sdk';
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//components
import {ProductCard} from '@/components/product/templates/ProductCard';
import {Sorter} from '@/components/common/sorter/Sorter';
import {ProductListItem} from '@/components/product/templates/ProductListItem';
import {ListPagination} from '@/components/common/list-pagination/ListPagination';
import {FacetList} from '@/components/common/facet/FacetList';
import {SlotBanner} from '@/components/pacific-product-grid-by-category/ProductGridByCategory';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {RelatedSearch} from '@/components/common/related-search/RelatedSearch';
import {IntelligenceSwitchboard} from '@/components/common/intelligence-switchboard/IntelligenceSwitchboard';
import {Status} from '@/components/common/status/Status';
import {CategoryBreadcrumb} from '@/components/common/breadcrumb/CategoryBreadcrumb';
//types
import {ProductGridTemplateProps} from './ProductGridTypes';
import {BrProduct, BrStatFacetField} from '@/utils/CommonTypes';
import {DEFAULT_STATS_FIELD} from '@/hocs/HocUtils';
//functions
import {getListPaginationContent} from '@/components/common/list-pagination/ListPaginationUtils';
//templates
import {ProductGridMarquee} from '@/components/common/product-grid/templates/ProductGridMarquee';
import {SorterParams} from '@/components/common/sorter/SorterTypes';
import {ProductGridCarousel} from '@/components/common/product-grid/templates/ProductGridCarousel';
import {ProductGridImageList} from '@/components/common/product-grid/templates/ProductGridImageList';
import {
  ProductGridImageListFullScreen,
} from '@/components/common/product-grid/templates/ProductGridImageListFullScreen';
import {
  ProductGridFrequentlyBoughtTogether,
} from '@/components/common/product-grid/templates/ProductGridFrequentlyBoughtTogether';
import useMediaQuery from '@mui/material/useMediaQuery';
import {getProductUrl} from '@/components/product/ProductComponentUtils';

const config = require('./ProductGridConfig.json');
export const ProductGrid = (props: ProductGridTemplateProps) => {
  const {
    productGridParams: {
      hideSku = true,
      showSkuSelect = true,
      showAttributeBadge = true,
      numberOfColumns: numberOfColumnsInput = 4,
      pageSize: pageSizeInput = 12,
      showFacets = true,
      facetsLocation,
      showPagination = true,
      enablePriceRange,
      enablePrecisionMode,
      title,
      subTitle,
      template: templateInput,
      query,
      titleNode,
      hideSorterControls,
      groupBy,
      groupByOptions,
      groupLimit,
      hideDiscoveryApiViewer,
    },
    productGridContent: {
      facet_counts: {facets, facet_fields: facetFields},
      response,
      stats,
      autoCorrectQuery,
      did_you_mean: didYouMean,
    },
    widgetParams,
    precisionMode,
    productUrl,
    banners,
    relatedSearches,
    widgetProps,
    category,
  } = props;

  const theme = useTheme();
  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const {t} = useTranslation('search');
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const [pageSize, setPageSize] = useState(pageSizeInput);
  const [numberOfColumns, setNumberOfColumns] = useState(numberOfColumnsInput);

  const gridSize = 12 / numberOfColumns;

  let priceRangeFieldStats = stats?.stats_fields?.[DEFAULT_STATS_FIELD];
  if (!priceRangeFieldStats) {
    const statFacet = facets?.find(facet => facet.name === DEFAULT_STATS_FIELD && facet.type === 'number_stats');
    if (statFacet) {
      const brStatFacetField = statFacet.value as BrStatFacetField;
      priceRangeFieldStats = {
        min: brStatFacetField.start,
        max: brStatFacetField.end,
      };
    }
  }
  const priceRange = priceRangeFieldStats ? {
    priceMin: priceRangeFieldStats?.min,
    priceMax: priceRangeFieldStats?.max,
  } : undefined;

  const [showFacetList, setShowFacetList] = useState(showFacets && !downMd);

  const [template, setTemplate] = useState(templateInput);

  useEffect(() => {
    if (templateInput !== template) {
      setTemplate(templateInput);
    }
  }, [templateInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showFacetList !== showFacets) {
      setShowFacetList(showFacets);
    }
  }, [showFacets]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (downMd && showFacetList) {
      setShowFacetList(false);
    }
  }, [showFacets, downMd]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (numberOfColumnsInput !== numberOfColumns) {
      setNumberOfColumns(numberOfColumnsInput);
    }
  }, [numberOfColumnsInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pageSizeInput !== pageSize) {
      setPageSize(pageSizeInput);
    }
  }, [pageSizeInput]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!response?.docs) {
    //return null;
  }

  const {docs: products, numFound: numberOfProducts, start} = response ?? {};

  const listPaginationContent = getListPaginationContent({
    offset: start,
    limit: pageSize,
    total: numberOfProducts,
    params: {
      queryType: 'default',
      showPagination: true,
    },
  });

  const RenderListPagination = () => (
    showPagination && <ListPagination listPaginationContent={listPaginationContent} listPaginationParams={{
      template: 'list',
      itemsLabel: 'products',
    }} />
  );

//  const md = showFacetList ? 8 : 12;
//  const lg = showFacetList ? 9 : 12;

//  const md = showFacetList ? 8 : 12;
  const md = showFacetList ? 9 : 12;

  let facetConfig = config.facet;
  facetConfig.enablePriceRange = enablePriceRange;
  facetConfig.enablePrecisionMode = enablePrecisionMode;

  const facetsOnRight = facetsLocation === 'right';

  const numberOfItems = (products?.length) || 0;

  const renderProduct = (product: BrProduct) => {
    switch (template) {
      case 'list':
        return <Grid item xs={12} key={product.pid}>
          <ProductListItem productContent={product}
                           productParams={{
                             template: 'card',
                             hideSku,
                             showSkuSelect,
                             showAttributeBadge,
                             productUrl,
                             widgetProps,
                             hoverEffect: false,
                           }} />
        </Grid>;
      case 'default':
      default:
        return <Grid item md={gridSize} xs={12} sm={6} key={product.pid}>
          <ProductCard productContent={product}
                       productParams={{
                         template: 'card',
                         hideSku,
                         showSkuSelect,
                         showAttributeBadge,
                         productUrl,
                         widgetProps,
                         size: showFacetList ? 'small' : 'medium',
                         hoverEffect: false,
                       }} />
        </Grid>;
    }
  };

  const renderBanner = (banner: SlotBanner) => {
    const {textColor, textAlignment, banner: documentRef, verticalAlignment, productId} = banner;
    const bannerTemplate = template === 'list' ? 'default' : 'slot';
    const lg = template === 'list' ? 12 : gridSize;
    const md = template === 'list' ? 12 : 6;

    return (
      <Grid item lg={lg} md={md} xs={12} key={documentRef}>
        <BannerComponent
          params={{
            template: bannerTemplate,
            textAlignment,
            textColor,
            verticalAlignment,
            size: showFacetList ? 'small' : 'medium',
            productLink: productId ? {
              url: getProductUrl(page, productId, productId),
              label: t('feature-product'),
            } : undefined,
          }}
          documentRef={documentRef as Reference}
          {...{page, component}}
          disableWrapper />
      </Grid>
    );
  };

  let offset = 0;

  const sorterParams: SorterParams = {
    template,
    options: config.sorting,
    numberOfColumns,
    pageSize,
    totalItems: numberOfProducts,
    title,
    subTitle,
    setTemplate,
    autoCorrectQuery,
    didYouMean,
    query,
    widgetParams,
    showFacetList,
    setShowFacetList,
    hideFacetList: !showFacets,
    titleNode,
    hideSorterControls,
    groupBy,
    groupByOptions,
    groupLimit,
    hideDiscoveryApiViewer,
  };

  const items: Array<SlotBanner | BrProduct> = [];

  products?.forEach((product, key) => {
    const proxyProductBanner = banners?.find(
      (bannerItem) => bannerItem?.productId === product?.pid,
    ); // eslint-disable-line no-loop-func

    if (proxyProductBanner) {
      return items.push(proxyProductBanner);
    } else {
      let slotBanners: Array<SlotBanner> = [];
      if (key < pageSize) {
        let banner = null;
        do {
          banner = banners?.find(
            (bannerItem) => (bannerItem?.slot === start + key + 1 + offset),
          ); // eslint-disable-line no-loop-func
          if (banner) {
            offset += 1;
            slotBanners.push(banner);
          }
        } while (banner);
      }
      items.push(...slotBanners);
      items.push(product);
      banners && items.push(...banners?.filter((bannerItem) => bannerItem?.slot === start + (products?.length ?? 0) + 1 + offset));
    }
  });

  switch (template) {
    case 'marquee':
      return (
        <Box sx={{marginY: 2}}>
          {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
          <ProductGridMarquee {...{
            productParams: {
              template: 'card',
              hideSku,
              showSkuSelect,
              showAttributeBadge,
              productUrl,
              widgetProps,
              hoverEffect: false,
            },
            sorterParams,
            items,
          }}
          />
        </Box>
      );
    case 'carousel':
      return (
        <Box sx={{marginY: 2}}>
          {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
          <ProductGridCarousel {...{
            items,
            productParams: {
              template: 'card',
              hideSku,
              showSkuSelect,
              showAttributeBadge,
              productUrl,
              widgetProps,
              hoverEffect: false,
            },
            sorterParams,
          }} />
        </Box>
      );
    case 'image-list-fullscreen':
      return (
        <Box sx={{marginY: 2}}>
          {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
          <ProductGridImageListFullScreen
            sorterParams={sorterParams}
            items={items}
            productParams={{
              template: 'default',
              hideSku,
              showSkuSelect,
              showAttributeBadge,
              productUrl,
              widgetProps,
              hoverEffect: false,
            }}
          />
        </Box>
      );
    case 'frequently-bought-together':
      return (
        <Box sx={{marginY: 2}}>
          {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
          <ProductGridFrequentlyBoughtTogether
            sorterParams={sorterParams}
            items={items}
            productParams={{
              template: 'default',
              hideSku,
              showSkuSelect,
              showAttributeBadge,
              productUrl,
              widgetProps,
              hoverEffect: false,
            }}
          />
        </Box>
      );
    default:
      const RenderFacet = () => {
        return <Grid item sm md={3}>
          <Stack direction={'column'} spacing={2}>
            {query && <IntelligenceSwitchboard />}
            <FacetList {...{
              facets,
              facetFields,
              config: facetConfig,
              priceRange,
              enablePriceRange,
              precisionMode,
              enablePrecisionMode,
            }} />
            {relatedSearches && <RelatedSearch relatedSearches={relatedSearches} />}
          </Stack>
        </Grid>;
      };
      return (
        <Box sx={{marginY: 2}}>
          {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
          <Sorter {...sorterParams} />
          <RenderListPagination />
          <Grid container spacing={1}>
            {showFacetList && !facetsOnRight && <RenderFacet />}
            <Grid item sm md={md}>
              <Grid container spacing={1}>
                {items?.length === 0 && <Status container error status={t('no-products-found')} />}
                {template !== 'image-list' && items?.map((item: any, key) => {
                  if (item.banner) {
                    return renderBanner(item as SlotBanner);
                  } else {
                    return renderProduct(item as BrProduct);
                  }
                })}
                {template === 'image-list' && <ProductGridImageList
                  sorterParams={sorterParams}
                  items={items}
                  productParams={{
                    template: 'default',
                    hideSku,
                    showSkuSelect,
                    showAttributeBadge,
                    productUrl,
                    widgetProps,
                    hoverEffect: false,
                  }}
                />}
              </Grid>
            </Grid>
            {showFacetList && facetsOnRight && <RenderFacet />}
          </Grid>
          <RenderListPagination />
        </Box>
      );
  }
};
