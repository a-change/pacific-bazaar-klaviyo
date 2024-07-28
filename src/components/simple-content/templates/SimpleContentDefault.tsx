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
import {Box} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H2, Paragraph} from '@/components/common/bazaar/Typography';
//types
import {SimpleContentTemplateProps} from '@/components/simple-content/SimpleContentComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {CommonTitle} from '@/components/common/title/CommonTitle';

export const SimpleContentDefault = (props: SimpleContentTemplateProps) => {
  const {simpleContentContent, simpleContentParams: {textCenter, width, height, location}} = props;
  const {title, introduction, text, images} = simpleContentContent;
  const [html, setHtml] = useState('');
  const windowSize = useWindowSize();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    images && setImageUrl(images[getImageSize(windowSize, images)]?.url);
  }, [images, windowSize]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const sx = textCenter ? {
    textAlign: 'center',
  } : {};

  let imageStyle: any = {};
  if (location === 'left') {
    imageStyle.float = 'left';
    imageStyle.margin = '1rem 2rem 2rem 0';
  }
  if (location === 'right') {
    imageStyle.float = 'right';
    imageStyle.margin = '1rem 0 2rem 2rem';
  }

  return (
    <Box sx={sx}>
      {(title || introduction) && <CommonTitle title={title} alignment={'left'} subTitle={introduction} />}
      {imageUrl &&
        <img src={imageUrl} style={imageStyle} width={width || '300px'} height={height || '100%'} alt={'image'} />}
      {text && (
        <Paragraph dangerouslySetInnerHTML={{__html: html}} />
      )}
      <div style={{
        clear: 'both',
      }} />
    </Box>
  );
};
