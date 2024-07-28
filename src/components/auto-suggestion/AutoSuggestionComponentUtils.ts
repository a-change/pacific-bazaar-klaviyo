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

export const getSearchUrl = (keyword: string) => {
  const searchPageUrl = '/search';
  const encodedKeyword = encodeURIComponent(keyword);
  return `${searchPageUrl}${searchPageUrl.includes('?') ? '&' : '?'}_sq=${encodedKeyword}`;
};

export const getCategoriesUrl = (categoryId: string) => {
  const categoriesPageUrl = '/categories';
  const encodedCategoryId = encodeURIComponent(categoryId);
  return `${categoriesPageUrl}/${encodedCategoryId}`;
};

export const highLightSearchTerm = (query: string, suggest: string) => {
  const index = suggest.indexOf(query);
  if (index !== -1) {
    return `<span>${suggest.substring(0, index)}<b>${query}</b>${suggest.substring(
      index + query.length,
    )}</span>`;
  } else {
    return suggest;
  }
};