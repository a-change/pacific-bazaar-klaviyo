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
//types
import {TypeformTemplateProps} from '@/components/typeform/TypeformComponentTypes';
//templates
import {TypeformWidget} from '@/components/typeform/templates/TypeformWidget';
import {CommonTitle} from '@/components/common/title/CommonTitle';
import {stripePTags} from '@/utils/HtmlUtils';

export const TypeformFormRight = (props: TypeformTemplateProps) => {
  const {typeformContent: {header}, typeformParams: {formId}} = props;

  return (
    <Grid container sx={{marginY: 3}}>
      <Grid item xs={12} md={6}>
        {header && <CommonTitle title={stripePTags(header)} />}
      </Grid>
      <Grid item xs={12} md={6}>
        {formId && <TypeformWidget {...props} />}
      </Grid>
    </Grid>
  );
};