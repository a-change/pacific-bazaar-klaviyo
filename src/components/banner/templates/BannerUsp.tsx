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
import {Box, Stack, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H4, Span} from '@/components/common/bazaar/Typography';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {PacificLink} from '@/utils/CommonTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {stripePTags} from '@/utils/HtmlUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const ServiceItem = styled(FlexRowCenter, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<{textColor: string}>(
  ({theme, textColor}) => ({
    color: textColor,
    margin: '1rem auto',
    minWidth: 160,
    [theme.breakpoints.between(theme.breakpoints.values.sm, 820)]: {
      minWidth: 220,
    },
  }));

const ServiceItemLink = styled(Span)({
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

export const BannerUsp: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, text, links, images} = bannerContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {textColor, textAlignment} = bannerParams;

  const justifyContent = getJustifyContent(textAlignment);

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  return (
    <ServiceItem gap={2} textColor={textColor}>
      <Box flexGrow={1} maxWidth={75}>
        <BazaarImage alt={title} width='100%' src={imageUrl} />
      </Box>
      <Box flexGrow={1} maxWidth='248px'>
        <Stack alignItems={justifyContent}>
          <H4 lineHeight={1.3}>{title}</H4>
          <Span color='secondary.main' dangerouslySetInnerHTML={{__html: stripePTags(html)}} />
          {links
            ?.filter((link) => !!link?.url)
            .map((link: PacificLink, key: number) =>
              link.isExternal ? (
                <a href={link.url ?? '#'} key={key}>
                  <ServiceItemLink>{link.label}</ServiceItemLink>
                </a>
              ) : (
                // The below <Link> default href may need to be changed
                <Link href={link.url ?? ''} key={key} legacyBehavior>
                  <a>
                    <ServiceItemLink>{link.label}</ServiceItemLink>
                  </a>
                </Link>
              ),
            )}
        </Stack>
      </Box>
    </ServiceItem>
  );
};
