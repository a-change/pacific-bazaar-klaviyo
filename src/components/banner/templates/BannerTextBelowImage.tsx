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
import Link from 'next/link';
//mui
import {Box, Button, styled} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {PacificLink} from '@/utils/CommonTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const BannerTextBelowImageBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'textColor',
})<{textColor?: string}>(
  ({theme, textColor}) => ({
    'color': textColor,
    'borderRadius': '3px',
    'boxShadow': theme.shadows[2],
    'transition': 'all 0.3s',
    'backgroundColor': theme.palette.common.white,
    ':hover': {
      '& img': {transform: 'scale(1.1)'},
    },
  }));

export const BannerTextBelowImage: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {text, links, images} = bannerContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, imageAlignment, verticalAlignment} = bannerParams;

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const justifyContent = getJustifyContent(textAlignment);
  const alignItems = getJustifyContent(verticalAlignment);

  return (
    <BannerTextBelowImageBox height='100%' textColor={textColor}>
      <CardMedia height={'320px'} image={imageUrl} component={'img'} sx={{
        objectFit: imageAlignment ?? 'cover',
      }} />

      <Box p={1} textAlign='center'>
        <BannerContentBox {...bannerContent} html={html} hideCta={true} justifyContent={justifyContent}
                          alignItems={alignItems} textAlign={textAlignment} />

        {links?.map((link: PacificLink, key: number) =>
          link.url && link.isExternal ? (
            <a href={link.url ?? '#'} key={key}>
              <Button size={'large'} variant={key === 0 ? 'contained' : 'outlined'}>
                {link.label}
              </Button>
            </a>
          ) : (
            // The below <Link> default href may need to be changed
            <Link href={link.url ?? ''} key={key}>
              <Button size={'large'} variant={key === 0 ? 'contained' : 'outlined'}>
                {link.label}
              </Button>
            </Link>
          ),
        )}
      </Box>
    </BannerTextBelowImageBox>
  );
};
