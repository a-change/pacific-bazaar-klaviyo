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
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Box, Chip, Stack, styled} from '@mui/material';
//components
import {H3, H5, Paragraph} from '@/components/common/bazaar/Typography';
import {getSearchUrl} from '@/components/auto-suggestion/AutoSuggestionComponentUtils';
import {BrPageContext} from '@bloomreach/react-sdk';
import {stripePTags} from '@/utils/HtmlUtils';

//Component Props
export interface SorterTitleProps {
  totalItems: number;
  title: string;
  subTitle?: string;
  autoCorrectQuery?: string | null;
  didYouMean?: (string | null)[] | null;
  query?: string;
  widgetView?: boolean;
}

//Custom styled components
const SorterH3 = styled(H3)({
  fontWeight: 'bold',
});

export const SorterTitle = (props: SorterTitleProps) => {
  const {
    title,
    subTitle,
    query,
    autoCorrectQuery,
    widgetView,
    totalItems,
    didYouMean,
  } = props;
  const {t} = useTranslation('product');
  const router = useRouter();
  const page = useContext(BrPageContext);

  const RenderTitle = () => {
    if (title) {
      return <SorterH3 dangerouslySetInnerHTML={{__html: title}} />;
    } else {
      if (query) {
        if (autoCorrectQuery) {
          return <SorterH3 dangerouslySetInnerHTML={{
            __html: `${t('results-for', {keyword: autoCorrectQuery})}<br/>${t('instead-of', {keyword: query})}`,
          }} />;
        } else {
          return <SorterH3
            dangerouslySetInnerHTML={{__html: query === '*' ? t('all-products') : t('results-for', {keyword: query})}} />;
        }
      }
    }
  };

  return (
    <Box>
      <RenderTitle />
      {(!widgetView || subTitle) && <Paragraph color='grey.600' dangerouslySetInnerHTML={{
        __html: stripePTags(subTitle) ?? t('n-results-found', {total: totalItems}),
      }} />}
      {didYouMean && didYouMean.length > 0 && <Stack direction='row' spacing={1}>
        <H5>{t('did-you-mean')}:</H5>
        {didYouMean.filter(item => !!item)
          .map((item, key) =>
            <Chip key={key} label={item} size='small' variant='outlined'
                  onClick={() => router.push(page.getUrl(getSearchUrl(item)))} />,
          )}
      </Stack>}
    </Box>
  );
};