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
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//components
import {CommonTitle} from '@/components/common/title/CommonTitle';
//types
import {VideoTemplateProps} from '@/components/video/VideoComponentTypes';

export const VideoCenter = (props: VideoTemplateProps) => {
  const {videoContent: {title, description, videoItem}, videoParams: {height}} = props;
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const {videoLink, videoType} = videoItem;
  return (
    <Grid container spacing={3}>
      <Grid item sm={12}>
        <CommonTitle title={title} subTitle={description} />
      </Grid>
      <Grid item sm={12} sx={{
        width: '100%',
      }}>
        {videoType === 'hosted' ? (
          <video height={height} width={'100%'} controls>
            <source src={videoLink} />
          </video>
        ) : (
          <iframe
            height={downMd ? '350px' : height}
            width={'100%'}
            frameBorder={'0'}
            title={title}
            src={videoLink}
          ></iframe>
        )}
      </Grid>
    </Grid>
  );
};
