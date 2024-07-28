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
import React, {useState} from 'react';
//next
import {useRouter} from 'next/router';
//mui
import {Grid, ImageList, ImageListItem, ImageListItemBar, List, styled, useTheme} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import BazaarCard from '@/components/common/bazaar/BazaarCard';
//types
import {MenuContentItem} from '@/components/menu/MenuComponentTypes';
import {BrFacetField, BrProduct, BrSearchResults} from '@/utils/CommonTypes';
//functions
import {getCategoryUrl} from '@/components/category/ProductCategoryComponentUtils';
//templates
import {SiteMenuListItem, SiteMenuNavLink} from '@/components/menu/templates/MenuSiteMenu';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {ImageListBannerSizes} from '@/components/banner/templates';
import {formattedPrice} from '@/utils/CurrencyUtils';
import {SiteMenuMenusContainer} from '@/components/menu/templates/MenuSiteMenuPopover';

export interface MenuSiteCategoryMenuDefaultProps {
  categoryId: string;
  itemsPageResult: BrSearchResults<BrProduct>;
  menuItem: MenuContentItem;
  location?: number;
}

export const MenuImageListItem = styled(ImageListItem)({
  '& img': {transition: '0.3s'},
  ':hover': {'& img': {border: '1px solid'}},
});

export const MenuSiteCategoryMenuDefault = (props: BrProps & MenuSiteCategoryMenuDefaultProps) => {
  const {
    page,
    component,
    itemsPageResult,
    categoryId,
    menuItem,
    location,
  } = props;
  const theme = useTheme();
  const router = useRouter();

  const [showProductDetails, setShowProductDetails] = useState('');

  const {
    facet_counts,
    response,
  } = itemsPageResult;

  let rawCategories: BrFacetField[] = [];
  if (facet_counts?.facet_fields) {
    rawCategories = facet_counts?.facet_fields?.category ?? [];
  } else {
    const value = facet_counts?.facets.find(facet => facet.name === 'category')?.value;
    if (value && Array.isArray(value)) {
      rawCategories = value as BrFacetField[];
    }
  }

  if (!menuItem.childNavItems) {
    menuItem.childNavItems = [];
  }

  menuItem.childNavItems.push(...rawCategories
    .filter(rawCategory => rawCategory.parent === categoryId)
    .filter(rawCategory =>
      menuItem.childNavItems.length === 0 ||
      menuItem.childNavItems.findIndex(childNavItem => childNavItem.name === rawCategory.cat_name) === -1,
    )
    .sort((a, b) => a.cat_name.localeCompare(b.cat_name))
    .map(rawCategory => {
      return {
        name: rawCategory.cat_name,
        url: getCategoryUrl(page, rawCategory.cat_id, false, null),
        display: 'text',
        selected: false,
      };
    }));

  const hasChildren = menuItem.childNavItems && menuItem.childNavItems.length > 0;
  const products = response?.docs;

  const configs = {
    3: [{
      rows: 1,
      cols: 1,
    }, {
      rows: 1,
      cols: 1,
    }, {
      rows: 1,
      cols: 2,
    }],
    4: [{
      rows: 2,
      cols: 2,
    }, {
      rows: 1,
      cols: 2,
    }, {
      rows: 1,
      cols: 1,
    }, {
      rows: 1,
      cols: 1,
    }],
    12: [{
      'rows': 2,
      'cols': 2,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 2,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }, {
      'rows': 1,
      'cols': 1,
    }],
  };

  const randomProducts = products/*.sort(() => Math.random() - 0.5)*/.slice(0, 12);
  const selectedConfigs = configs?.[randomProducts.length] ?? configs?.['12'];
  return (
    hasChildren &&
    <SiteMenuMenusContainer className='menu-list' hasBanner={true} location={location} isLeft={location > 0}>
      <BazaarCard elevation={3} sx={{mt: 1.5, overflow: 'hidden'}}>
        <Grid container>
          <Grid
            item
            md={3}
            sx={{
              py: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <List>
              {menuItem.childNavItems.map((sub, key) => {
                return (
                  <SiteMenuNavLink href={sub.url ?? ''} key={`${key}-${sub.name}`}>
                    <SiteMenuListItem>{sub.name}</SiteMenuListItem>
                  </SiteMenuNavLink>
                );
              })}
            </List>
          </Grid>
          <Grid item md>
            <ImageList sx={{width: '100%', padding: '10px'}} variant={'quilted'} cols={4}
                       rowHeight={ImageListBannerSizes.small.height}>
              {menuItem.banner?.documentRef && <ImageListItem rows={2} cols={4}>
                <BannerComponent
                  {...{page, component}}
                  documentRef={menuItem.banner?.documentRef ?? ''}
                  params={{
                    template: 'image-list',
                    textAlignment: 'center',
                    textColor: 'secondary',
                    rows: 2,
                  }}
                />
              </ImageListItem>}
              {randomProducts.map((item, key) => (
                <MenuImageListItem key={item.pid} rows={selectedConfigs?.[key]?.rows ?? 1}
                                   cols={selectedConfigs?.[key]?.cols ?? 1}>
                  <img
                    srcSet={`${item.thumb_image}`}
                    src={`${item.thumb_image}`}
                    alt={item.title}
                    onClick={() => router.push(page.getUrl(`/products/${item.pid}___${item.pid}`))}
                    onMouseEnter={() => setShowProductDetails(item.pid)}
                    loading='lazy'
                  />
                  {showProductDetails === item.pid &&
                    <ImageListItemBar title={item.title} subtitle={formattedPrice(item.sale_price)} />}
                </MenuImageListItem>
              ))}
            </ImageList>
          </Grid>
        </Grid>
      </BazaarCard>
    </SiteMenuMenusContainer>
  );
};

