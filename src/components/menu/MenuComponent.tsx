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
import {Menu} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//components
import {MenuPacific} from '@/components/menu/Menu';
//types
import {MenuComponentCustomProps, MenuComponentParams, MenuContent} from './MenuComponentTypes';
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
//functions
import {getMenuContent, getMenuParams, getMockMenuContent} from '@/components/menu/MenuComponentUtils';

export const MenuComponent = (props: BrProps & MenuComponentCustomProps) => {
  const {page, component, documentRef, params} = props;
  const {t} = useTranslation('common');

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as MenuComponentParams;

  // models
  const {menu: menuRef} = component.getModels();
  const menuDocumentRef = documentRef ?? menuRef;
  const menu = page.getContent<Menu>(menuDocumentRef);

  let mock = false;
  if (!menu) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const menuBanners: any = {};

  Object.keys(mergedParams)
    .filter((key) => key.startsWith('menuItemBanner') && !!mergedParams[key])
    .forEach((key) => {
      menuBanners[page!.getContent(mergedParams[key])?.getData().title] = mergedParams[key];
    });

  const banners = menuBanners || {};

  const data = mock ? null : {
    menu,
    banners,
  };

  const menuContent: MenuContent = data ? getMenuContent(data, page) : getMockMenuContent();
  const menuParams: MenuComponentParams = getMenuParams(mergedParams);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    menu,
  };

  return <MenuPacific {...{
    ...props,
    ...renderInlineEditingProps,
    menuContent,
    menuParams,
    mock,
  }} />;
};