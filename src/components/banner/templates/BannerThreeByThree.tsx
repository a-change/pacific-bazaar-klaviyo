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
//mui
import {Box, Card, styled} from '@mui/material';
//next
import Link from 'next/link';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {BannerH1Link} from './BannerCommonStyles';
//functions
import {getImageSize} from '@/utils/ImageUtils';

//Custom styled components
const boxStyle = {
  width: '100%',
  height: '170px',
  display: 'flex',
  borderRadius: '0.625rem',
  boxShadow: 'none',
  alignItems: 'center',
};

const ContextBox = styled(Box)(({theme}) => ({
  'width': '100%',
  '& p': {fontSize: 13, lineHeight: 1.4},
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ThreeByThreeeBox = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent',
})<{imageUrl?: string; textColor?: string; justifyContent?: string}>(
  ({theme, imageUrl, textColor, justifyContent}) => ({
    ...boxStyle,
    'justifyContent': `${justifyContent}`,
    'textAlign': 'center',
    'color': `${textColor}`,
    'background': theme.palette.primary[100],
    'backgroundImage': `url('${imageUrl}')`,
    'backgroundSize': 'cover',
    'backgroundPosition': '50% 50%',
    'backgroundRepeat': 'no-repeat',
    '& p': {},
    [theme.breakpoints.down('lg')]: {
      height: '20vw',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      textAlign: 'center',
      height: '30vw',
    },
    [theme.breakpoints.down('sm')]: {
      'backgroundSize': 'auto',
      '& p': {display: 'none'},
    },
  }),
);

export const BannerThreeByThree: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, titleLink, text, links, images} = bannerContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, imageAlignment, size} = bannerParams;

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  return (
    <ThreeByThreeeBox imageUrl={imageUrl} textColor={textColor} justifyContent={'center'}>
      <ContextBox>
        <BannerH1Link>
          {titleLink ? <Link href={titleLink?.url ?? ''}>{title}</Link> : title}
        </BannerH1Link>
      </ContextBox>
    </ThreeByThreeeBox>
  );
};
