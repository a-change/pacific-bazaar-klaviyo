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
import {VideoComponentParams, VideoContent, VideoItem} from '@/components/video/VideoComponentTypes';
import {getSelectValue} from '@/utils/SelectUtils';

export const getMockVideoContent = (): VideoContent => {
  return {
    title: 'Mock Video Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    videoItem: {
      videoLink: 'https://www.youtube.com/embed/7OMxBlK46wY',
      videoType: 'youtube',
    },
  } as VideoContent;
};

export const getVideoContent = (data: any, page: Page): VideoContent => {
  const {title, description, videoitem, demoVideoItem} = data;
  const video = getVideoItem(page!, videoitem ?? demoVideoItem);

  return {
    title,
    description, //: page!.rewriteLinks(description),
    videoItem: video,
  } as VideoContent;
};

export const getVideoParams = (params: any): VideoComponentParams => {
  const template = params['template'] ?? 'default';
  const height = params['height'] || 300;
  const width = params['width'] || 400;

  return {
    height,
    template,
    width,
  } as VideoComponentParams;
};

export const getVideoItem = (page: Page, videoitem: any): VideoItem => {
  let {videoId, videoType: videoTypeInput, autoplay} = videoitem[0];
  let videoLink;

  let videoType = getSelectValue(videoTypeInput) ?? videoTypeInput;

  switch (videoType) {
    case 'youtube':
      videoLink = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}`;
      break;
    case 'dailymotion':
      videoLink = `//www.dailymotion.com/embed/video/${videoId}`;
      break;
    case 'vimeo':
      videoLink = `https://player.vimeo.com/video/${videoId}`;
      break;
    default:
      videoType = 'hosted';
      const videoRef = videoitem?.[0]?.hstLink ?? videoitem?.[0]?.internalLink;
      if (videoRef) {
        const videoDocument: any = page!.getContent(videoRef);
        if (videoDocument) {
          videoLink = videoDocument?.data?.asset?.links?.site?.href;
          //videoLink = videoDocument?.getUrl && videoDocument?.getUrl();
        }
      }
      break;
  }

  return {
    videoId,
    videoType,
    videoLink: videoLink || '',
  };
};
