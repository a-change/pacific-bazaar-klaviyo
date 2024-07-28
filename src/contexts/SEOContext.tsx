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

import React, {useReducer} from 'react';

type SEOTagType = {
  tag: string,
  value?: string,
}

type SEOType = {
  title: string,
  description?: string,
  seoTags?: Array<SEOTagType>,
  canonicalUrl?: string,
}

type SEOContextType = {
  seo: Partial<SEOType>,
  setSeo: React.Dispatch<SEOType | null>
}

export type {
  SEOTagType,
  SEOType,
  SEOContextType,
};

let reducer = (seo: Partial<SEOType>, newSeo: SEOType | null) => {
  if (newSeo === null) {
    return {};
  }
  return {...seo, ...newSeo};
};

const SEOContext = React.createContext<SEOContextType | undefined>(undefined);

const SEOProvider = (props: any) => {
  const [seo, setSeo] = useReducer(reducer, {
    title: '',
    description: '',
    seoTags: [],
    canonicalUrl: '',
  } as SEOType);

  return (
    <SEOContext.Provider value={{seo, setSeo}}>
      {props.children}
    </SEOContext.Provider>
  );
};

export {SEOContext, SEOProvider};
