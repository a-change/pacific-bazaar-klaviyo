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
import {ImageList, ImageListItem} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {BannerComponent} from '@/components/banner/BannerComponent';
//types
import {BannerCollectionTemplateProps} from '@/components/banner-collection/BannerCollectionComponentTypes';
import {ImageListBannerSizes} from '@/components/banner/templates';

const config = require('../BannerCollectionConfig.json');

export const BannerCollectionImageList: FC<BrProps & BannerCollectionTemplateProps> = (props: BrProps & BannerCollectionTemplateProps) => {
  const {page, component, bannerCollectionContent: {banners}} = props;
  const configs = config.imageListConfigs.regularGrid6;
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ImageList variant={'quilted'} cols={downMd ? 1 : 4} rowHeight={ImageListBannerSizes.medium.height} gap={4} sx={{
      marginTop: '16px',
    }}>
      {banners.map((banner, key) => {
        const rows = downMd ? 1 : configs?.[key]?.rows ?? 1;
        const cols = downMd ? 1 : configs?.[key]?.cols ?? 1;
        banner.params.size = 'medium';
        return (
          <ImageListItem key={key} rows={rows} cols={cols}>
            <BannerComponent
              {...{page, component}}
              {...banner}
              disableWrapper
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};
