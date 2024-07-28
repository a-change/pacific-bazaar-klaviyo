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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
//types
import {MenuComponentParams, MenuContent} from './MenuComponentTypes';
//templates
import {
  MenuHorizontalButton,
  MenuMultiColumnVertical,
  MenuSiteMenu,
  MenuSiteMenuMobile,
} from '@/components/menu/templates';

//Component Props
interface MenuProps {
  menuContent: MenuContent,
  menuParams: MenuComponentParams,
}

function MenuBase(props: BrProps & MenuProps) {
  const {menuContent, menuParams} = props;
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const templateProps = {menuContent, menuParams};
  switch (menuParams.template) {
    case 'multi-column-vertical':
      return <MenuMultiColumnVertical {...templateProps} />;
    case 'horizontalbutton':
      return <MenuHorizontalButton {...templateProps} />;
    case 'site-menu':
    default:
      return downMd ? <MenuSiteMenuMobile {...templateProps} /> : <MenuSiteMenu {...templateProps} />;
  }
}

export const MenuPacific = withWrapper(withInlineEditing(MenuBase));