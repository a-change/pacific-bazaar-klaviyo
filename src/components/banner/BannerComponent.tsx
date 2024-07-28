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
import React from 'react';
//mui
import {useTheme} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//types
import {BannerComponentCustomProps, BannerComponentParams, BannerContent} from './BannerComponentTypes';
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
//functions
import {getBannerContent, getBannerParams, getMockBannerContent} from '@/components/banner/BannerComponentUtils';
//templates
import {Banner} from '@/components/banner/Banner';
import {getContentTypePrefix} from '@/utils/DocumentUtils';

export const BannerComponent = (props: BrProps & BannerComponentCustomProps) => {
  const {page, component, documentRef, params} = props;
  const theme = useTheme();

  // models
  const {banner} = component.getModels();
  const bannerDocumentRef = documentRef ?? banner;

  const document = bannerDocumentRef ? page.getContent(bannerDocumentRef) : null;

  // prod mode without document
  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as BannerComponentParams;

  const bannerContent: BannerContent = document ? getBannerContent(document?.getData(), page) : getMockBannerContent();
  const bannerParams: BannerComponentParams = getBannerParams(mergedParams, theme);

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}Banner-document`,
    path: 'banners',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}Banner`,
    editOnly: false,
  };

  return (
    <Banner
      {...{
        ...props,
        ...renderInlineEditingProps,
        bannerContent,
        bannerParams,
        mock,
      }}
    />
  );
};
