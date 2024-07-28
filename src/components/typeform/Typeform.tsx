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
//next
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {Status} from '@/components/common/status/Status';
//types
import {TypeformComponentCustomProps, TypeformTemplateProps} from './TypeformComponentTypes';
//templates
import {TypeformDefault, TypeformFormLeft, TypeformFormRight} from '@/components/typeform/templates';

function TypeformBase(props: BrProps & TypeformComponentCustomProps & TypeformTemplateProps) {
  const {page, typeformContent, typeformParams} = props;
  const {template, formId} = typeformParams;
  const {t} = useTranslation('common');

  if (!formId && !typeformContent?.header) {
    if (page.isPreview()) {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Form'})} />;
    } else {
      return null;
    }
  }

  switch (template) {
    case 'form-left':
      return <TypeformFormLeft {...{typeformParams, typeformContent}} />;
    case 'form-right':
      return <TypeformFormRight {...{typeformParams, typeformContent}} />;
    default:
      return <TypeformDefault {...{typeformParams, typeformContent}} />;
  }
}

export const Typeform = withWrapper(TypeformBase);
