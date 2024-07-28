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
import {Box, Divider, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H2, Paragraph, Span} from '@/components/common/bazaar/Typography';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {PacificLink} from '@/utils/CommonTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';

//Custom styled components
export const CardWrapper = styled(Box)({
  'maxHeight': 240,
  'overflow': 'hidden',
  'position': 'relative',
  '& img': {transition: '0.3s'},
  ':hover': {img: {transform: 'scale(1.1)'}},
});

export const CardContent = styled(Box, {
  shouldForwardProp: (props) => props !== 'contentAlign' && props !== 'verticalAlign',
})<{contentAlign: string, verticalAlign?: string}>(({contentAlign, verticalAlign}) => {
    let alignProps = {};
    if (contentAlign === 'left') {
      alignProps = {left: 32};
    } else if (contentAlign === 'right') {
      alignProps = {right: 32, alignItems: 'flex-end'};
    } else if (contentAlign === 'center') {
      alignProps = {width: '100%', alignItems: 'center'};
    }

    let justifyContent = 'center';
    if (verticalAlign === 'top') {
      justifyContent = 'flex-start';
    }
    if (verticalAlign === 'bottom') {
      justifyContent = 'flex-end';
    }

    return {
      top: 0,
      zIndex: 1,
      position: 'absolute',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent,
      ...alignProps,
    };
  },
);

export const CardLink = styled(Span)({
  'position': 'relative',
  'paddingBottom': '2px',
  'textTransform': 'uppercase',
  ':hover::after': {width: '100%'},
  ':after': {
    left: 0,
    bottom: 0,
    width: '0%',
    content: '\'\'',
    height: '2px',
    transition: '0.3s',
    position: 'absolute',
    backgroundColor: 'white',
  },
});

export const BannerCard: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, text, links, images} = bannerContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment, imageAlignment} = bannerParams;

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  return (
    <CardWrapper color={textColor}>
      <BazaarImage alt={title} height='100%' width='100%' src={imageUrl} />

      <CardContent contentAlign={textAlignment} className='content'>
        <H2>{title}</H2>
        <Paragraph dangerouslySetInnerHTML={{__html: html}} />
        <Divider sx={{borderWidth: 2, my: 1.5, width: 50}} />

        {links?.map((link: PacificLink, key: number) =>
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
        )}
      </CardContent>
    </CardWrapper>
  );
};
