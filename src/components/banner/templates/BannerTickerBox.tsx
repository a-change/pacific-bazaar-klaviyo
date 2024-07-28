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
//components
import {H3, Paragraph, Span} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
import {slideX} from '@/components/common/animations/keyframes';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {PacificLink} from '@/utils/CommonTypes';
//functions
import {stripePTags} from '@/utils/HtmlUtils';


//Custom styled components
const AdWrapper = styled(FlexBox, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<{textColor: string}>(
  ({theme, textColor}) => ({
    color: textColor,
    marginTop: '1rem',
    overflow: 'hidden',
    backgroundColor: '#434343',
    position: 'relative',
    '::before': {
      inset: 5,
      zIndex: 3,
      content: '\'\'',
      position: 'absolute',
      border: '1px dashed #fff',
    },
    [theme.breakpoints.down('sm')]: {flexDirection: 'column'},
  }));

const AdTitle1 = styled(H3)(({theme}) => ({
  zIndex: 10,
  fontSize: 27,
  padding: '1.5rem',
  position: 'relative',
  backgroundColor: theme.palette.grey[300],
  textTransform: 'uppercase',
  color: theme.palette.dark.main,
  '::after': {
    top: -36,
    bottom: 0,
    zIndex: -1,
    right: -17,
    content: '\'\'',
    position: 'absolute',
    transform: 'rotate(23deg)',
    border: '70px solid #e0e0e0',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 16,
    '::after': {display: 'none'},
  },
}));

export const BannerTickerBox: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, text, links} = bannerContent;
  const [html, setHtml] = useState('');

  const {textColor} = bannerParams;

  useEffect(() => {
    setHtml(text);
  }, [text]);

  return (
    <AdWrapper alignItems='center' textColor={textColor}>
      <AdTitle1>{title}</AdTitle1>

      <Paragraph
        fontSize={28}
        sx={{
          flex: 1,
          zIndex: 5,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'hidden',
        }}
      >
        <Span
          sx={{
            letterSpacing: 1.3,
            fontStyle: 'italic',
            position: 'relative',
            whiteSpace: 'nowrap',
            textOverflow: 'hidden',
            textTransform: 'uppercase',
            animation: `${slideX} 45s infinite linear 1s`,
          }}
          dangerouslySetInnerHTML={{
            __html: stripePTags(html),
          }} />
      </Paragraph>

      <Box sx={{padding: 3, flexShrink: 0, zIndex: 5}}>
        {links
          ?.filter((link) => link?.url && link?.label)
          .map((link: PacificLink, key: number) => {
            const {url, isExternal, label, openInNewWindow} = link;
            const target = openInNewWindow ? '_blank' : '_self';
            return isExternal ? (
              <a href={url ?? ''} target={target} key={key}>
                <Button
                  size={'small'}
                  variant={'contained'}
                  color='primary'
                >
                  {label}
                </Button>
              </a>
            ) : (
              <Link href={url ?? ''} target={target} key={key}>
                <Button
                  size={'small'}
                  variant={'contained'}
                  color='primary'
                >
                  {label}
                </Button>
              </Link>
            );
          })}
      </Box>
    </AdWrapper>
  );
};
