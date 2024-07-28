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
import React, {FC, useEffect, useState} from 'react';
//mui
import {Container, Grid, Stack, styled} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {BannerContentBox} from '@/components/banner/templates/BannerContentBox';
import {BannerFullWidth} from '@/components/banner/templates/BannerFullWidth';
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';
import {Property} from 'csstype';
import FlexBox from '@/components/common/flex-box/FlexBox';
import TextAlign = Property.TextAlign;

//Custom styled components
const BannerSplitPanelBox = styled(FlexFullScreen, {
  shouldForwardProp: (prop) =>
    prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent' && prop !== 'alignItems' && prop !== 'textAlign',
})<{
  imageUrl?: string;
  textColor?: string;
  justifyContent?: string;
  alignItems?: string;
  textAlign?: string
}>(
  ({theme, imageUrl, textColor, justifyContent, alignItems, textAlign}) => ({
    justifyContent,
    alignItems,
    textAlign: `${textAlign as TextAlign}`,
    color: `${textColor}`,
    backgroundColor: theme.palette.grey[200],
    backgroundSize: '50% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right top',
  }),
);

const BannerSplitPanelContentBox = styled(FlexBox, {
  shouldForwardProp: (prop) =>
    prop !== 'alignItems',
})<{alignItems?: string}>(
  ({theme, alignItems}) => ({
    alignItems,
    marginTop: alignItems === 'flex-start' ? '16px' : '0',
    marginBottom: alignItems === 'flex-end' ? '16px' : '0',
    width: '100%',
    height: '70vh',
  }));

export const BannerSplitPanel: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
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

  const justifyContent = getJustifyContent(textAlignment);
  const alignItems = getJustifyContent(verticalAlignment);

  if (downMd) {
    return <BannerFullWidth {...props} />;
  }

  return (
    <BannerSplitPanelBox
      image={imageUrl}
      textColor={textColor}
      justifyContent={justifyContent}
      alignItems={alignItems}
      textAlign={textAlignment as TextAlign}
    >
      <Container>
        <Grid container>
          <Grid item md={6}>
            <BannerSplitPanelContentBox alignItems={alignItems}>
              <Stack spacing={2}>
                <BannerContentBox {...bannerContent} html={html} justifyContent={justifyContent} alignItems={alignItems}
                                  textAlign={textAlignment} />
              </Stack>
            </BannerSplitPanelContentBox>
          </Grid>
          <Grid item md={6}></Grid>
        </Grid>
      </Container>
    </BannerSplitPanelBox>
  );
};
