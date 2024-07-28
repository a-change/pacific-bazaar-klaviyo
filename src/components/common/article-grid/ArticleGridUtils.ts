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

import {BrArticle, ImageLink} from '@/utils/CommonTypes';
import {ArticleContent} from '@/components/article/ArticleComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {Page} from '@bloomreach/spa-sdk';
import {sanitize} from '@/utils/HtmlUtils';

export const getArticleContent = (article: BrArticle, page: Page): ArticleContent => {
  const {title, image, tags, introduction, url} = article;
  const images: Partial<Record<ImageSizeEnum, ImageLink>> = {};
  images[ImageSizeEnum.Original] = {
    type: 'external',
    url: image,
  };

  let articleUrl = url;
  if (url.indexOf('/articles') !== -1) {
    articleUrl = url.substring(url.indexOf('/articles'));
  }
  if (url.indexOf('/artikel') !== -1) {
    articleUrl = url.substring(url.indexOf('/artikel'));
  }

  if (url?.endsWith('.pdf')) {
    articleUrl = url;
  } else {
    articleUrl = page.getUrl(articleUrl);
  }

  return {
    description: sanitize(introduction),
    images,
    tags,
    title,
    link: {
      url: articleUrl,
    },
  };
};