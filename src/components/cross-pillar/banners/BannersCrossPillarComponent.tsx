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
import React from 'react';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
import {BannerContent, BannerTemplate} from '@/components/banner/BannerComponentTypes';
import {
  BannersCrossPillarCarousel,
} from '@/components/cross-pillar/banners/templates/BannersCrossPillarCarousel';
import {getBannerContent} from '@/components/cross-pillar/banners/BannersCrossPillarComponentUtils';
import {Banner} from '@/components/banner/Banner';
import {Grid, useTheme} from '@mui/material';
import {BannerJumbotron} from '@/components/banner/templates';
import {getTextColor} from '@/utils/ThemeUtils';
//types
//functions

export const BannersCrossPillarComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;
  const theme = useTheme();

  // models
  const content = getContainerItemContent<any>(component, page);

  if (!page.isPreview() && !content) {
    return null;
  }

  const {banners} = content;

  // parameters
  const {
    banner,
    carousel,
    fullWidth,
    imgbackgroundcolor,
    imgfit = '',
    imggravity = 'auto',
    imgheight = '',
    imgwidth = '',
    layout = 'default',
    lg = 'auto',
    mb = '',
    md = 'auto',
    mt = '',
    sm = 'auto',
    xl = 'auto',
    xs = 'auto',
  } = component.getParameters();

  console.log('[BANNERS', content, component.getParameters());

  const bannerContents: Array<BannerContent> = banners.map(banner => getBannerContent(banner, page));

  let textAlignment = 'left';
  let bannerTemplate: BannerTemplate;
  let size;

  switch (layout) {
    case 'text below':
      bannerTemplate = 'textbelowimage';
      break;
    case 'badge':
      bannerTemplate = 'threebythree';
      textAlignment = 'center';
      break;
    case 'large':
      size = 'large';
      bannerTemplate = 'default';
      break;
    case 'default':
    default:
      bannerTemplate = 'default';
      break;
  }

  if (fullWidth) {
    bannerTemplate = 'full-width';
  }

  if (carousel) {
    // Carousel
    return <BannersCrossPillarCarousel carouselContent={{
      banners: bannerContents,
    }} />;
  } else {
    if (banners.length > 1) {
      // Banner collections
      const gridSize = banners.length <= 4 ? 12 / banners.length : 3;
      return <Grid container spacing={2}>
        {bannerContents.map((banner, key) => {
          return (
            <Grid item xs={12} md={gridSize} key={key}>
              <Banner
                {...{
                  bannerContent: banner,
                  bannerParams: {
                    template: bannerTemplate,
                    textColor: getTextColor(theme, banners[key]?.texttheme?.selectionValues?.[0]?.key ?? 'black'),
                    textAlignment,
                    size,
                  },
                }}
                {...props}
              />
            </Grid>
          );
        })}
      </Grid>;
    } else {
      // Single Banner
      return <Banner
        {...{
          bannerContent: bannerContents?.[0],
          bannerParams: {
            template: bannerTemplate,
            textColor: getTextColor(theme, banners[0]?.texttheme?.selectionValues?.[0]?.key ?? 'black'),
            textAlignment,
            size,
          },
        }}
        {...props}
      />;
    }
  }

  return (
    <div>Banners</div>
  );

};