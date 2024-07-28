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
//next
import {usePathname} from 'next/navigation';
//mui
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {CategoryNavigator} from '@/components/category-navigator/CategoryNavigator';
//types
import {
  CategoryNavigatorComponentCustomProps,
  CategoryNavigatorComponentParams,
} from '@/components/category-navigator/CategoryNavigatorComponentTypes';
//templates
import {CategoryNavigatorDefault} from '@/components/category-navigator/templates';

export const CategoryNavigatorComponent = (props: BrProps & CategoryNavigatorComponentCustomProps) => {
  const {page, component, params} = props;
  const {categoryNavigators} = useContext(GlobalSearchContext);
  const channelId = usePathname()?.split('/')?.[1];
  // parameters
  const componentParams = component.getParameters();
  const categoryNavigatorComponentParams = {...componentParams, ...params} as CategoryNavigatorComponentParams;

  if (!page.isPreview() && categoryNavigators?.[channelId]) {
    return <CategoryNavigatorDefault
      {...categoryNavigators?.[channelId]}
    />;
  }

  return <CategoryNavigator
    {...{
      query: '*',
    }}
    categoryNavigatorContent={{}}
    categoryNavigatorParams={categoryNavigatorComponentParams}
    {...props} />;
};