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
import {useTranslation} from 'next-i18next';
//mui
import {List, ListItem} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//components
import {H4} from '@/components/common/bazaar/Typography';
//types
import {BrArticle} from '@/utils/CommonTypes';
//functions
import {getArticleContent} from '@/components/common/article-grid/ArticleGridUtils';
//templates
import {ArticleSuggested} from '@/components/article/templates/ArticleSuggested';

export interface SuggestedArticlesProps {
  articles: Array<BrArticle> | undefined;
}

export const SuggestedArticles = (props: SuggestedArticlesProps) => {
  const {
    articles,
  } = props;

  const page = useContext(BrPageContext);
  const {t} = useTranslation('facet', {});

  const hasProducts = articles && articles.length > 0;
  if (!hasProducts) {
    return null;
  }
  return (
    <List>
      <ListItem>
        <H4 sx={{fontWeight: 'bold'}}>{t('content')}</H4>
      </ListItem>
      {articles?.map((article, key: number) => {
        return (
          <ListItem key={key}>
            <ArticleSuggested articleContent={getArticleContent(article, page)}
                              articleParams={{template: 'suggested'}} />
          </ListItem>
        );
      })}
    </List>
  );
};
