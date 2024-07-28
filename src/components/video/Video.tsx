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
//mui
import {Box} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//types
import {VideoComponentCustomProps, VideoTemplateProps} from './VideoComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//components
import {H1} from '@/components/common/bazaar/Typography';
//templates
import {VideoCenter, VideoFullWidth, VideoLeft, VideoRight} from '@/components/video/templates';

function VideoBase(props: BrProps & VideoComponentCustomProps & VideoTemplateProps) {
  const {videoContent, videoParams} = props;

  const RenderBody = () => {
    switch (videoParams.template) {
      case 'full-width':
        return <VideoFullWidth {...{videoContent, videoParams}} />;
      case 'center':
        return <VideoCenter {...{videoContent, videoParams}} />;
      case 'right':
        return <VideoRight {...{videoContent, videoParams}} />;
      case 'left':
      default:
        return <VideoLeft {...{videoContent, videoParams}} />;
    }
  };

  let sx = {};
  if (videoContent?.images?.[ImageSizeEnum.Original] && videoParams.template !== 'full-width') {
    sx = {
      ...sx, ...{
        'backgroundImage': `url('${videoContent?.images?.[ImageSizeEnum.Original]?.url}')`,
        'backgroundSize': 'cover',
        'backgroundPosition': '50% 50%',
        'backgroundRepeat': 'no-repeat',
      },
    };
  }

  return <Box sx={sx}>
    {videoContent?.componentTitle && <H1 sx={{textAlign: 'center', marginY: '2'}}>{videoContent?.componentTitle}</H1>}
    <RenderBody />
  </Box>;
}

export const Video = withWrapper(withInlineEditing(VideoBase));
