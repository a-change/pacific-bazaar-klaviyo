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
import {ImageLink, PacificLink} from '@/utils/CommonTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';

type VideoItem = {
  videoId?: string;
  videoType: string;
  videoLink: string;
  autoplay?: boolean;
};

type VideoContent = {
  componentTitle?: string;
  title: string;
  description: string;
  link?: PacificLink;
  videoItem: VideoItem;
  images?: Partial<Record<ImageSizeEnum, ImageLink>>;
};

type VideoTemplate =
  | 'left'
  | 'right'
  | 'full-width'
  | 'center';

type VideoComponentParams = {
  template: VideoTemplate;
  height: number;
  width: number;
};

type VideoComponentCustomProps = {
  documentRef?: Reference;
  params?: VideoComponentParams;
};

type VideoTemplateProps = {
  videoContent: VideoContent,
  videoParams?: VideoComponentParams
}

export type {
  VideoContent,
  VideoTemplateProps,
  VideoTemplate,
  VideoComponentParams,
  VideoComponentCustomProps,
  VideoItem,
};