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
import {Grid, Stack, styled} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {BannerComponent} from '@/components/banner/BannerComponent';
//types
import {BannerCollectionTemplateProps} from '@/components/banner-collection/BannerCollectionComponentTypes';

export const BannerCollectionUsp: FC<BrProps & BannerCollectionTemplateProps> = (props: BrProps & BannerCollectionTemplateProps) => {
  const {page, component, bannerCollectionContent: {banners}} = props;
  return (
    <Grid container spacing={2}>
      {banners.map((banner, key) => {
        return (
          <Grid item xs={'auto'} md={4} key={key}>
            <BannerComponent
              {...{page, component}}
              {...banner}
              disableWrapper
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
