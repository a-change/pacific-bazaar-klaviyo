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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//types
import {SimpleContentComponentCustomProps, SimpleContentTemplateProps} from './SimpleContentComponentTypes';
//templates
import {
  SimpleContentDefault,
  SimpleContentFooter,
  SimpleContentPageHeader,
} from '@/components/simple-content/templates';

function SimpleContentBase(props: BrProps & SimpleContentComponentCustomProps & SimpleContentTemplateProps) {
  const {simpleContentContent, simpleContentParams} = props;

  switch (simpleContentParams.template) {
    case 'footer':
      return <SimpleContentFooter {...{simpleContentContent, simpleContentParams}} />;
    case 'page-header':
      return <SimpleContentPageHeader {...{simpleContentContent, simpleContentParams}} />;
    default:
      return <SimpleContentDefault {...{simpleContentContent, simpleContentParams}} />;
  }
}

export const SimpleContent = withWrapper(withInlineEditing(SimpleContentBase));
