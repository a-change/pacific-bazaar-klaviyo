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

import {Reference} from '@bloomreach/spa-sdk';

type MenuContentItem = {
  name: string,
  url: string,
  display: string,
  selected: boolean,
  subTitle?: string,
  icon?: string,
  image?: string,
  banner?: any | null,
  userType?: string,
  categoryId?: string,
  isDynamicCategory?: boolean,
  childNavItems?: Array<MenuContentItem>,
};

type MenuContent = {
  name: string,
  menuContentItems: Array<MenuContentItem>,
}

type MenuTemplate =
  | 'default'
  | 'site-menu'
  | 'multi-column-vertical'
  | 'horizontalbutton';

type MenuComponentParams = {
  siteMenu?: string,
  template: MenuTemplate;
};

type MenuComponentCustomProps = {
  documentRef?: Reference,
  params?: MenuComponentParams,
  disableWrapper?: boolean;
};

type MenuTemplateProps = {
  menuContent: MenuContent,
  menuParams?: MenuComponentParams
}

export type {
  MenuContent,
  MenuContentItem,
  MenuTemplateProps,
  MenuTemplate,
  MenuComponentParams,
  MenuComponentCustomProps,
};