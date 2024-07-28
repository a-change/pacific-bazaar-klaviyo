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
import {FC, useState} from 'react';
import {Property} from 'csstype';
//next
import Link from 'next/link';
//mui
import {Box, styled} from '@mui/material';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
//components
import {slideDown} from '@/components/common/animations/keyframes';
//functions
import {stripePTags} from '@/utils/HtmlUtils';
import TextAlign = Property.TextAlign;

//custom styled components
const TextOnlyStripBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'color',
})<{color?: string}>(
  ({theme, color}) => ({
    backgroundColor: color === '#fff' ? theme.palette.dark.main : theme.palette.background.paper,
    borderBottom: '1px solid',
    borderColor: theme.palette.dark.main,
    color,
    display: 'flex',
    flexGrow: 1,
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    height: '60px',
    fontSize: 'large',
  }));

const TextOnlyStripBoxSpan = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'animate',
})<{animate?: boolean}>(({theme, animate}) => {
  const animateProps = animate ? {
    transition: 'all 350ms ease-in-out',
    animation: `${slideDown} 400ms ${theme.transitions.easing.easeInOut}`,
  } : {
    transition: 'all 700ms ease-in-out',
    transform: 'scale(0.8)',
  };
  return ({
    '&:hover': {
      'textDecoration': 'underline',
    },
    maxWidth: '100%',
    ...animateProps,
  });
});

export const BannerTextOnlyStrip: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams: {textColor, textAlignment}} = props;
  const {title, text, titleLink, links} = bannerContent;
  const [displayTitle, setDisplayTitle] = useState(true);

  setTimeout(() => {
    setDisplayTitle(!displayTitle);
  }, 10000);

  return (
    <Link href={titleLink?.url ?? links?.[0]?.url ?? ''}>
      <TextOnlyStripBox textAlign={textAlignment as TextAlign} color={textColor}>
        <TextOnlyStripBoxSpan
          dangerouslySetInnerHTML={{__html: displayTitle ? title : stripePTags(text)}}
          animate={displayTitle}
        />
      </TextOnlyStripBox>
    </Link>
  );
};
