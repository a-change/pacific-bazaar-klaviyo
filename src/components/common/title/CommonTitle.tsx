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
import {Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//components
import {H1} from '@/components/common/bazaar/Typography';
import {Paragraph} from '@/components/common/typography/Typography';
//functions
import {stripePTags} from '@/utils/HtmlUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

export interface CommonTitleProps {
  title: string,
  subTitle?: string,
  alignment?: string
}

export const CommonTitle = (props: CommonTitleProps) => {
  const {title, subTitle, alignment = 'center'} = props;
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Stack direction={'column'} sx={{
      marginY: title ? '1rem' : '0',
      marginX: title ? '0.5rem' : '0',
      alignItems: downMd ? 'center' : getJustifyContent(alignment),
      justifyContent: downMd ? 'center' : getJustifyContent(alignment),
      flexWrap: 'wrap',
    }}>
      {title && <H1 dangerouslySetInnerHTML={{
        __html: title,
      }} />}
      {subTitle && <Paragraph color='grey.600' dangerouslySetInnerHTML={{
        __html: stripePTags(subTitle),
      }} />}
    </Stack>
  );
};