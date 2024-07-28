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
import {Box, styled, Typography} from '@mui/material';
//components
import {Paragraph} from '@/components/common/bazaar/Typography';
//types
import {SimpleContentTemplateProps} from '@/components/simple-content/SimpleContentComponentTypes';

const SimpleContentPageHeaderParagraph = styled(Paragraph)(({theme}) => ({
  color: theme.palette.warning.main,
  fontSize: '2rem',
}));
export const SimpleContentPageHeader = (props: SimpleContentTemplateProps) => {
  const {simpleContentContent, simpleContentParams: {textCenter}} = props;
  const {title, introduction, text} = simpleContentContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const sx = textCenter ? {
    textAlign: 'center',
  } : {};

  return (
    <Box sx={sx}>
      {title && <Typography component={'h1'} sx={{
        fontSize: '4rem',
        fontWeight: '600',
      }}>{title}</Typography>}
      {introduction && (
        <SimpleContentPageHeaderParagraph dangerouslySetInnerHTML={{__html: introduction}} />
      )}
      {text && (
        <Paragraph dangerouslySetInnerHTML={{__html: html}} />
      )}
    </Box>
  );
};
