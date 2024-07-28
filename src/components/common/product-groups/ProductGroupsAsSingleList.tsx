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
import React, {useEffect, useState} from 'react';
//next
//mui
import {Box, Grid, Stack, styled} from '@mui/material';
//components
import {Sorter} from '@/components/common/sorter/Sorter';
import {FacetList} from '@/components/common/facet/FacetList';
import {ProductCard} from '@/components/product/templates/ProductCard';
import {ListPagination} from '@/components/common/list-pagination/ListPagination';
import {ProductListItem} from '@/components/product/templates/ProductListItem';
//types
import {DEFAULT_STATS_FIELD} from '@/hocs/HocUtils';
import {ProductGroupsTemplateProps} from '@/components/common/product-groups/ProductGroupsTypes';
import {CategoryBreadcrumb} from '@/components/common/breadcrumb/CategoryBreadcrumb';
import {H4} from '../../../../bazaar-pro/components/Typography';
import {CommonTitle} from '@/components/common/title/CommonTitle';
import FlexBox from '@/components/common/flex-box/FlexBox';

const config = require('../product-grid/ProductGridConfig.json');

// custom styled components
const Wrapper = styled(FlexBox, {
  shouldForwardProp: (prop) =>
    prop !== 'selected',
})<{selected: boolean}>(
  ({theme, selected}) => {
    const borderStyles = selected ? {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
    } : {};
    return {
      ...borderStyles,
      cursor: 'pointer',
      overflow: 'hidden',
      borderRadius: '4px',
      marginBottom: '1rem',
      justifyContent: 'center',
      '& img': {
        transition: 'all 0.3s',
        cursor: 'grab',
      },
      ':hover': {
        img: {transform: 'scale(1.1)'},
        '& .category-title': {
          fontWeight: selected ? '800' : '600',
          color: theme.palette.common.white,
          backgroundColor: theme.palette.dark.main,
        },
      },
      '& .category-title h4': {
        fontWeight: selected ? 'bolder' : 'normal',
      },
    };
  });

const CategoryTitle = styled(Box)({
  left: 10,
  right: 10,
  bottom: 10,
  padding: 8,
  textAlign: 'center',
  borderRadius: '2px',
  position: 'absolute',
  transition: 'all 0.3s',
  backgroundColor: 'rgba(255,255,255, .67)',
});

export const ProductGroupsAsSingleList = (props: ProductGroupsTemplateProps) => {
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

  const gridSize = 12 / numberOfColumns;

  const priceRangeFieldStats = stats?.stats_fields?.[DEFAULT_STATS_FIELD];
  const priceRange = priceRangeFieldStats ? {
    priceMin: priceRangeFieldStats?.min,
    priceMax: priceRangeFieldStats?.max,
  } : undefined;

  const [selectedGroup, setSelectedGroup] = useState(0);

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

  const displayGroups = [];
  Object.values(group_response)?.forEach((productGroupResult) => {
    const {groups, matches} = productGroupResult;
    groups?.filter(group => !!group).sort((groupA, groupB) => {
      if (groupA.groupValue && groupB.groupValue) {
        return 0;
      } else if (groupA.groupValue && !groupB.groupValue) {
        return -1;
      } else if (!groupA.groupValue && groupB.groupValue) {
        return 1;
      }
    }).forEach((group) => {
      displayGroups.push(group);
    });
  });

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

  const {groupValue, doclist: {docs: products, numFound}} = displayGroups?.[selectedGroup] ?? {};

  const groupGridSize = 12 / numberOfColumns;

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
        {displayGroups?.map((group, key) => {
          const {groupValue, doclist: {docs: products, numFound}} = group;
          return (
            <Grid item xs={12} sm={4} md={groupGridSize} key={key}>
              <Wrapper position='relative' selected={key === selectedGroup} onClick={() => setSelectedGroup(key)}>
                <img
                  src={products?.[0]?.thumb_image}
                  width={'auto'}
                  height={300}
                  alt='category'
                />

                <CategoryTitle className='category-title'>
                  <H4>{groupValue || 'Others'}</H4>
                </CategoryTitle>
              </Wrapper>
            </Grid>
          );
        })}
      </Grid>
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
          <Stack direction={'column'}>
            <CommonTitle title={groupValue || 'Others'} subTitle={`${numFound} results found`} />
          </Stack>
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
