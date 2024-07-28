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

import React, {createContext, useEffect, useReducer, useState} from 'react';
import {CategoryNavigatorTemplateProps} from '@/components/category-navigator/CategoryNavigatorComponentTypes';
import {BrProduct, BrSearchResults} from '@/utils/CommonTypes';

type GlobalSearchContextType = {
  globalSearchParams: any,
  setGlobalSearchParams: (params: any) => void,
  categoryNavigators: Record<string, CategoryNavigatorTemplateProps>,
  setCategoryNavigators: React.Dispatch<Record<string, CategoryNavigatorTemplateProps>>
  menuCategories: Record<string, BrSearchResults<BrProduct>>,
  setMenuCategories: React.Dispatch<Record<string, BrSearchResults<BrProduct>>>
};

const initialState = {
  view_id: process.env.NEXT_PUBLIC_DEFAULT_VIEW_ID,
  segment_name: '',
  segment: '',
};

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

const GlobalSearchProvider = (props: any) => {
  const [globalSearchParams, setGlobalSearchParams] = useState(initialState);
  const [categoryNavigators, setCategoryNavigators] = useReducer(
    (state: Record<string, CategoryNavigatorTemplateProps>, newState: Record<string, CategoryNavigatorTemplateProps>) => {
      return {...state, ...newState};
    },
    {});
  const [menuCategories, setMenuCategories] = useReducer(
    (state: Record<string, BrSearchResults<BrProduct>>, newState: Record<string, BrSearchResults<BrProduct>>) => {
      return {...state, ...newState};
    },
    {});

  useEffect(() => {
    sessionStorage.setItem('searchContext', JSON.stringify(globalSearchParams));
    //DataLayerUtils.push( 'brx.search', globalSearchParams );
  }, [globalSearchParams]);

  return (
    <GlobalSearchContext.Provider
      value={{
        globalSearchParams,
        setGlobalSearchParams,
        categoryNavigators,
        setCategoryNavigators,
        menuCategories,
        setMenuCategories,
      }}>
      {props.children}
    </GlobalSearchContext.Provider>
  );
};

export {GlobalSearchContext, GlobalSearchProvider};
