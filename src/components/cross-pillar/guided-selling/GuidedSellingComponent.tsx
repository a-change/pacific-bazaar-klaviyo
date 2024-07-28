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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
//components
import {GuidedSelling} from '@/components/cross-pillar/guided-selling/GuidedSelling';
//functions
import {
  getGuidedSellingContent,
  getMockGuidedSellingContent,
} from '@/components/cross-pillar/guided-selling/GuidedSellingComponentUtils';

export const GuidedSellingComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;

  // parameters
  const content = getContainerItemContent<any>(component, page);

  const noContent = !content.completeLabel && content.search.length === 0;

  let mock = false;
  if (noContent) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }
  const guidedSellingContent = mock ? getMockGuidedSellingContent() : getGuidedSellingContent(content, page);

  return <GuidedSelling {...{
    ...props,
    guidedSellingContent,
    mock,
  }} />;
};
