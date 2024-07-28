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
import {Box, styled} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const Card = styled(Box)(({theme}) => ({
  'borderRadius': '3px',
  'transition': 'all 0.3s',
  'backgroundColor': theme.palette.common.white,
  ':hover': {
    '& img': {transform: 'scale(1.1)'},
  },
}));

const MenuCardMedia = styled(CardMedia)({
  'width': '100%',
  'maxHeight': 600,
  'cursor': 'pointer',
  'overflow': 'hidden',
  'position': 'relative',
  '& img': {transition: '0.3s'},
});

export const BannerMenu: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {text, images} = bannerContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, verticalAlignment} = bannerParams;

  useEffect(() => {
    setImageUrl((images[getImageSize(width, images)] ?? images[ImageSizeEnum.Original])?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const justifyContent = getJustifyContent(textAlignment);
  const alignItems = getJustifyContent(verticalAlignment);

  return (
    <Card height='100%'>
      <MenuCardMedia sx={{height: 325}} image={imageUrl} />
      <Box p={1} textAlign='center'>
        <BannerContentBox {...bannerContent} html={html} justifyContent={justifyContent} alignItems={alignItems}
                          textAlign={textAlignment} />
      </Box>
    </Card>
  );
};
