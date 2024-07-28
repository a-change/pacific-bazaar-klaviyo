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
//components
import {MenuHorizontalButton} from '@/components/menu/templates';
//types
import {AuthorBioTemplateProps} from '@/components/author/AuthorBioComponentTypes';
//functions
import {MenuTemplateProps} from '@/components/menu/MenuComponentTypes';

export const AuthorBioSocialBar = (props: AuthorBioTemplateProps) => {
  const {authorBioContent: {accounts}} = props;
  if (!accounts) {
    return null;
  }

  const menuTemplateProps: MenuTemplateProps = {
    menuContent: {
      name: 'social',
      menuContentItems: accounts.map(account => {
        const {type, accountType, link} = account;
        return {
          name: accountType || type,
          url: link.url,
          display: 'icon',
          selected: false,
        };
      }),
    },
  };
  return (
    <div>
      <MenuHorizontalButton {...menuTemplateProps} />
    </div>
  );
};