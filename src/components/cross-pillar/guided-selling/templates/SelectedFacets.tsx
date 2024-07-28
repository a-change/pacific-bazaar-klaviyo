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
import {useTranslation} from 'next-i18next';
//mui
import {Button, ButtonGroup, styled} from '@mui/material';
//types
import {FacetFieldFilterInput} from '@/hocs/HocTypes';
//components
import FlexBox from '@/components/common/flex-box/FlexBox';

export interface SelectedFacetsProps {
  facets?: Array<FacetFieldFilterInput>;
  categoryMap?: Record<string, string>;
}

const SelectedFacetButtonGroup = styled(ButtonGroup)(({theme}) => ({
  border: `1px solid ${theme.palette.grey['500']}`,
}));

export const SelectedFacets = (props: SelectedFacetsProps) => {
  const {facets, categoryMap} = props;
  const {t} = useTranslation('facet', {});

  return (
    <FlexBox flexWrap='wrap' gap={1} sx={{padding: '4px'}}>
      {facets.map((facet, key) => {
        const {id, values} = facet;
        return values?.map((value, key2) =>
          <SelectedFacetButtonGroup
            variant='contained'
            size='small'
            key={`${key}-${key2}`}
            title={t(id.toLowerCase())}>
            <Button color={'success'}>{t(id)}</Button>
            <Button color={'secondary'}>{categoryMap?.[value] || value}</Button>
          </SelectedFacetButtonGroup>,
        );
      })}
    </FlexBox>
  );
};