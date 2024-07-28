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
import {Box, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H2, Paragraph} from '@/components/common/bazaar/Typography';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
//types
import {BannerSize, BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {stripePTags} from '@/utils/HtmlUtils';
//templates
import {CardContent} from '@/components/banner/templates/BannerCard';

export const ImageListBannerSizes = {
  small: {
    height: 164,
  },
  medium: {
    height: 240,
  },
};

export const BannerImageListCardWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== 'rows' && props !== 'size',
})<{rows: number, size: BannerSize}>(({theme, rows = 1, size = 'small'}) => {
  let height = ImageListBannerSizes?.[size]?.height ?? ImageListBannerSizes?.['small']?.height;
  return {
    'maxHeight': height * rows,
    'overflow': 'hidden',
    'position': 'relative',
    '& img': {transition: '0.3s'},
    ':hover': {
      img: {transform: 'scale(1.1)'},
      a: {
        textDecoration: 'underline',
      },
    },
  };
});

export const BannerImageList: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, subtitle, text, links, images, titleLink} = bannerContent;
  const [html, setHtml] = useState('');
  const [subTitle, setSubTitle] = useState('');

  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, imageAlignment, verticalAlignment, rows, size} = bannerParams;

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  useEffect(() => {
    setSubTitle(subtitle);
  }, [subtitle]);

  return (
    <BannerImageListCardWrapper color={textColor} rows={rows} size={size}>
      <BazaarImage alt={title} height='100%' width='100%' src={imageUrl} />

      <CardContent contentAlign={textAlignment} verticalAlign={verticalAlignment} className='content'>
        {subtitle && <Paragraph dangerouslySetInnerHTML={{__html: stripePTags(subtitle)}} />}
        <H2 sx={{textTransform: 'uppercase'}}>{titleLink?.url ?
          <Link href={titleLink?.url ?? ''}>{title}</Link> : title}</H2>
        <Paragraph dangerouslySetInnerHTML={{__html: stripePTags(html)}} />
        {/*links?.map((link: PacificLink, key: number) =>
          link.url && link.isExternal ? (
            <a href={link.url ?? '#'} key={key}>
              <CardLink>{link.label}</CardLink>
            </a>
          ) : (
            // The below <Link> default href may need to be changed
            <Link href={link.url ?? ''} key={key} legacyBehavior>
              <a>
                <CardLink>{link.label}</CardLink>
              </a>
            </Link>
          ),
        )*/}
      </CardContent>
    </BannerImageListCardWrapper>
  );
};
