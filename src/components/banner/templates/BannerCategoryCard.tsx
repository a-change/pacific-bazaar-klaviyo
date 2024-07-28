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
import {FC} from 'react';
//next
import Link from 'next/link';
//mui
import {Box, styled, useTheme} from '@mui/material';
//components
import {H4} from '@/components/common/bazaar/Typography';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';

// custom styled components
const Wrapper = styled(Box)(({theme}) => ({
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '4px',
  '& img': {
    transition: 'all 0.3s',
  },
  ':hover': {
    img: {transform: 'scale(1.1)'},
  },
}));

const CategoryTitle = styled(Box)({
  left: 10,
  right: 10,
  bottom: 10,
  padding: 8,
  borderRadius: '2px',
  position: 'absolute',
  transition: 'all 0.3s',
});

export const BannerCategoryCard: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, titleLink, images} = bannerContent;
  const {textColor, textAlignment} = bannerParams;
  const theme = useTheme();

  const backgroundColor = textColor === 'white' ? 'rgba(0,0,0,0.67)' : 'rgba(255,255,255,0.67)';
  const color = textColor === 'white' ? theme.palette.common.white : theme.palette.dark.main;
  const hoverBackgroundColor = textColor === 'white' ? theme.palette.common.white : theme.palette.dark.main;
  const hoverColor = textColor === 'white' ? theme.palette.dark.main : theme.palette.common.white;
  const textAlign = textAlignment;

  return (
    <Wrapper
      position='relative'
      sx={{
        ':hover': {
          '& .category-title': {
            color: hoverColor,
            backgroundColor: hoverBackgroundColor,
          },
        },
      }}
    >
      <img
        src={images['original']?.url}
        width={'100%'}
        height={170}
        alt='category'
      />

      <CategoryTitle className='category-title' sx={{backgroundColor, color, textAlign}}>
        <H4>{titleLink ? <Link href={titleLink?.url ?? ''}>{title}</Link> : title}</H4>
      </CategoryTitle>
    </Wrapper>
  );
};