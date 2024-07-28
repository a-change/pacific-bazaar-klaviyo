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
//mui
import {BrProps} from '@bloomreach/react-sdk';
//components
import {CategoryNavigatorCrossPillar} from '@/components/cross-pillar/category-navigator/CategoryNavigatorCrossPillar';
//types
import {
  CategoryNavigatorComponentCustomProps,
  CategoryNavigatorComponentParams,
} from '@/components/category-navigator/CategoryNavigatorComponentTypes';

export const CategoryNavigatorCrossPillarComponent = (props: BrProps & CategoryNavigatorComponentCustomProps) => {
  const {page, component, params} = props;

  const {t} = useTranslation('search');

  // parameters
  const componentParams = component.getParameters();
  const categoryNavigatorComponentParams = {...componentParams, ...params} as CategoryNavigatorComponentParams;

  return <CategoryNavigatorCrossPillar
    {...{
      query: '*',
    }}
    categoryNavigatorContent={{}}
    categoryNavigatorParams={categoryNavigatorComponentParams}
    {...props} />;
};