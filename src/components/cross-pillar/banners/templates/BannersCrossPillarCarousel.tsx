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
import {FC} from 'react';
//mui
import {CSSObject} from '@mui/material';
//bloomreach sdk
//components
//types
import {BannerContent} from '@/components/banner/BannerComponentTypes';
//templates
import Carousel from '@/components/carousel/templates/Carousel';
import {BannerJumbotron} from '@/components/banner/templates';

interface BannersCarouselProps {
  carouselContent: {
    banners: Array<BannerContent>
  };
}

export const BannersCrossPillarCarousel: FC<BannersCarouselProps> = (props) => {
  const {carouselContent: {banners}} = props;
  // custom css
  const carouselStyles: CSSObject = {
    overflow: 'hidden',
    width: 'calc(100vw - 10px)',
    marginLeft: '-50vw',
    left: '50%',
    borderRadius: '0',
    '& .carousel__dot-group': {
      mt: 0,
      left: 0,
      right: 0,
      bottom: 10,
      position: 'absolute',
      '& div': {
        borderColor: 'dark.main',
        '::after': {backgroundColor: 'dark.main'},
      },
    },
  };

  return <Carousel
    spacing='0px'
    interval={6000}
    infinite={true}
    showDots={true}
    autoPlay={true}
    visibleSlides={1}
    showArrow={false}
    sx={carouselStyles}
    totalSlides={banners.length}
  >
    {banners.map((banner, key) => {
      return <BannerJumbotron bannerContent={banner} bannerParams={{
        template: 'default',
        textColor: 'white',
        textAlignment: 'center',
      }} key={`slider-${key}`} />;
    })}
  </Carousel>;
};
