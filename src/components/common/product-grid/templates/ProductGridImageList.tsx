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

import {SorterParams} from '@/components/common/sorter/SorterTypes';
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {BrProduct} from '@/utils/CommonTypes';
import {ImageList, ImageListItem} from '@mui/material';
import React, {useContext} from 'react';
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {Reference} from '@bloomreach/spa-sdk';
import {ProductImage} from '@/components/product/templates/ProductImage';
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ProductGridImageListProps {
  sorterParams: SorterParams;
  productParams: ProductComponentParams;
  items: Array<SlotBanner | BrProduct>;
}

const config = require('../ProductGridConfig.json');

export const ProductGridImageList = (props: ProductGridImageListProps) => {
  const {
    items,
    sorterParams: {numberOfColumns, showFacetList},
    productParams,
  } = props;

  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  let rowHeight = 200 + (4 - numberOfColumns) * 80 + (showFacetList ? 0 : 96);

  const configs = items?.length <= 4 ? config.imageListConfigs.regularGrid4 : (numberOfColumns === 3 ? config.imageListConfigs['fullScreenGrid12-col3'] : config.imageListConfigs.regularGrid12);

  const renderImages = () => {
    return items.map((item: any, key) => {
        if (item.banner) {
          const slotBanner = item as SlotBanner;
          const {textColor, textAlignment, banner: documentRef} = slotBanner;
          return (
            <ImageListItem key={key}>
              <BannerComponent
                params={{
                  template: 'textoverimage',
                  textAlignment,
                  textColor,
                }}
                documentRef={documentRef as Reference}
                {...{page, component}}
                disableWrapper
              />
            </ImageListItem>
          );
        } else {
          const product = item as BrProduct;
          return (
            <ProductImage
              key={key}
              productParams={{
                ...productParams,
                ...{
                  rows: downMd ? 1 : configs?.[key]?.rows ?? 1,
                  cols: downMd ? 1 : configs?.[key]?.cols ?? 1,
                },
              }}
              productContent={product}
            />
          );
        }
      },
    );
  };

  return (
    <ImageList sx={{width: '100%', margin: '10px'}} variant={'quilted'} cols={downMd ? 1 : numberOfColumns}
               rowHeight={rowHeight}>
      {renderImages()}
    </ImageList>
  );
};