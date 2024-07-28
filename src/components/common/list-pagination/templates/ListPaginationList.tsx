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
import React, {useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
//mui
import {Pagination} from '@mui/material';
//types
import {ListPaginationTemplateProps} from '@/components/common/list-pagination/ListPaginationTypes';
//components
import {FlexBetween} from '@/components/common/flex-box';
import {Span} from '@/components/common/bazaar/Typography';

export const ListPaginationList = ({
                                     listPaginationContent,
                                     listPaginationParams: {itemsLabel = 'items'},
                                   }: ListPaginationTemplateProps) => {
  const {
    currentPage,
    endOffset,
    total,
    totalPages,
    offset,
    getUrl,
  } = listPaginationContent;

  const router = useRouter();
  const {t} = useTranslation('product');

  const [selectedPage, setSelectedPage] = useState<number>(currentPage);

  useEffect(() => {
    if (selectedPage !== currentPage) {
      setSelectedPage(currentPage);
    }
  }, [currentPage, selectedPage]);

  if (!totalPages) {
    return null;
  }

  const gotoPage = (pageUrl: string) => {
    router.push(pageUrl);
  };

  return (
    <FlexBetween flexWrap='wrap' my={4}>
      <Span color='grey.600'>{t('showing-n-results', {
        offset: offset + 1,
        endOffset,
        total,
        itemsLabel: t(itemsLabel),
      })}</Span>
      <Pagination count={totalPages} page={selectedPage} variant='outlined' color='primary' showFirstButton
                  showLastButton onChange={(event: React.ChangeEvent<unknown>, page: number) => {
        setSelectedPage(page);
        gotoPage(getUrl(page));
      }} />
    </FlexBetween>
  );
};
