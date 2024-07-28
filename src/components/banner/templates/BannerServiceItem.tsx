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
import {Box, styled, useTheme} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H4, Span} from '@/components/common/bazaar/Typography';
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {FlexBox} from '@/components/common/flex-box';

//custom styled components
const FashionServiceItem = styled(FlexRowCenter)(({theme}) => ({
  'borderRight': `1px solid ${theme.palette.grey[400]}`,
  '& .service-text': {
    '& p': {
      margin: 0,
    },
  },
  ':last-child': {borderRight: 0},
  [theme.breakpoints.down('md')]: {':nth-of-type(even)': {borderRight: 0}},
  [theme.breakpoints.down('sm')]: {
    borderRight: 0,
    justifyContent: 'flex-start',
  },
}));

const GiftServicesStyledFlexBox = styled(FlexBox)(({theme}) => ({
  'flexWrap': 'nowrap',
  'background': '#fff',
  'alignItems': 'center',
  'padding': '1.5rem 0.8rem',
  'justifyContent': 'center',
  'border': `1px solid ${theme.palette.grey[300]}`,
  'height': '100%',
  '& .service-text': {
    '& p': {
      margin: 0,
    },
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    padding: '1rem 0.5rem',
    flexDirection: 'column',
  },
}));

const GroceryServicesStyledFlexBox = styled(FlexBox)(({theme}) => ({
  'flexWrap': 'nowrap',
  'padding': '1.5rem',
  'background': '#fff',
  'borderRadius': '8px',
  'boxShadow': theme.shadows[2],
  '& .service-text': {
    '& p': {
      margin: 0,
    },
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    padding: '1rem 0.5rem',
    flexDirection: 'column',
  },
}));

const IconBox = styled(FlexBox)(({theme}) => ({
  alignItems: 'center',
  background: theme.palette.info[50],
  borderRadius: '50%',
  fontSize: '22px',
  height: '22px',
  padding: '12px',
}));

const MarketServiceItem = styled(FlexRowCenter)(({theme}) => ({
  'borderRight': `1px solid ${theme.palette.grey[400]}`,
  '& .service-text': {
    '& p': {
      margin: 0,
    },
  },
  ':last-child': {borderRight: 0},
  [theme.breakpoints.down('md')]: {':nth-of-type(even)': {borderRight: 0}},
  [theme.breakpoints.down('sm')]: {
    borderRight: 0,
    justifyContent: 'flex-start',
  },
}));

export const BannerServiceItem: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;
  const {title, text, images} = bannerContent;
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');
  const theme = useTheme();

  const color =
    bannerParams.textColor === 'white' ? theme.palette.common.white : theme.palette.grey[600];
  const textAlign =
    bannerParams.textAlignment === 'left'
      ? 'left'
      : bannerParams.textAlignment === 'right'
        ? 'right'
        : 'center';
  const template = bannerParams.template;

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  const getServiceItem = (template: string) => {
    switch (template) {
      case 'fashionservices1':
        return (
          <FashionServiceItem flexGrow={1} gap={2}>
            <img src={imageUrl} height={50} width={50} alt='' />
            <Box textAlign={textAlign}>
              <H4 color={color} lineHeight={1.3}>
                {title}
              </H4>
              <Span
                className='service-text'
                color={color}
                dangerouslySetInnerHTML={{__html: text}}
              />
            </Box>
          </FashionServiceItem>
        );
      case 'fashionservices2':
        return (
          <FlexRowCenter flexDirection='column'>
            <img src={imageUrl} height={50} width={50} alt='' />
            <H4 color={color} lineHeight={1.3}>
              {title}
            </H4>
            <Span className='service-text' color={color} dangerouslySetInnerHTML={{__html: text}} />
          </FlexRowCenter>
        );
      case 'giftservices':
        return (
          <GiftServicesStyledFlexBox gap={1.5}>
            <IconBox>
              <img alt='' src={imageUrl} height={50} width={50} />
            </IconBox>
            <Box textAlign={textAlign}>
              <H4 color={color} mb='5px' fontSize='1rem' fontWeight='600'>
                {title}
              </H4>
              <Span
                className='service-text'
                color={color}
                dangerouslySetInnerHTML={{__html: text}}
              />
            </Box>
          </GiftServicesStyledFlexBox>
        );
      case 'groceryservices':
        return (
          <GroceryServicesStyledFlexBox alignItems='center' gap={2}>
            <FlexBox alignItems='center' color='grey.600' fontSize='50px'>
              <img alt='' height={50} width={50} src={imageUrl} />
            </FlexBox>
            <Box textAlign={textAlign}>
              <H4 color={color} fontSize='1rem' fontWeight='700'>
                {title}
              </H4>
              <Span
                className='service-text'
                color={color}
                dangerouslySetInnerHTML={{__html: text}}
              />
            </Box>
          </GroceryServicesStyledFlexBox>
        );
      default:
        return (
          <MarketServiceItem flexGrow={1} gap={2}>
            <img alt='' height={50} width={50} src={imageUrl} />
            <Box textAlign={textAlign}>
              <H4 color={color} lineHeight={1.3}>
                {title}
              </H4>
              <Span
                className='service-text'
                color={color}
                dangerouslySetInnerHTML={{__html: text}}
              />
            </Box>
          </MarketServiceItem>
        );
    }
  };

  return getServiceItem(template);
};
