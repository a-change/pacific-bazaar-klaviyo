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
import React, {useRef, useState} from 'react';
import {useTranslation} from 'next-i18next';
//next
import {useRouter} from 'next/router';
import {useSearchParams} from 'next/navigation';
//mui
import {
  Card,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  styled,
  Switch,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//components
import {FlexBox} from '@/components/common/flex-box';
import {ApiViewer} from '@/components/common/api-viewer/ApiViewer';
//types
import {SorterOption, SorterParams} from '@/components/common/sorter/SorterTypes';
//templates
import {SorterGroupBy, SorterTitle, SorterViewSwitcher, SorterWidget} from '@/components/common/sorter/templates';
//Config JSON
const config = require('@/utils/SearchConfig.json');

//Custom styled components
const SorterCard = styled(Card)(({theme}) => ({
  marginTop: '16px',
  marginBottom: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1.25rem',
  [theme.breakpoints.down('md')]: {
    padding: '1rem 1.25rem',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1.25rem 1.25rem 0.25rem',
  },
}));

export const Sorter = (props: SorterParams) => {
  const {
    template,
    options,
    itemsPerRowOptions,
    numberOfColumns,
    pageSize,
    totalItems,
    title,
    subTitle,
    queryType = 'default',
    setTemplate,
    groupBy,
    groupByOptions,
    groupLimit = 4,
    autoCorrectQuery,
    didYouMean,
    query,
    widgetParams,
    hideFacetList = false,
    showFacetList,
    setShowFacetList,
    titleNode,
    hideSorterControls,
    hideDiscoveryApiViewer,
  } = props;

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const {t} = useTranslation('product');
  const widgetView = !!widgetParams?.widget;

  const containerRef = useRef<HTMLElement>(null);

  const [view, setView] = useState(template);
  const [requestResponse, setRequestResponse] = useState(false);

  const [showGridControlBar, setShowGridControlBar] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParameterNames = config.queryParameters[queryType];

  const pageSizeOptions: Array<SorterOption> = itemsPerRowOptions || [1, 2, 3, 4, 5, 6].map((value: number) => ({
    'key': 'size-' + value,
    'text': (value * numberOfColumns).toString(),
    'value': (value * numberOfColumns).toString(),
  }));

  const handleSortChange = (value: string) => {
    const matchedSortBy = options.find((element: SorterOption) => element.value === value);
    const urlSearchParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    if (matchedSortBy?.value) {
      urlSearchParams.set(queryParameterNames.sort, matchedSortBy?.value);
    } else {
      urlSearchParams.delete(queryParameterNames.sort);
    }
    router.push(`${router.pathname}?${urlSearchParams}`);
  };

  const handlePageSizeChange = (value: string) => {
    const parameterName = queryParameterNames.pageSize;
    const urlSearchParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    if (value === '0') {
      urlSearchParams.delete(parameterName);
    } else {
      urlSearchParams.set(parameterName, value);
    }
    // Set pageNumber to 1
    urlSearchParams.set(queryParameterNames.pageNumber, '1');
    router.push(`${router.pathname}?${urlSearchParams}`);
  };

  const selectedSort = router.query[queryParameterNames.sort];
  const selectedPageSize = router.query[queryParameterNames.pageSize] ?? pageSize;

  const showTitleNode = !!titleNode;

  const showRequestResponse = () => {
    setRequestResponse(!requestResponse);
  };

  const RenderGridControlBar = () => (
    <Slide direction={'left'} in={showGridControlBar} container={containerRef.current}>
      <div>
        <FlexBox alignItems='center' my='0.25rem' columnGap={2}>
          {!hideSorterControls && groupByOptions?.length > 0 && <SorterGroupBy {...{
            queryType,
            groupBy,
            groupLimit,
            groupByOptions,
            pageSizeOptions,
          }} />}
          {!hideSorterControls && !widgetView && !groupBy && <FormControl sx={{
            alignItems: 'center',
            my: '0.25rem',
          }} size='small'>
            <InputLabel id={`${queryType}-sort-by-select-label`}>{t('sort-by')}</InputLabel>
            <Select
              labelId={`${queryType}-sort-by-select-label`}
              fullWidth
              label={t('sort-by')}
              defaultValue={selectedSort ?? ''}
              sx={{
                minWidth: '150px',
              }}
              onChange={(e) => handleSortChange(e.target.value as string)}
            >
              {options.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {t(item.text.toLowerCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
          {!hideSorterControls && !widgetView && <FormControl sx={{
            alignItems: 'center',
            my: '0.25rem',
          }} size='small'>
            <InputLabel id={`${queryType}-page-size-select-label`}>{t('page-size')}</InputLabel>
            <Select
              labelId={`${queryType}-page-size-select-label`}
              fullWidth
              label={t('page-size')}
              defaultValue={selectedPageSize}
              sx={{minWidth: '100px'}}
              onChange={(e) => handlePageSizeChange(e.target.value as string)}
            >
              {pageSizeOptions.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
          {!hideSorterControls && !hideFacetList && setShowFacetList &&
            <FlexBox alignItems='center' my='0.25rem'>
              <FormControlLabel
                labelPlacement={'top'}
                control={<Switch color='info' checked={showFacetList} onChange={() => {
                  setShowFacetList(!showFacetList);
                }} size='small' />}
                label={t('show-facets')} />
            </FlexBox>}
          <FlexBox alignItems='center' my='0.25rem'>
            <SorterViewSwitcher
              view={view}
              toggleView={(viewId: string) => {
                setView(viewId);
                setTemplate(viewId);
              }}
              queryType={(queryType !== 'content' && groupBy) ? 'groupBy' : queryType}
            />
            {!hideDiscoveryApiViewer &&
              <Tooltip title='Discovery API Request/Response'>
                <IconButton onClick={showRequestResponse}>
                  <InfoIcon fontSize={'small'} />
                </IconButton>
              </Tooltip>
            }
          </FlexBox>
        </FlexBox>
      </div>
    </Slide>
  );

  return (
    <SorterCard elevation={1}>
      {showTitleNode ? titleNode : <SorterTitle {...{
        totalItems,
        title,
        subTitle,
        autoCorrectQuery,
        didYouMean,
        query,
        widgetView,
      }} />}
      {!downMd && <FlexBox
        alignItems='center'
        columnGap={2}
        flexWrap='wrap'
        my='0.5rem'
      >
        {!hideSorterControls && widgetView && <SorterWidget widgetParams={widgetParams} />}
        {showGridControlBar && <RenderGridControlBar />}
        <FlexBox alignItems='center' my='0.25rem'>
          <Tooltip title='Toggle Grid Control Bar'>
            <IconButton onClick={() => setShowGridControlBar(!showGridControlBar)}>
              <MoreVertIcon fontSize={'small'} />
            </IconButton>
          </Tooltip>
        </FlexBox>
      </FlexBox>}
      <ApiViewer {...{requestResponse, setRequestResponse}} />
    </SorterCard>
  );
};