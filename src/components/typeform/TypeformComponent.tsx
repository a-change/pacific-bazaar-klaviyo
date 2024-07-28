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
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//types
import {
  TypeformComponentCustomProps,
  TypeformComponentParams,
  TypeformContentType,
} from '@/components/typeform/TypeformComponentTypes';
//templates
import {Typeform} from '@/components/typeform/Typeform';
import {FormCrossPillarComponent} from '@/components/cross-pillar/form/FormCrossPillarComponent';

export const TypeformComponent = (props: BrProps<ContainerItem> & TypeformComponentCustomProps) => {
  const {page, component, params} = props;
  const content = getContainerItemContent<any>(component, page!);

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as TypeformComponentParams;

  if (content?.contentType === 'brxsaas:bruialphaForm') {
    return <FormCrossPillarComponent {...props} />;
  }

  if (content?.contentType === 'brxsaas:bruialphaTypeform') {
    const formJson = JSON.parse(content?.form ?? '[]');
    const formId = formJson?.[0]?.content?.id;
    const header = formJson?.[0]?.content?.title;

    let height = `${mergedParams?.height}`;
    if (height?.endsWith('px')) {
      height = height.replaceAll('px', '');
    }

    const typeformContent: TypeformContentType = {header};
    const typeformParams: TypeformComponentParams = {
      template: 'default',
      formId,
      height: parseInt(height),
    };

    return <Typeform {...props} {...{typeformParams, typeformContent}} />;
  }

  const header = content?.header;

  const typeformContent: TypeformContentType = {header};
  const typeformParams: TypeformComponentParams = mergedParams as TypeformComponentParams;

  let mock = false;
  if (!typeformParams?.formId && !typeformContent?.header) {
    if (page.isPreview()) {
      mock = true;
      typeformContent.header = 'Mock Form Header';
    } else {
      return null;
    }
  }

  return <Typeform {...props} {...{typeformParams, typeformContent, mock}} />;
};