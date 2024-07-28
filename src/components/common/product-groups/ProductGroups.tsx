/*
 * Copyright 2021 Bloomreach (http://www.bloomreach.com)
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
import React, {Fragment, useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box, Card, Grid} from '@mui/material';
//components
import {Sorter} from '@/components/common/sorter/Sorter';
import {FacetList} from '@/components/common/facet/FacetList';
import {ProductCard} from '@/components/product/templates/ProductCard';
import {H3, Paragraph} from '@/components/common/bazaar/Typography';
import {ListPagination} from '@/components/common/list-pagination/ListPagination';
import {ProductListItem} from '@/components/product/templates/ProductListItem';
//types
import {DEFAULT_STATS_FIELD} from '@/hocs/HocUtils';
import {ProductGroupsTemplateProps} from '@/components/common/product-groups/ProductGroupsTypes';
import {CategoryBreadcrumb} from '@/components/common/breadcrumb/CategoryBreadcrumb';

const config = require('../product-grid/ProductGridConfig.json');

export const ProductGroups = (props: ProductGroupsTemplateProps) => {
  const {
    productGroupsParams: {
      hideSku = true,
      showSkuSelect = true,
      showAttributeBadge = true,
      numberOfColumns = 4,
      pageSize = 12,
      showFacets = true,
      facetsLocation,
      showPagination = true,
      enablePriceRange,
      enablePrecisionMode,
      title,
      subTitle,
      template: templateInput,
      pageNumber,
      groupBy,
      groupByOptions,
      groupLimit,
      query,
      productUrl,
      showCaption,
      category,
    },
    productGroupsContent: {category_map, facet_counts: {facets, facet_fields: facetFields}, group_response, stats},
  } = props;

  const theme = useTheme();
  const {t} = useTranslation('search');
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const gridSize = 12 / numberOfColumns;

  const priceRangeFieldStats = stats?.stats_fields?.[DEFAULT_STATS_FIELD];
  const priceRange = priceRangeFieldStats ? {
    priceMin: priceRangeFieldStats?.min,
    priceMax: priceRangeFieldStats?.max,
  } : undefined;

  const [showFacetList, setShowFacetList] = useState(showFacets);

  const [template, setTemplate] = useState(templateInput);

  useEffect(() => {
    if (showFacetList !== showFacets) {
      setShowFacetList(showFacets);
    }
  }, [showFacets]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUrl = (pageNum: number) => {
    const queryParameters = new URLSearchParams(window.location.search);
    queryParameters.set('page', `${pageNum}`);
    return `${window.location.pathname}?${queryParameters}`;
  };

  if (!group_response) {
    return null;
  }

  const listPaginationContent = {
    type: 'two-button',
    total: 0,
    offset: 0,
    pageSize: 0,
    currentPage: 0,
    previous: pageNumber > 1,
    previousPageUrl: getUrl(pageNumber - 1),
    next: Object.values(group_response)?.[0]?.groups?.length === pageSize,
    nextPageUrl: getUrl(pageNumber + 1),
    pageNumbers: [],
    visiblePages: 0,
    startPage: 0,
    totalPages: 0,
    previousBatch: false,
    previousBatchLastPage: 0,
    nextBatch: false,
    nextBatchFirstPage: 0,
    endOffset: 0,
  };

  const RenderListPagination = () => (
    showPagination && <ListPagination listPaginationContent={listPaginationContent} listPaginationParams={{
      template: 'two-button',
      itemsLabel: 'products',
    }} />
  );

  const md = showFacetList ? 8 : 12;
  const xl = showFacetList ? 9 : 12;

  let facetConfig = config.facet;
  facetConfig.enablePriceRange = enablePriceRange;
  facetConfig.enablePrecisionMode = enablePrecisionMode;

  const facetsOnRight = facetsLocation === 'right';

  const numberOfItems = 100; //TODO
  const numberOfProducts = Object.values(group_response)?.[0]?.matches;

  return (
    <Box sx={{marginY: 2}}>
      {category && <CategoryBreadcrumb facets={facets} facetFields={facetFields} category={category} showSingle />}
      <Sorter {...{
        template,
        options: config.sorting,
        numberOfColumns,
        numberOfItems,
        pageSize,
        totalItems: numberOfProducts,
        title,
        subTitle,
        setTemplate,
        groupBy,
        groupByOptions,
        groupLimit,
        showFacetList,
        setShowFacetList,
        query,
        hideSorterControls: !showCaption,
      }} />
      <RenderListPagination />
      <Grid container spacing={3}>
        {showFacetList && !facetsOnRight && (
          <Grid item sm md={4} xl={3}>
            <FacetList {...{
              facets,
              facetFields,
              config: facetConfig,
              priceRange,
              enablePriceRange,
              precisionMode: null,
              enablePrecisionMode,
            }} />
          </Grid>
        )}
        <Grid item md={md} xl={xl}>
          {Object.values(group_response)?.map((productGroupResult, key) => {
            const {groups, matches} = productGroupResult;
            return (
              <Fragment key={key}>
                {groups?.filter(group => !!group).sort((groupA, groupB) => {
                  if (groupA.groupValue && groupB.groupValue) {
                    return 0;
                  } else if (groupA.groupValue && !groupB.groupValue) {
                    return -1;
                  } else if (!groupA.groupValue && groupB.groupValue) {
                    return 1;
                  }
                }).map((group, key2) => {
                  const {groupValue, doclist: {docs: products, numFound}} = group;
                  return (
                    <Box key={key2}>
                      <Card
                        elevation={1}
                        sx={{
                          mt: `${key2 === 0 ? '0rem' : '1rem'}`,
                          mb: '1rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          //border: '1px solid',
                          p: {
                            sm: '1rem 1.25rem',
                            md: '0.5rem 1.25rem',
                            xs: '1.25rem 1.25rem 0.25rem',
                          },
                        }}
                      >
                        <Box>
                          <H3>{groupValue || t('no-group')}</H3>
                          <Paragraph color='grey.600'>{numFound} results found</Paragraph>
                        </Box>
                      </Card>
                      <Grid container spacing={3}>
                        {products?.map((product, key) => {
                            const xl = 12 / numberOfColumns;
                            const md = xl * 2;
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
                                                   }} />
                                </Grid>;
                              default:
                                return <Grid item lg={gridSize} md={6} xs={12} key={product.pid}>
                                  <ProductCard productContent={product}
                                               productParams={{
                                                 template: 'card',
                                                 hideSku,
                                                 showSkuSelect,
                                                 showAttributeBadge,
                                                 productUrl,
                                               }} />
                                </Grid>;
                            }
                          },
                        )}
                      </Grid>
                    </Box>
                  );
                })}
              </Fragment>
            );
          })}
        </Grid>
        {showFacetList && facetsOnRight && (
          <Grid item sm md={4} xl={3}>
            <FacetList {...{
              facetFields,
              config: facetConfig,
              priceRange,
              enablePriceRange,
              precisionMode: null,
              enablePrecisionMode,
            }} />
          </Grid>
        )}
      </Grid>

      <RenderListPagination />
    </Box>
  );
};
