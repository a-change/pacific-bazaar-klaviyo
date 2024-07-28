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
import {Card, CardContent, Stack, styled} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H4} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getContrastColor} from '@/utils/ThemeUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Property} from 'csstype';
import TextAlign = Property.TextAlign;

//Custom styled components
const BannerSlotCard = styled(Card)(({theme}) => ({
  'height': '100%',
  'borderRadius': '8px',
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

const BannerSlotCardH6 = styled(H4)(({theme}) => ({
  'a:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export const BannerSlot: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams: {textColor, textAlignment, verticalAlignment, size, productLink}} = props;
  const {title, titleLink, links, images} = bannerContent;
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setImageUrl((images[getImageSize(width, images)] ?? images[ImageSizeEnum.Original])?.url);
  }, [width, images]);

  const link = titleLink ?? links?.[0];
  const justifyContent = getJustifyContent(textAlignment, downMd);
  const alignItems = getJustifyContent(verticalAlignment, downMd);

  return (
    <BannerSlotCard>
      <MenuCardMedia sx={{height: size === 'small' ? 240 : 280}} image={imageUrl} />
      <CardContent sx={{backgroundColor: getContrastColor(textColor), display: 'flex'}}>
        <FlexBox sx={{width: '100%', minHeight: '40px'}} justifyContent={justifyContent} alignItems={alignItems}>
          <BannerSlotCardH6 sx={{
            color: textColor,
          }}>
            <Stack justifyContent={justifyContent} textAlign={textAlignment as TextAlign}>
              {link?.url ? <Link href={link?.url ?? ''}>{title}</Link> : title}
              {productLink && <Link href={productLink?.url ?? ''}>{productLink.label}</Link>}
            </Stack>
          </BannerSlotCardH6>
        </FlexBox>
      </CardContent>
    </BannerSlotCard>
  );
};
