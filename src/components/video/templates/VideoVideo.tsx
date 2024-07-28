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
import {Grid} from '@mui/material';
//components
import {FlexBox} from '@/components/common/flex-box';
//types
import {VideoTemplateProps} from '@/components/video/VideoComponentTypes';

export const VideoVideo = (props: VideoTemplateProps) => {
  const {videoContent, videoParams: {width, height}} = props;
  const {title, videoItem} = videoContent;

  const {videoLink, videoType} = videoItem;

  return (
    <Grid item xs={12} md={7}>
      <FlexBox alignItems={'center'} flexDirection={'column'} sx={{height: '100%'}}>
        {videoType === 'hosted' ? (
          <video width={width} height={height} controls>
            <source src={videoLink} />
          </video>
        ) : (
          <iframe
            width={width}
            height={height}
            frameBorder={'0'}
            title={title}
            src={videoLink}
          ></iframe>
        )}
      </FlexBox>
    </Grid>
  );
};