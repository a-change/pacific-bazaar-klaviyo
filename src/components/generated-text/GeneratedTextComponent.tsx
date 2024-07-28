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
import {ContainerItem, Document} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//components
import {GeneratedText} from '@/components/generated-text/GeneratedText';
import {Status} from '@/components/common/status/Status';
//types
import {
  GeneratedTextComponentCustomProps,
  GeneratedTextComponentParams,
  GeneratedTextContent,
} from '@/components/generated-text/GeneratedTextComponentTypes';

export const GeneratedTextComponent = (props: BrProps & GeneratedTextComponentCustomProps) => {
  const {
    page,
    component,
    params,
  } = props;

  const {t} = useTranslation('common');

  // parameters
  const componentParams = component.getParameters();
  const generatedTextComponentParams = {...componentParams, ...params} as GeneratedTextComponentParams;

  const containerItem = (component as ContainerItem)!;
  const {generatedText}: any = containerItem.getContent(page!);

  const document = page!.getDocument<Document>();

  let mock = false;
  if (!generatedText) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const {title}: any = document?.getData() ?? {};

  const generatedTextContent: GeneratedTextContent = mock ? {
    title: 'Mock Generated Text Title',
    generatedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat tortor sit amet tortor iaculis finibus. Aliquam quis risus eget libero vehicula interdum. Suspendisse sit amet felis dignissim, ultrices nisi id, facilisis ligula. Proin nec lacus vel purus feugiat tincidunt ut id sem. Etiam commodo vehicula tortor, imperdiet dictum lectus sodales at. Donec viverra efficitur enim non accumsan. Fusce tempor, lectus consequat ullamcorper elementum, eros mi dapibus ex, sed accumsan ex mi ac augue. Quisque efficitur dolor nulla, malesuada venenatis massa venenatis in. Etiam lobortis nulla tellus, et facilisis nibh tempor vel. Maecenas tempus lectus in nulla ullamcorper volutpat. Duis luctus turpis vel dolor semper viverra. Ut imperdiet ligula et nulla blandit, at pulvinar nunc pretium.',
  } : {
    title,
    generatedText,
  };

  return (
    <GeneratedText
      {...{generatedTextComponentParams, generatedTextContent, mock}}
      {...props}
    />
  );
};
