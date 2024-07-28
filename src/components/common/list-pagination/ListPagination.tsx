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
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//types
import {ListPaginationTemplateProps} from './ListPaginationTypes';
//templates
import {ListPaginationList, ListPaginationMobile, ListPaginationTwoButton} from './templates';

export const ListPagination = (props: ListPaginationTemplateProps) => {
  const {
    listPaginationParams: {template},
  } = props;

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  if (downMd) {
    return <ListPaginationMobile {...props} />;
  } else {
    switch (template) {
      case 'two-button':
        return <ListPaginationTwoButton {...props} />;
      case 'mobile':
        return <ListPaginationMobile {...props} />;
      case 'list':
      default:
        return <ListPaginationList {...props} />;
    }
  }
};
