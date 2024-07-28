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
import {Stack, Typography} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {CommonTitle} from '@/components/common/title/CommonTitle';
//types
import {GeneratedTextTemplateProps} from '@/components/generated-text/GeneratedTextComponentTypes';
//functions
import {stripePTags} from '@/utils/HtmlUtils';

const GeneratedTextBase = (props: BrProps & GeneratedTextTemplateProps) => {
  const {
    generatedTextContent: {title, generatedText},
  } = props;

  return (
    <Stack spacing={2}>
      <CommonTitle title={title} />
      <Typography dangerouslySetInnerHTML={{__html: stripePTags(generatedText).replaceAll('\n', '<br/>')}} />
    </Stack>
  );
};

export const GeneratedText = withWrapper(GeneratedTextBase);
