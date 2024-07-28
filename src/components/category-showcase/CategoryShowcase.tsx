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
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {BannerComponent} from '@/components/banner/BannerComponent';
import {BannerCollectionComponent} from '@/components/banner-collection/BannerCollectionComponent';
//types
import {
  CategoryShowcaseComponentCustomProps,
  CategoryShowcaseComponentParams,
  CategoryShowcaseContent,
  CategoryShowcaseTemplateProps,
} from './CategoryShowcaseComponentTypes';
import {FlexBox} from '@/components/common/flex-box';
import {Container} from '@mui/material';

function CategoryShowcaseBase(props: BrProps & CategoryShowcaseComponentCustomProps & CategoryShowcaseTemplateProps) {
  const {
    page,
    component,
    categoryShowcaseContent: {heroBanner, banners},
    categoryShowcaseParams: {template, textAlignment, textColor},
  } = props;

  switch (template) {
    case 'default':
    default:
      return (
        <FlexBox flexDirection={'column'}>
          <BannerComponent {...{page, component}} documentRef={heroBanner} params={{
            template: 'full-width',
            textAlignment,
            textColor,
          }} disableWrapper />
          <FlexBox sx={{mt: '-3rem'}}>
            <Container disableGutters>
              <BannerCollectionComponent {...{page, component}} pageable={banners} params={{
                template: 'card',
              }} />
            </Container>
          </FlexBox>
        </FlexBox>
      );
  }
}

export const CategoryShowcase = withWrapper(withInlineEditing(CategoryShowcaseBase));
