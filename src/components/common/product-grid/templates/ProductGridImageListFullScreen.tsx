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

import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {BrProduct} from '@/utils/CommonTypes';
import {Container, ImageList, ImageListItem, LinearProgress} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {Reference} from '@bloomreach/spa-sdk';
import {ProductImage} from '@/components/product/templates/ProductImage';
import {FlexFullScreen} from '@/components/common/flex-box';
import {ProductGridImageListProps} from '@/components/common/product-grid/templates/ProductGridImageList';
import {CommonTitle} from '@/components/common/title/CommonTitle';

const config = require('../ProductGridConfig.json');

export const ProductGridImageListFullScreen = (props: ProductGridImageListProps) => {
  const {
    items,
    sorterParams: {title, subTitle, numberOfColumns, showFacetList},
    productParams,
  } = props;

  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);

  const [progress, setProgress] = useState(0);

  const maxSize = items.length;
  const stepSize = Math.floor(maxSize / 6);

  const configId = Math.floor(Math.random() * 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= maxSize - stepSize) {
          return 0;
        }
        return oldProgress + stepSize;
      });
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [maxSize, stepSize]);

  let rowHeight = 150 + (4 - numberOfColumns) * 100 + (showFacetList ? 0 : 120);
  const configs = config.imageListConfigs?.[`fullScreenGrid12-${configId}`];

  const renderImages = () => {
    const startIndex = progress;
    const endIndex = progress + stepSize;
    return items.slice(startIndex, endIndex).sort(() => Math.random() - 0.5).map((item: any, key) => {
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
                  rows: configs?.[key]?.rows ?? 1,
                  cols: configs?.[key]?.cols ?? 1,
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
    <Container disableGutters>
      {title && <CommonTitle title={title} subTitle={subTitle} />}
      <LinearProgress variant='determinate' value={progress} sx={{
        marginY: '10px',
      }} />
      <FlexFullScreen>
        <ImageList sx={{width: '100%'}} variant={'quilted'} cols={8}
                   rowHeight={rowHeight}>
          {renderImages()}
        </ImageList>
      </FlexFullScreen>
    </Container>
  );
};