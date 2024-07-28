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
//components
import {Video} from '@/components/video/Video';
//types
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {VideoComponentCustomProps, VideoComponentParams, VideoContent} from './VideoComponentTypes';
//functions
import {getMockVideoContent, getVideoContent, getVideoParams} from '@/components/video/VideoComponentUtils';
import {getContentTypePrefix} from '@/utils/DocumentUtils';

export const VideoComponent = (props: BrProps & VideoComponentCustomProps) => {
  const {page, component, documentRef, params} = props;

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as VideoComponentParams;

  // models
  const {document: video} = component.getModels();
  const videoDocumentRef = documentRef ?? video;

  const document = page.getContent(videoDocumentRef);

  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const data = document?.getData();

  const videoContent: VideoContent = data ? getVideoContent(data, page) : getMockVideoContent();
  const videoParams: VideoComponentParams = getVideoParams(mergedParams);

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}Video-document`,
    path: 'videos',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}Video`,
    editOnly: false,
  };

  return <Video {...{
    ...props,
    ...renderInlineEditingProps,
    videoContent,
    videoParams,
    mock,
  }} />;
};