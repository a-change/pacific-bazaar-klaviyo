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
import {FC, useEffect, useState} from 'react';
//next
//mui
import {Box, Card, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
//types
import {BannerSize, BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const boxStyle = {
  width: '100%',
  display: 'flex',
  borderRadius: '0.625rem',
  boxShadow: 'none',
  alignItems: 'center',
};

const ContentBox = styled(Box)(({theme}) => ({
  //'paddingLeft': 60,
  'width': '75%',
  '& p': {fontSize: 13, lineHeight: 1.4},
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    width: '100%',
  },
}));

const BannerProductCarouselBox = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent' && prop !== 'size',
})<{imageUrl?: string; textColor?: string; justifyContent?: string; size?: BannerSize}>(
  ({theme, imageUrl, textColor, justifyContent, size}) => ({
    ...boxStyle,
    'minHeight': size === 'large' ? '720px' : '360px', //650
    'justifyContent': `${justifyContent}`,
    'color': `${textColor}`,
    'background': theme.palette.primary[100],
    'backgroundImage': `url('${imageUrl}')`,
    'backgroundSize': 'cover',
    'backgroundPosition': '50% 50%',
    'backgroundRepeat': 'no-repeat',
    '& p': {},
    [theme.breakpoints.down('lg')]: {
      minHeight: '40vw',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      'backgroundSize': 'auto',
      '& p': {display: 'none'},
    },
  }),
);

export const BannerProductCarousel: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;

  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {text, images} = bannerContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const {textColor, textAlignment, imageAlignment, size, verticalAlignment} = bannerParams;

  const justifyContent = getJustifyContent(textAlignment);
  const alignItems = getJustifyContent(verticalAlignment);

  return (
    <BannerProductCarouselBox imageUrl={imageUrl} textColor={textColor} justifyContent={justifyContent} size={size}>
      <ContentBox>
        <BannerContentBox {...bannerContent} html={html} size={size} justifyContent={justifyContent}
                          alignItems={alignItems} textAlign={textAlignment} />
      </ContentBox>
    </BannerProductCarouselBox>
  );
};
