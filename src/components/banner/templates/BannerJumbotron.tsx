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
import {BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';
import {Property} from 'csstype';
import TextAlign = Property.TextAlign;

//Custom styled components
const boxStyle = {
  width: '100%',
  display: 'flex',
  borderRadius: 0, //'0.625rem',
  boxShadow: 'none',
  alignItems: 'center',
};

const ContentBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'verticalAlign' && prop !== 'textAlignment',
})<{verticalAlign?: string, textAlignment?: string}>(
  ({theme, verticalAlign, textAlignment}) => ({
    'paddingLeft': textAlignment !== 'right' ? '16px' : '0',
    'paddingRight': textAlignment !== 'left' ? '16px' : '0',
    marginTop: verticalAlign === 'top' ? '16px' : '0',
    marginBottom: verticalAlign === 'bottom' ? '16px' : '0',
    '& p': {fontSize: 13, lineHeight: 1.4},
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      width: '100%',
    },
  }));

const BannerJumbotronBox = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent' && prop !== 'alignItems' && prop !== 'textAlign',
})<{
  imageUrl?: string;
  textColor?: string;
  justifyContent?: string;
  alignItems?: string;
  textAlign?: string
}>(
  ({theme, imageUrl, textColor, justifyContent, alignItems, textAlign}) => ({
    ...boxStyle,
    'minHeight': '360px', //650
    justifyContent,
    alignItems,
    textAlign: `${textAlign as TextAlign}`,
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
      alignItems: 'center',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      'backgroundSize': 'auto',
      '& p': {display: 'none'},
    },
  }),
);

export const BannerJumbotron: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
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

  const {textColor, textAlignment, size, verticalAlignment} = bannerParams;

  const justifyContent = getJustifyContent(textAlignment);
  const alignItems = getJustifyContent(verticalAlignment);

  return (
    <BannerJumbotronBox
      imageUrl={imageUrl}
      textColor={textColor}
      justifyContent={justifyContent}
      alignItems={alignItems}
      textAlign={textAlignment}>
      <ContentBox verticalAlign={verticalAlignment} textAlignment={textAlignment}>
        <BannerContentBox {...bannerContent} html={html} size={size} justifyContent={justifyContent}
                          alignItems={alignItems} textAlign={textAlignment} />
      </ContentBox>
    </BannerJumbotronBox>
  );
};
