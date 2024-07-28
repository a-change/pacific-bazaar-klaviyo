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
//mui
import {Container, Grid} from '@mui/material';
//bloomreach sdk
import {Document, Pagination, Reference} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//types
import {ListPaginationParams} from '@/components/common/list-pagination/ListPaginationTypes';
//components
import {ArticleComponent} from '@/components/article/ArticleComponent';
import {ListPagination} from '@/components/common/list-pagination/ListPagination';
import {Status} from '@/components/common/status/Status';
import {Sorter} from '@/components/common/sorter/Sorter';
//functions
import {getListPaginationContentFromBrxm} from '@/components/common/list-pagination/ListPaginationUtils';

export const ArticleListComponent = (props: BrProps) => {
  const {page, component} = props;
  const [template, setTemplate] = useState('grid');
  const [showFacetList, setShowFacetList] = useState(false);

  let mock = false;
  const pageable = page!.getContent<Pagination>(component!.getModels().pagination);
  if (!pageable) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const {title, showPagination = true, documentTypes, pageSize} = component!.getParameters();

  const listPaginationContent = getListPaginationContentFromBrxm(pageable);

  let items = pageable.getItems();

  // Check if all items have expected article type
  const findNonArticle = items?.some((item) => {
    const content = page!.getContent<Document>(item);
    if (!content) {
      return true;
    }
    const {contentType} = content.getData();
    return contentType !== documentTypes;
  });

  if (findNonArticle) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return (
        <Status
          container
          error
          status={`Invalid documentTypes parameter. It must be set as ${documentTypes}`}
        />
      );
    }
  }

  const listPaginationParams = {
    template: 'list',
    itemsLabel: 'articles',
  } as ListPaginationParams;

  if (items.length === 0 && page.isPreview()) {
    mock = true;
    items = [{$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}, {$ref: 'mock'}];
  }

  return (
    <Container disableGutters>
      <Sorter {...{
        template,
        title: mock ? 'Mock Article List' : title,
        setTemplate,
        queryType: 'content',
        setShowFacetList,
        options: [],
        pageSize,
        numberOfColumns: 0,
        numberOfItems: 0,
        totalItems: mock ? items.length : pageable.getTotal(),
        hideSorterControls: true,
        hideDiscoveryApiViewer: true,
      }} />
      {showPagination && <ListPagination {...{listPaginationContent, listPaginationParams}} />}
      <Grid container spacing={1} alignItems='stretch' direction='row'>
        {items.map((reference: Reference, key: number) => {
          const itemStyle = key % 5 === 3 || key % 5 === 4 ? 6 : 4;
          switch (template) {
            case 'list':
              return (
                <Grid item xs={12} key={key}>
                  <ArticleComponent {...{page, component}} documentRef={reference} params={{
                    template: 'listitem',
                  }} disableWrapper />
                </Grid>
              );
            default:
              return (
                <Grid item xs={12} lg={itemStyle} md={6} key={key}>
                  <ArticleComponent {...{page, component}} documentRef={reference} params={{
                    template: 'card',
                  }} disableWrapper />
                </Grid>
              );
          }
        })}
      </Grid>
      {showPagination && <ListPagination {...{listPaginationContent, listPaginationParams}} />}
    </Container>
  );
};
