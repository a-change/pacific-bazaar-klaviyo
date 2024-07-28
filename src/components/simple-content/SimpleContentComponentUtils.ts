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

import {Page} from '@bloomreach/spa-sdk';
import {SimpleContentComponentParams, SimpleContentContent, SimpleContentTemplate} from './SimpleContentComponentTypes';
import {getImageVariants} from '@/utils/ImageUtils';

const getMockSimpleContentContent = () => {
  return {
    title: 'Mock Simple Content Title',
    introduction: `Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua.`,
    text: `Ac ut consequat semper viverra nam libero justo laoreet sit.
        Donec massa sapien faucibus et molestie. Dignissim suspendisse in
        est ante in nibh mauris cursus mattis. In arcu cursus euismod quis
        viverra nibh cras pulvinar mattis. Adipiscing bibendum est ultricies
        integer quis auctor elit. Interdum posuere lorem ipsum dolor sit amet.`,
  } as SimpleContentContent;
};

const getSimpleContentContent = (
  data: any,
  page: Page,
): SimpleContentContent => {
  const {content, title, introduction, image: images} = data;
  return {
    title,
    introduction,
    text: content?.value ?? content,
    images: getImageVariants(images, page),
  };
};

const getSimpleContentParams = (params: any): SimpleContentComponentParams => {
  const {width, height, location} = params;
  const template = params['template'] || 'default';

  return {
    template: template as SimpleContentTemplate,
    textCenter: params['layout'] === 'text-center',
    width,
    height,
    location,
  };
};

export {
  getMockSimpleContentContent,
  getSimpleContentContent,
  getSimpleContentParams,
};