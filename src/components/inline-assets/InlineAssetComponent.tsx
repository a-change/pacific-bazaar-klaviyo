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
//next
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
//components
import {Status} from '@/components/common/status/Status';
//functions
import {
  getInlineAssetContent,
  getInlineAssetParams,
  getMockInlineAssetContent,
} from '@/components/inline-assets/InlineAssetComponentUtils';
//templates
import {InlineAssetDefault} from '@/components/inline-assets/templates/InlineAssetDefault';

export const InlineAssetComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;
  const {t} = useTranslation('common');

  // models
  const content = getContainerItemContent<any>(component, page);

  // parameters
  const inlineAssetParams = getInlineAssetParams(component.getParameters());
  let inlineAssetContent = getInlineAssetContent(content, page);

  const hasContent = content?.title || content?.asset?.[0];

  let mock = false;
  if (!hasContent) {
    if (page.isPreview()) {
      mock = true;
      inlineAssetContent = getMockInlineAssetContent();
    } else {
      return null;
    }
  }

  switch (inlineAssetParams?.template) {
    default:
    case 'default':
      return <InlineAssetDefault {...{
        page,
        component,
        inlineAssetParams,
        inlineAssetContent,
        mock,
      }} />;
  }
};