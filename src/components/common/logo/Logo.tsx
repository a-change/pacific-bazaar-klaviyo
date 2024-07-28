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

import {BrProps} from '@bloomreach/react-sdk';
import {MenuContentItem, MenuTemplateProps} from '@/components/menu/MenuComponentTypes';
import {MenuHorizontalButton} from '@/components/menu/templates';

export const Logo = (props: BrProps) => {
  const {page} = props;
  const {logo} = page.getChannelParameters();

  const menuTemplateProps: MenuTemplateProps = {
    menuContent: {
      name: 'logo',
      menuContentItems: [{
        name: 'Home',
        display: 'image',
        url: page.getUrl('/'),
        image: logo,
      } as MenuContentItem],
    },
    menuParams: {
      template: 'horizontalbutton',
      siteMenu: null,
    },
  };

  return <MenuHorizontalButton {...menuTemplateProps} />;
};