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
import React, {useContext} from 'react';
//Bloomreach sdks
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//types
import {FooterTemplateProps} from '@/components/footer/FooterComponentTypes';
//templates
import {FooterDefault} from '@/components/footer/templates/FooterDefault';

export const FooterComponent = () => {

  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);

  const {footerTemplate: template} = page.getChannelParameters();
  const {menu: sitemap, contact, copyright, social, visitor} = component.getModels();

  const footerTemplateProps = {
    footerContent: {
      contact,
      sitemap,
      copyright,
      social,
      visitor,
    },
    footerParams: {
      template,
    },
  } as FooterTemplateProps;

  switch (template) {
    case 'default':
    default:
      return <FooterDefault {...footerTemplateProps} {...{page, component}} />;
  }
};