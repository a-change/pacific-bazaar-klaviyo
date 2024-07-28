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
import {
  InlineAssetComponentParams,
  InlineAssetContent,
  InlineAssetTemplate,
} from '@/components/inline-assets/InlineAssetComponentTypes';
import {getImageVariants} from '@/utils/ImageUtils';
import {stripePTags} from '@/utils/HtmlUtils';

const getInlineAssetContent = (
  content: any,
  page: Page,
): InlineAssetContent => {
  const {title, asset: assets} = content;

  const asset = assets?.[0];
  const contentType = asset?.contentType;

  let inlineAssetContent = {
    title,
  } as InlineAssetContent;

  switch (contentType) {
    case 'brxsaas:demoInlineHtml':
      inlineAssetContent.html = stripePTags(asset?.html?.value);
      break;
    case 'brxsaas:demoInlineText':
      inlineAssetContent.text = asset?.text;
      break;
    case 'brxsaas:demoImage':
      inlineAssetContent.images = getImageVariants(asset, page);
      break;
    default:
      break;
  }

  return inlineAssetContent;
};

const getMockInlineAssetContent = (): InlineAssetContent => {
  return {
    title: 'Mock Inline Asset Title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat tortor sit amet tortor iaculis finibus. Aliquam quis risus eget libero vehicula interdum. Suspendisse sit amet felis dignissim, ultrices nisi id, facilisis ligula. Proin nec lacus vel purus feugiat tincidunt ut id sem. Etiam commodo vehicula tortor, imperdiet dictum lectus sodales at. Donec viverra efficitur enim non accumsan. Fusce tempor, lectus consequat ullamcorper elementum, eros mi dapibus ex, sed accumsan ex mi ac augue. Quisque efficitur dolor nulla, malesuada venenatis massa venenatis in. Etiam lobortis nulla tellus, et facilisis nibh tempor vel. Maecenas tempus lectus in nulla ullamcorper volutpat. Duis luctus turpis vel dolor semper viverra. Ut imperdiet ligula et nulla blandit, at pulvinar nunc pretium.',
  } as InlineAssetContent;
};

const getInlineAssetParams = (params: any): InlineAssetComponentParams => {
  const template = params['template'] || 'default';
  const {width = '100%', height, alignment} = params;
  return {
    template: template as InlineAssetTemplate,
    width,
    height,
    alignment,
  };
};

export {
  getInlineAssetContent,
  getInlineAssetParams,
  getMockInlineAssetContent,
};