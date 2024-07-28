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
import {Box, styled} from '@mui/material';
//components
import {H3, Paragraph} from '@/components/common/bazaar/Typography';
//types
import {ParagraphEntryProps} from '../../ArticleComponentTypes';

//Custom styled components
const ParagraphEntryBox = styled(Box)({
  margin: '0 1px',
  '& img': {margin: '2px'},
});

export const ParagraphEntry = ({title, description}: ParagraphEntryProps) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(description);
  }, [description]);

  return (
    <ParagraphEntryBox>
      {title && <H3>{title}</H3>}
      {html && <Paragraph dangerouslySetInnerHTML={{__html: html}} />}
    </ParagraphEntryBox>
  );
};
