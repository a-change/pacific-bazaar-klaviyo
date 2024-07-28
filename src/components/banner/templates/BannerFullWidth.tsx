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
//mui
import {Box, Container, styled} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const boxStyle = {
  minHeight: '450px', //650
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
};

const ContentBox = styled(Box)(({theme}) => ({
  'paddingLeft': 60,
  'width': '100%',
  '& p': {fontSize: 13, lineHeight: 1.4},
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    width: '100%',
  },
}));

const BannerFullWidthBox = styled(FlexFullScreen, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent',
})<{imageUrl?: string; textColor?: string; justifyContent?: string}>(
  ({theme, imageUrl, textColor, justifyContent}) => ({
    ...boxStyle,
    'justifyContent': `${justifyContent}`,
    'color': `${textColor}`,
    'background': theme.palette.primary[100],
    'backgroundImage': `url('${imageUrl}')`,
    'backgroundSize': 'cover',
    'backgroundPosition': '50% 50%',
    'backgroundRepeat': 'no-repeat',
    '& p': {},
    [theme.breakpoints.down('lg')]: {
      height: '30vw',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      textAlign: 'center',
      height: '40vw',
    },
    [theme.breakpoints.down('sm')]: {
      'backgroundSize': 'auto',
      '& p': {display: 'none'},
    },
  }),
);

export const BannerFullWidth: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;

  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const {text, images} = bannerContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const {textColor, textAlignment, verticalAlignment} = bannerParams;

  const justifyContent = getJustifyContent(textAlignment, downMd);
  const alignItems = getJustifyContent(verticalAlignment);

  return (
    <BannerFullWidthBox imageUrl={imageUrl} textColor={textColor} justifyContent={justifyContent}>
      <Container
        disableGutters
        sx={{
          display: 'flex',
          justifyContent,
          alignItems: justifyContent,
          textAlign: textAlignment,
        }}
      >
        <ContentBox>
          <BannerContentBox {...bannerContent} html={html} size={'large'} justifyContent={justifyContent}
                            alignItems={alignItems} textAlign={textAlignment} />
        </ContentBox>
      </Container>
    </BannerFullWidthBox>
  );
};
