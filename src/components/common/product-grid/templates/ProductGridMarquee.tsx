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

import {Status} from '@/components/common/status/Status';
import React, {Fragment, useContext} from 'react';
import {Box, styled} from '@mui/material';
import {Sorter} from '@/components/common/sorter/Sorter';
import {FlexFullScreen} from '@/components/common/flex-box';
import Marquee from 'react-fast-marquee';
import {ProductCard} from '@/components/product/templates/ProductCard';
import {BrProduct} from '@/utils/CommonTypes';
import {SorterParams} from '@/components/common/sorter/SorterTypes';
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {useTranslation} from 'next-i18next';
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {Reference} from '@bloomreach/spa-sdk';
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';

export interface ProductGridMarqueeProps {
  productParams: ProductComponentParams;
  sorterParams: SorterParams;
  items: Array<SlotBanner | BrProduct>;
}

const MarqueeBox = styled(Box)(({theme}) => ({
  width: '200px',
  height: '100%',
}));

export const ProductGridMarquee = (props: ProductGridMarqueeProps) => {
  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const {t} = useTranslation('search');

  const {
    productParams,
    sorterParams,
    items,
  } = props;

  if (items.length === 0) return (
    <Status container error status={t('no-products-found')} />
  );

  const RenderBanner = (props: SlotBanner) => {
    const {textColor, textAlignment, banner: documentRef} = props;
    return (
      <MarqueeBox>
        <BannerComponent
          params={{
            template: 'slot',
            textAlignment,
            textColor,
          }} documentRef={documentRef as Reference}
          {...{page, component}}
          disableWrapper />
      </MarqueeBox>
    );
  };

  return (
    <Fragment>
      <Box sx={{marginY: 2}}>
        <Sorter {...sorterParams} />
      </Box>
      <FlexFullScreen>
        <Marquee pauseOnHover={true}>
          {items.map((item: any, key) => {
            return item.banner ?
              <RenderBanner {...item} key={key} />
              :
              <Box sx={{
                maxWidth: '240px',
                height: '400px',
                marginX: '40px',
              }} key={key}>
                <ProductCard
                  productContent={item as BrProduct}
                  productParams={{
                    ...productParams,
                    ...{
                      size: 'small',
                    },
                  }} />
              </Box>;

          })}
        </Marquee>
      </FlexFullScreen>
    </Fragment>
  );

};