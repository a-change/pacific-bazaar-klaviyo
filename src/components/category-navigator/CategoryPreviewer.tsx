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
import React, {useContext, useEffect} from 'react';
import {
  ProductGridCategoryProps,
  ProductsCategoryInputProps,
  withProductGridCategory,
} from '@/hocs/product/ProductGridCategoryHoc';
import {BrProps} from '@bloomreach/react-sdk';
import {Status} from '@/components/common/status/Status';
import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material';
import {useRouter} from 'next/router';

function CategoryPreviewerBase(props: BrProps & ProductGridCategoryProps & ProductsCategoryInputProps) {
  const {
    page,
    loading,
    itemsPageResult,
    error,
  } = props;

  const router = useRouter();

  if (loading) {
    return <Status loading status={'We are fetching category products for you.'} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (!itemsPageResult) {
    return null;
  }

  const products = itemsPageResult.response.docs;

  return (
    <ImageList sx={{height: 520, textAlign: 'center', margin: '20px'}} variant={'masonry'} cols={4}
               rowHeight={164}>
      {products.sort(() => Math.random() - 0.5).slice(0, 12).map((item) => (
        <ImageListItem key={item.pid}>
          <img
            srcSet={`${item.thumb_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.thumb_image}?w=164&h=164&fit=crop&auto=format`}
            alt={item.title}
            onClick={() => router.push(page.getUrl(`/products/${item.pid}___${item.pid}`))}
            loading='lazy'
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export const CategoryPreviewer = withProductGridCategory(CategoryPreviewerBase);