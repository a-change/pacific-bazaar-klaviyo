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
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const boxStyle = {
  width: '100%',
  display: 'flex',
  boxShadow: 'none',
  alignItems: 'center',
  borderRadius: '0',
};

const ContentBox = styled(Box)(({theme}) => ({
  width: '100%',
  padding: '0.5rem',
  textAlign: 'center',
}));

const BannerSidebarBox = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent',
})<{imageUrl?: string; textColor?: string; justifyContent?: string}>(
  ({theme, imageUrl, textColor, justifyContent}) => ({
    ...boxStyle,
    justifyContent: `'${justifyContent}'`,
    color: `'${textColor}'`,
    background: theme.palette.primary[100],
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    margin: '5px',
  }),
);

export const BannerSidebar: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;

  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('');

  const {text, images} = bannerContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const {textColor, textAlignment, imageAlignment} = bannerParams;

  const justifyContent = getJustifyContent(textAlignment);

  return (
    <BannerSidebarBox imageUrl={imageUrl} textColor={textColor} justifyContent={justifyContent}>
      <ContentBox>
        <BannerContentBox {...bannerContent} html={html} textAlign={textAlignment} />
      </ContentBox>
    </BannerSidebarBox>
  );
};
