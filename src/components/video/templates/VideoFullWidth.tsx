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
//components
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
//types
import {VideoTemplateProps} from '@/components/video/VideoComponentTypes';

export const VideoFullWidth = (props: VideoTemplateProps) => {
  const {videoContent: {title, videoItem}, videoParams: {height}} = props;

  const {videoLink, videoType} = videoItem;
  return (
    <FlexFullScreen>
      {videoType === 'hosted' ? (
        <video height={height} width={'100%'} controls>
          <source src={videoLink} />
        </video>
      ) : (
        <iframe
          height={height}
          width={'100%'}
          frameBorder={'0'}
          title={title}
          src={videoLink}
        ></iframe>
      )}
    </FlexFullScreen>
  );
};
