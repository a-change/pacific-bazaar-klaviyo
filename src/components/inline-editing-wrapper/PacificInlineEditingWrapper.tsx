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

/* eslint-disable react/display-name */
import React, {Fragment} from 'react';
//mui
import {Box, styled} from '@mui/material';
//bloomreach sdks
import {ManageContentButton, Menu} from '@bloomreach/spa-sdk';
import {BrManageContentButton, BrManageMenuButton, BrProps} from '@bloomreach/react-sdk';

export type RenderInlineEditingProps = {
  menu?: Menu;
  editOnly?: boolean;
} & ManageContentButton;

const InlineEditingBox = styled(Box)({
  position: 'relative',
  height: 'fit-content',
  left: '100%',
  width: 'fit-content',
});

function withInlineEditingBase<P extends BrProps>(Component: React.ComponentType<P>) {
  return (props: P & RenderInlineEditingProps) => {
    const {
      page,
      menu,
      content,
      documentTemplateQuery,
      parameter = 'document',
      path,
      root,
      pickerSelectableNodeTypes,
      relative = true,
      editOnly = true,
      pickerInitialPath,
    } = props;

    if (!page?.isPreview()) {
      return (
        <Component {...props} />
      );
    }

    const InlineEditingUI = () => {
      if (menu) {
        return (
          <InlineEditingBox>
            <BrManageMenuButton menu={menu} />
          </InlineEditingBox>
        );
      } else {
        if (content) {
          return (
            <InlineEditingBox>
              <BrManageContentButton content={content} />
            </InlineEditingBox>
          );
        } else if (!editOnly) {
          const configs = {
            documentTemplateQuery,
            parameter,
            path,
            relative,
            root,
            pickerSelectableNodeTypes,
            pickerRemembersLastVisited: true,
            pickerInitialPath,
            pickerConfiguration: 'cms-pickers/documents-only',
          };
          return (
            <InlineEditingBox>
              <BrManageContentButton
                {...configs}
              />
            </InlineEditingBox>
          );
        } else {
          return null;
        }
      }
    };

    return (
      <Fragment>
        <InlineEditingUI />
        <Component {...props} />
      </Fragment>
    );
  };
}

export function withInlineEditing<P extends BrProps>(Component: React.ComponentType<P>) {
  return withInlineEditingBase(Component);
}