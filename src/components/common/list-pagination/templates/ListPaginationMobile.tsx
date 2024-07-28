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
import React, {useState} from 'react';
//next
import {useRouter} from 'next/router';
//mui
import {Pagination} from '@mui/material';
//types
import {ListPaginationTemplateProps} from '@/components/common/list-pagination/ListPaginationTypes';
//components
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';

export const ListPaginationMobile = ({listPaginationContent}: ListPaginationTemplateProps) => {
  const {
    currentPage,
    totalPages,
    getUrl,
  } = listPaginationContent;

  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);
  if (!totalPages) {
    return null;
  }

  const gotoPage = (pageUrl: string) => {
    router.push(pageUrl);
  };

  return (
    <FlexRowCenter my={4}>
      <Pagination count={totalPages} defaultPage={selectedPage} siblingCount={0} boundaryCount={0} variant='outlined'
                  color='primary' onChange={(event: React.ChangeEvent<unknown>, page: number) => {
        setSelectedPage(page);
        gotoPage(getUrl(page));
      }} />
    </FlexRowCenter>
  );
};
