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
import {usePathname, useSearchParams} from 'next/navigation';
import {useTranslation} from 'next-i18next';
//mui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CategoryIcon from '@mui/icons-material/Category';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import {Box, Chip, Container} from '@mui/material';
//components
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
import {ArticleGrid} from '@/components/common/article-grid/ArticleGrid';
//types
import {SearchTemplateProps} from '@/components/search/SearchComponentTypes';
import {QUERY_PARAM_ACTIVE_TAB} from '@/utils/SearchUtil';
import {ProductGroups} from '@/components/common/product-groups/ProductGroups';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const SearchTab = (props: SearchTemplateProps) => {
  const {
    searchContent: {products, articles, productGroups},
    searchParams: {showContent},
  } = props;
  const {t} = useTranslation('product');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlSearchParams = new URLSearchParams(
    searchParams.entries() as unknown as Record<string, string>,
  );
  const [value, setValue] = useState(urlSearchParams.get(QUERY_PARAM_ACTIVE_TAB) === 'article' ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    //setValue(newValue);
    urlSearchParams.set(QUERY_PARAM_ACTIVE_TAB, newValue === 1 ? 'article' : 'product');
    router.push(`${pathname}?${urlSearchParams}`);
  };

  const {productGroupsParams: {groupBy}} = productGroups;

  const numberOfProducts = products?.productGridContent?.response?.numFound ?? productGroups?.productGroupsContent?.group_response?.[groupBy]?.matches ?? 0;
  const numberOfArticles = articles?.articleGridContent?.response?.numFound ?? 0;

  const renderProducts = () => {
    if (groupBy) {
      return (
        <ProductGroups {...productGroups} />
      );
    } else {
      return <ProductGrid {...products} />;
    }
  };


  if (!showContent) {
    return renderProducts();
  }

  return (
    <Container disableGutters>
      <FlexRowCenter sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab
            sx={{minWidth: '20vw'}}
            icon={<CategoryIcon />}
            iconPosition='start'
            label={
              <Box>
                {t('products')} <Chip label={numberOfProducts} />
              </Box>
            }
            id='product-results-tab'
            aria-controls='product-results-tabpanel'
          />
          <Tab
            sx={{minWidth: '20vw'}}
            icon={<NewspaperIcon />}
            iconPosition='start'
            label={
              <Box>
                {t('articles')} <Chip label={numberOfArticles} />
              </Box>
            }
            id='article-results-tab'
            aria-controls='article-results-tabpanel'
          />
        </Tabs>
      </FlexRowCenter>
      <TabPanel value={value} index={0}>
        {renderProducts()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ArticleGrid {...articles} />
      </TabPanel>
    </Container>
  );
};
