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
import React, {Fragment} from 'react';
import {useTranslation} from 'next-i18next';
//next
import {useRouter} from 'next/router';
import {useSearchParams} from 'next/navigation';
//mui
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
//components
import {FlexBox} from '@/components/common/flex-box';
//types
import {SorterOption} from '@/components/common/sorter/SorterTypes';
//Config JSON
import config from '@/utils/SearchConfig.json';

//Component Props
export interface SorterGroupByProps {
  queryType?: string;
  groupBy?: string;
  groupByOptions?: Array<SorterOption>;
  groupLimit?: number;
  pageSizeOptions?: Array<SorterOption>;
}

export const SorterGroupBy = (props: SorterGroupByProps) => {
  const {groupBy, groupByOptions, groupLimit, pageSizeOptions, queryType} = props;

  const {t} = useTranslation('product');
  const router = useRouter();

  const searchParams = useSearchParams();
  const queryParameterNames = config.queryParameters[queryType];

  const handleGroupLimitChange = (value: string) => {
    const parameterName = queryParameterNames.groupLimit;
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

  const handleGroupByChange = (groupBy: string) => {
    const parameterName = queryParameterNames.groupBy;
    const urlSearchParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    if (!groupBy) {
      urlSearchParams.delete(parameterName);
    } else {
      urlSearchParams.set(parameterName, groupBy);
    }
    urlSearchParams.set(queryParameterNames.pageNumber, '1');
    router.push(`${router.pathname}?${urlSearchParams}`);
  };

  return (
    <Fragment>
      {groupByOptions.length > 0 && <FlexBox alignItems='center' my='0.25rem'><FormControl sx={{
        alignItems: 'center',
        my: '0.25rem',
      }} size='small'>
        <InputLabel id={`group-by-select-label`}>{t('group-by')}</InputLabel>
        <Select
          labelId={`group-by-select-label`}
          fullWidth
          label={t('group-by')}
          defaultValue={groupBy ?? ''}
          displayEmpty
          sx={{minWidth: '100px'}}
          onChange={(e) => handleGroupByChange(e.target.value as string)}
        >
          <MenuItem value='none'>{t('none')}</MenuItem>
          {groupByOptions?.map((item) => (
            <MenuItem value={item.key} key={item.text}>
              {t(item.text.toLowerCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </FlexBox>}
      {groupBy && <FlexBox alignItems='center' my='0.25rem'><FormControl sx={{
        alignItems: 'center',
        my: '0.25rem',
      }} size='small'>
        <InputLabel id={`group-limit-select-label`}>{t('group-limit')}</InputLabel>
        <Select
          labelId={`group-limit-select-label`}
          fullWidth
          label={t('group-limit')}
          defaultValue={groupLimit}
          sx={{minWidth: '100px'}}
          onChange={(e) => handleGroupLimitChange(e.target.value as string)}
        >
          {pageSizeOptions.map((item) => (
            <MenuItem value={item.value} key={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </FlexBox>}
    </Fragment>
  );
};