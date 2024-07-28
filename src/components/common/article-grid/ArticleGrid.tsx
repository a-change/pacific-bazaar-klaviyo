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
import React, {useContext, useEffect, useState} from 'react';
//mui
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box, Grid} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//components
import {ArticleCard} from '@/components/article/templates/ArticleCard';
import {ListPagination} from '@/components/common/list-pagination/ListPagination';
import {FacetList} from '@/components/common/facet/FacetList';
import {Sorter} from '@/components/common/sorter/Sorter';
import {ArticleListItem} from '@/components/article/templates';
//types
import {BrArticle} from '@/utils/CommonTypes';
import {ArticleGridTemplateProps} from '@/components/common/article-grid/ArticleGridTypes';
//functions
import {getListPaginationContent} from '@/components/common/list-pagination/ListPaginationUtils';
import {getArticleContent} from '@/components/common/article-grid/ArticleGridUtils';

const config = require('./ArticleGridConfig.json');

export const ArticleGrid = (props: ArticleGridTemplateProps) => {
  const {
    articleGridParams: {
      numberOfColumns = 2,
      pageSize = 12,
      showFacets = true,
      facetsLocation,
      showPagination = true,
      query,
      title,
    },
    articleGridContent: {facet_counts: {facet_fields: facetFields}, response, stats},
  } = props;

  const page = useContext(BrPageContext);
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const {docs: articles, numFound: numberOfArticles, start} = response;
  const gridSize = 12 / numberOfColumns;

  const [showFacetList, setShowFacetList] = useState(showFacets);

  const [template, setTemplate] = useState('grid');

  useEffect(() => {
    if (showFacetList !== showFacets) {
      setShowFacetList(showFacets);
    }
  }, [showFacets]); // eslint-disable-line react-hooks/exhaustive-deps

  const listPaginationContent = getListPaginationContent({
    offset: start,
    limit: pageSize,
    total: numberOfArticles,
    params: {
      queryType: 'content',
      showPagination: true,
    },
  });

  const RenderListPagination = () => (
    showPagination && <ListPagination listPaginationContent={listPaginationContent} listPaginationParams={{
      template: 'list',
      itemsLabel: 'articles',
    }} />
  );

  const md = showFacetList ? 8 : 12;
  const lg = showFacetList ? 9 : 12;

  let facetConfig = config.facet;

  const facetsOnRight = facetsLocation === 'right';

  const numberOfItems = (articles?.length) || 0;

  return (
    <Box>
      <Sorter {...{
        template,
        options: config.sorting,
        numberOfColumns: numberOfColumns,
        numberOfItems,
        pageSize,
        totalItems: numberOfArticles,
        query,
        title,
        setTemplate,
        queryType: 'content',
        showFacetList,
        setShowFacetList,
      }} />
      <RenderListPagination />
      <Grid container spacing={1}>
        {showFacetList && !facetsOnRight && (
          <Grid item sm md={4} lg={3}>
            <FacetList {...{
              facetFields,
              config: facetConfig,
              isContent: true,
            }} />
          </Grid>
        )}
        <Grid item md={md} lg={lg}>
          <Grid container spacing={1}>
            {articles.map((article: BrArticle, key) => {
              switch (template) {
                case 'list':
                  return (
                    <Grid item xs={12} key={key}>
                      <ArticleListItem articleContent={getArticleContent(article, page)}
                                       articleParams={{template: 'listitem'}} />
                    </Grid>
                  );
                default:
                  return (
                    <Grid item lg={gridSize} md={6} xs={12} key={key}>
                      <ArticleCard articleContent={getArticleContent(article, page)}
                                   articleParams={{template: 'card'}} />
                    </Grid>
                  );
              }
            })}
          </Grid>
        </Grid>
        {showFacetList && facetsOnRight && (
          <Grid item sm md={4} xl={3}>
            <FacetList {...{
              facetFields,
              config: facetConfig,
              isContent: true,
            }} />
          </Grid>
        )}
      </Grid>

      <RenderListPagination />
    </Box>
  );
};
