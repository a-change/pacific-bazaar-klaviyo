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
import {usePathname, useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
//components
import FlexBox from '@/components/common/flex-box/FlexBox';
//types
import {BrFacetField} from '@/utils/CommonTypes';
import {QUERY_PARAM_CONTENT_FACET, QUERY_PARAM_FACET} from '@/utils/SearchUtil';
//functions
import {formattedPrice} from '@/utils/CurrencyUtils';

export interface SelectedFacetsProps {
  selectedFacets: Record<string, BrFacetField[]>,
  facets?: Record<string, BrFacetField[]>,
  handleFacetValueClick: Function,
  isContent: boolean
}

export const SelectedFacets = (props: SelectedFacetsProps) => {
  const {
    selectedFacets,
    facets,
    handleFacetValueClick,
    isContent,
  } = props;
  const {t} = useTranslation('facet', {});

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRemoveAllFacetsClick = () => {
    const facetFilterName = isContent ? QUERY_PARAM_CONTENT_FACET : QUERY_PARAM_FACET;
    const queryParameters = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    queryParameters.delete(facetFilterName);
    router.push(`${pathname}?${queryParameters}`, undefined, {scroll: false});
  };

  const keys = Object.keys(selectedFacets);
  const numberOfFilters = keys.reduce((accumulator, currentValue) => accumulator + selectedFacets[currentValue].length, 0);

  const formatFacetLabel = (label: string) => {
    if (label.startsWith('[') && label.endsWith(']')) {
      label = label.substring(1, label.length - 1);
      const numbers = label.split('TO');
      return numbers.map(number => formattedPrice(parseFloat(number.trim()))).join(' - ');
    } else {
      return t(label.toLowerCase());
    }
  };

  if (keys.length === 0) {
    return null;
  }

  return (
    <FlexBox flexWrap='wrap' gap={1} sx={{padding: '4px'}}>
      {keys.map((facetName) => {
        const field = selectedFacets[facetName];
        return field.map((val, index: number) => {
          const facet = facets[facetName];
          // TODO: the lookup needs to be done in selectedFilters
          const facetValue = facet?.find((facetValue) => facetValue?.key === val.key);
          const label = facetValue?.name || val.name || val.key;
          return (
            <Button
              key={index}
              size='small'
              variant='outlined'
              startIcon={<DeleteIcon />}
              title={t(facetName.toLowerCase())}
              onClick={(e) => handleFacetValueClick(e, facetName, val.name)}>
              {formatFacetLabel(label)}
            </Button>
          );
        });
      })}
      {numberOfFilters > 1 && (
        <Button
          size='small'
          variant='outlined'
          color={'primary'}
          startIcon={<DeleteIcon />}
          onClick={(e) => handleRemoveAllFacetsClick()}>
          {t('clear-all-filters')}
        </Button>
      )}
    </FlexBox>
  );
};

