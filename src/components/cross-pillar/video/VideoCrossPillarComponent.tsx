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
import {Video} from '@/components/video/Video';
import {VideoComponentParams, VideoContent} from '@/components/video/VideoComponentTypes';
import {getVideoItem} from '@/components/video/VideoComponentUtils';
import {PacificLink} from '@/utils/CommonTypes';
import {getSelectValue} from '@/utils/SelectUtils';
import {getImageVariants} from '@/utils/ImageUtils';
//types
//functions

export const VideoCrossPillarComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;

  // models
  const content = getContainerItemContent<any>(component, page);

  if (!page.isPreview() && !content) {
    return null;
  }

  const {
    content: {title: contentTitle, subtitle: introduction, cta, content: {value: html}},
    title,
    video: videos,
    poster,
  } = content;

  // parameters
  const {autoplay, layout, ratio} = component.getParameters();

  const youtube = videos?.[0]?.youtube;

  let template;
  switch (layout) {
    case 'full-width':
      template = 'full-width';
      break;
    case 'video-banner-left':
      template = 'right';
      break;
    case 'video-banner-right':
    default:
      template = 'left';
      break;
  }

  let link;
  if (cta) {
    const {text, link: links, type} = cta;
    const firstLink = links?.[0];
    if (firstLink) {
      const {contentType, link: ctaLink} = firstLink;
      const isExternal = contentType === 'brxsaas:bruialphaExternalLink';
      let target;
      let url;
      if (contentType === isExternal) {
        url = ctaLink.link;
        target = ctaLink.target;
      } else {
        const linkContent = page.getContent<Document>(ctaLink) as any;
        url = linkContent?.getUrl();
      }
      link = {
        isExternal,
        label: text,
        openInNewWindow: target === '_blank',
        url,
        variant: getSelectValue(type) === 'button' ? 'contained' : 'text',
      } as PacificLink;
    }
  }

  const videoItem = getVideoItem(page, [{
    videoId: youtube,
    videoType: 'youtube',
    autoplay,
  }]);

  let width = 600;
  let height = 400;
  switch (ratio) {
    case '16:9':
      height = 600 / 19 * 6;
      break;
    case '4:3':
      height = 600 / 4 * 3;
      break;
    case '3:2':
      height = 600 / 3 * 2;
      break;
    case '8:5':
      height = 600 / 8 * 5;
      break;
    case '1:1':
      height = 600;
      break;
  }

  return videoItem && <Video
    {...{
      videoContent: {
        componentTitle: title,
        title: contentTitle,
        description: html,
        link,
        videoItem,
        images: poster && getImageVariants(poster, page),
      } as VideoContent,
      videoParams: {
        template,
        height,
        width,
      } as VideoComponentParams,
    }}
    {...props}
  />;

};