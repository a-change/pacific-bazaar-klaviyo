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
import React, {useEffect, useState} from 'react';
//mui
import {Button, Grid} from '@mui/material';
//components
import {H2, Paragraph} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {VideoTemplateProps} from '@/components/video/VideoComponentTypes';
import Link from 'next/link';

export const VideoContent = (props: VideoTemplateProps) => {
  const {videoContent, videoParams: {width, height}} = props;
  const {title, description, videoItem, link, images} = videoContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(description);
  }, [description]);

  const RenderLinkButton = () => {
    const {isExternal, url, size, label, variant} = link;
    return isExternal ? (
      <a href={url ?? ''}>
        <Button
          size={size}
          variant={variant}
          color='primary'
        >
          {label}
        </Button>
      </a>
    ) : (
      <Link href={url ?? ''}>
        <Button
          size={size}
          variant={variant}
          color='primary'
        >
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <Grid item xs={12} md={5}>
      <FlexBox justifyContent={'center'} alignItems={'center'} flexDirection={'column'} sx={{height: '100%'}}>
        {title && <H2>{title}</H2>}
        {html && <Paragraph dangerouslySetInnerHTML={{__html: html}} />}
        {link && <RenderLinkButton />}
      </FlexBox>
    </Grid>
  );
};
