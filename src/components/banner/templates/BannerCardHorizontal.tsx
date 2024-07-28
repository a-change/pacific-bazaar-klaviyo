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

import {FC, useEffect, useState} from 'react';
import {Box, styled} from '@mui/material';
import {H4, Span} from '@/components/common/bazaar/Typography';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
import {BannerTemplateProps} from '../BannerComponentTypes';
import {FlexBox} from '@/components/common/flex-box';
import {ImageSizeEnum} from '@/utils/CommonEnums';

//Custom styled components
const StyledFlexBox = styled(FlexBox)(({theme}) => ({
  flexWrap: 'wrap',
  padding: '1.5rem',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[400]}`,
  [theme.breakpoints.between('sm', 'md')]: {
    textAlign: 'center',
    padding: '1rem 0.5rem',
    flexDirection: 'column',
  },
}));

export const BannerCardHorizontal: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, text, links, images} = bannerContent;
  const [html, setHtml] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, imageAlignment} = bannerParams;

  useEffect(() => {
    setHtml(text.replace(/\<\/?p\>/ig, ''));
    setImageUrl(images[ImageSizeEnum.Thumbnail]?.url);
  }, [text, images]);

  return (
    <StyledFlexBox alignItems='center' gap={2}>
      {imageAlignment === 'left' && <BazaarImage alt={title} height='50px' width='auto' src={imageUrl} />}

      <Box>
        <H4 color={textColor ?? 'grey.900'} fontSize='1rem' fontWeight='700'>
          {title}
        </H4>
        <Span color={textColor ?? 'grey.600'} dangerouslySetInnerHTML={{__html: html}} />
      </Box>

      {imageAlignment === 'right' && <BazaarImage alt={title} height='50px' width='auto' src={imageUrl} />}

    </StyledFlexBox>

  );
};