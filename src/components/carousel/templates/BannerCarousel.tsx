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
import {FC, useContext} from 'react';
//mui
import {CSSObject} from '@mui/material';
//bloomreach sdk
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//components
import {BannerComponent} from '@/components/banner/BannerComponent';
//types
import {CarouselTemplateProps} from '@/components/carousel/CarouselComponentTypes';
//templates
import Carousel from '@/components/carousel/templates/Carousel';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';

function BannerCarouselBase(props: CarouselTemplateProps) {
  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);

  const {
    carouselContent: {banners},
    carouselParams: {
      template,
      interval,
      showDots,
      autoPlay,
      loop,
      visibleSlides,
      showArrows,
    },
  } = props;

  // custom css
  let baseStyles: CSSObject;

  switch (template) {
    case 'hero':
      baseStyles = {
        left: '50%',
        marginLeft: '-50vw',
        width: 'calc(100vw - 10px)',
      };
      break;
    default:
      baseStyles = {
        left: '0',
        marginLeft: '0',
        width: '100%',
      };
      break;
  }

  const carouselStyles: CSSObject = {
    ...baseStyles,
    overflow: 'hidden',
    '& .carousel__dot-group': {
      backgroundColor: 'rgba(255,255,255,0.75)',
      borderRadius: 4,
      bottom: 10,
      left: 0,
      marginTop: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: 1,
      paddingRight: 1,
      position: 'absolute',
      right: 0,
      width: 'fit-content',
      '& div': {
        borderColor: 'dark.main',
        '::after': {backgroundColor: 'dark.main'},
      },
    },
  };

  return <Carousel
    //spacing={spacing}
    interval={interval ?? 6000}
    infinite={loop ?? true}
    showDots={showDots ?? true}
    autoPlay={autoPlay ?? true}
    visibleSlides={visibleSlides ?? 1}
    showArrow={showArrows ?? false}
    sx={carouselStyles}
    totalSlides={banners.length}
  >
    {banners.reverse().map((banner, key) => {
      return <BannerComponent {...{page, component}} {...banner} disableWrapper key={`slider-${key}`} />;
    })}
  </Carousel>;
}

export const BannerCarousel = withWrapper(BannerCarouselBase);
