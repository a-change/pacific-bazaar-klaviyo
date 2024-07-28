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
import {useRouter} from 'next/router';
//mui
import {Button} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
//types
import {ListPaginationTemplateProps} from '@/components/common/list-pagination/ListPaginationTypes';
//components
import {FlexRowCenter} from '@/components/common/flex-box';


export const ListPaginationTwoButton = ({listPaginationContent}: ListPaginationTemplateProps) => {
  const {
    previous,
    previousPageUrl,
    nextPageUrl,
    next,
  } = listPaginationContent;

  const router = useRouter();

  const gotoPage = (pageUrl: string) => {
    router.push(pageUrl);
  };

  return (
    <FlexRowCenter mt={4}>
      {previous && <Button aria-label='previous' size='small' startIcon={<ChevronLeftIcon />} onClick={() => {
        gotoPage(previousPageUrl);
      }}>
        previous
      </Button>}
      {next && <Button aria-label='next' size='small' endIcon={<ChevronRightIcon />} onClick={() => {
        gotoPage(nextPageUrl);
      }}>
        next
      </Button>}
    </FlexRowCenter>
  );
};
