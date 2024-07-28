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
import React, {useEffect, useState} from 'react';
//mui
import {Stack} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H2, Paragraph} from '@/components/common/bazaar/Typography';
//types
import {InlineAssetTemplateProps} from '@/components/inline-assets/InlineAssetComponentTypes';
//utils
import {getImageSize} from '@/utils/ImageUtils';
//templates
import {ImageBox} from '@/components/article/templates';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';

function InlineAssetDefaultBase(props: InlineAssetTemplateProps) {
  const {inlineAssetContent, inlineAssetParams: {height, width, alignment}} = props;
  const {title, text, html: htmlInput, images} = inlineAssetContent;
  const [html, setHtml] = useState('');
  const windowSize = useWindowSize();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    images && setImageUrl(images[getImageSize(windowSize, images)]?.url);
  }, [images, windowSize]);

  useEffect(() => {
    setHtml(htmlInput);
  }, [htmlInput]);

  let imageParams: any = {
    src: imageUrl,
  };

  if (width) imageParams.width = width;
  if (height) imageParams.height = height;

  const alignItems = getJustifyContent(alignment);

  return (
    <Stack spacing={2} alignItems={alignItems}>
      {title && <H2>{title}</H2>}
      {text && (
        <Paragraph>{text}</Paragraph>
      )}
      {html && (
        <Paragraph dangerouslySetInnerHTML={{__html: html}} />
      )}
      {imageUrl && (
        <ImageBox>
          <img {...imageParams} alt={'inline image'} />
        </ImageBox>
      )}
    </Stack>
  );
};

export const InlineAssetDefault = withWrapper(InlineAssetDefaultBase);
