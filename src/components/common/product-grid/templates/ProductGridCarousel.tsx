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
import React, {Fragment, useContext} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, Container, CSSObject} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//bloomreach sdk
import {Reference} from '@bloomreach/spa-sdk';
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//other libs
//contexts
//hooks
//hocs
//components
import {Status} from '@/components/common/status/Status';
import {Sorter} from '@/components/common/sorter/Sorter';
import {ProductCard} from '@/components/product/templates/ProductCard';
import {BannerComponent} from '@/components/banner/BannerComponent';
import Carousel from '@/components/carousel/templates/Carousel';
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
//types
import {BrProduct} from '@/utils/CommonTypes';
import {SorterParams} from '@/components/common/sorter/SorterTypes';
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {CarouselComponentParams} from '@/components/carousel/CarouselComponentTypes';

export interface ProductGridCarouselProps {
  productParams: ProductComponentParams;
  sorterParams: SorterParams;
  items: Array<SlotBanner | BrProduct>;
}

export const ProductGridCarousel = (props: ProductGridCarouselProps) => {
  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const {t} = useTranslation('search');
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const {
    productParams,
    sorterParams,
    items,
  } = props;

  const {numberOfColumns} = sorterParams;

  const carouselParams: CarouselComponentParams = {
    template: 'default',
    showArrows: true,
    showDots: true,
    visibleSlides: downMd ? 1 : numberOfColumns,
    autoPlay: false,
  };

  let spacing;

  // custom css
  const carouselStyles: CSSObject = {
    '& .carousel__dot-group': {
      backgroundColor: 'rgba(255,255,255,0.75)',
      borderRadius: 4,
      bottom: 10,
      left: 0,
      marginTop: '1rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: 1,
      paddingRight: 1,
      //position: 'absolute',
      right: 0,
      width: 'fit-content',
      '& div': {
        borderColor: 'dark.main',
        '::after': {backgroundColor: 'dark.main'},
      },
    },
  };

  if (carouselParams.template === 'hero') {
    carouselStyles.left = '50%';
    carouselStyles.marginLeft = '-50vw';
    carouselStyles.overflow = 'hidden';
    carouselStyles.width = '100vw';
  }

  const itemSize = numberOfColumns >= 4 ? 'small' : 'large';

  const RenderBanner = (props: SlotBanner) => {
    const {textColor, textAlignment, banner: documentRef} = props;
    return (
      <FlexRowCenter height={'100%'}>
        <BannerComponent
          params={{
            template: 'product-carousel',
            textAlignment,
            textColor,
            size: itemSize,
          }} documentRef={documentRef as Reference} {...{page, component}} disableWrapper />
      </FlexRowCenter>
    );
  };

  return (
    <Fragment>
      <Box sx={{marginY: 2}}>
        <Sorter {...sorterParams} />
      </Box>
      {items.length === 0 ?
        <Status container error status={t('no-products-found')} />
        :
        <Container disableGutters>
          <Carousel
            spacing={spacing}
            interval={carouselParams.interval ?? 6000}
            infinite={carouselParams.loop ?? true}
            showDots={carouselParams.showDots ?? true}
            autoPlay={carouselParams.autoPlay ?? true}
            visibleSlides={carouselParams.visibleSlides ?? 1}
            showArrow={carouselParams.showArrows ?? false}
            sx={carouselStyles}
            totalSlides={items.length}
          >
            {items.map((item: any, key) => {
              return item.banner ?
                <RenderBanner {...item} key={key} />
                :
                <ProductCard
                  key={key}
                  productContent={item as BrProduct}
                  productParams={{
                    ...productParams,
                    ...{
                      size: itemSize,
                    },
                  }} />;
            })}
          </Carousel>
        </Container>}
    </Fragment>
  );
};