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

import {Reference} from '@bloomreach/spa-sdk';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {ImageLink} from '@/utils/CommonTypes';

type SimpleContentContent = {
  title: string;
  introduction: string;
  text: string;
  images?: Partial<Record<ImageSizeEnum, ImageLink>>
};

type SimpleContentTemplate =
  | 'default'
  | 'footer'
  | 'page-header';

type SimpleContentComponentParams = {
  template: SimpleContentTemplate;
  textCenter?: boolean;
  content?: SimpleContentContent;
  width?: string;
  height?: string;
  location?: string;
};

type SimpleContentComponentCustomProps = {
  documentRef?: Reference;
  params?: SimpleContentComponentParams;
};

type SimpleContentTemplateProps = {
  simpleContentContent: SimpleContentContent,
  simpleContentParams?: SimpleContentComponentParams
}

export type {
  SimpleContentContent,
  SimpleContentTemplateProps,
  SimpleContentTemplate,
  SimpleContentComponentParams,
  SimpleContentComponentCustomProps,
};