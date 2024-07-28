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
import React, {useEffect, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Accordion, AccordionDetails, Button, Slider, Tooltip} from '@mui/material';
//bloomreach sdk
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
//components
import FlexBox from '@/components/common/flex-box/FlexBox';
import JustifiedFlexBox from '@/components/common/flex-box/JustifiedFlexBox';
//types
import {QUERY_PARAM_FACET} from '@/utils/SearchUtil';
//functions
import {formattedPrice} from '@/utils/CurrencyUtils';
//templates
import {FacetToggle} from '@/components/common/facet/templates/FacetToggle';

export const FacetPriceRange = (props: any) => {
  const {query, defaultMin, defaultMax, priceMin, priceMax, facetsState, setFacetsState, priceRangeField} = props;
  const {t} = useTranslation('facet', {});

  const router = useRouter();
  // rounding down the min
  let min = Math.floor(priceMin ?? defaultMin);
  // rounding up the max
  let max = Math.ceil(priceMax ?? defaultMax);

  const [value, setValue] = useState<number[]>([min, max]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(() => {
    let min = priceMin ? Math.floor(priceMin) : defaultMin;
    let max = priceMax ? Math.ceil(priceMax) : defaultMax;

    //if (priceRangeState.text !== query) {
    setValue([min, max]);
    //}
  }, [query, priceMin, priceMax]);// eslint-disable-line react-hooks/exhaustive-deps

  const onClick = () => {
    const facetFilterName = QUERY_PARAM_FACET;
    const filterValue = `${priceRangeField}:'[${value[0]} TO ${value[1]}]'`;
    const query = router.query;
    if (!query[facetFilterName]) {
      query[facetFilterName] = filterValue;
      router.push(router);
    } else {
      if (typeof query[facetFilterName] === 'string') {
        const value = query[facetFilterName] as string;
        if (value.startsWith(`${priceRangeField}:`)) {
          if (query[facetFilterName] !== filterValue) {
            query[facetFilterName] = filterValue;
            router.push(router);
          }
        } else {
          query[facetFilterName] = [value, filterValue];
          router.push(router);
        }
      } else {
        const values = query[facetFilterName] as string[];
        const matchIndex = values.findIndex(value1 => value1.startsWith(`${priceRangeField}:`));
        if (matchIndex !== -1) {
          values[matchIndex] = filterValue;
          router.push(router);
        }
      }
    }
  };

  return (
    <Accordion
      defaultExpanded={facetsState[priceRangeField]?.open}
    >
      <FacetToggle
        {...{
          eventKey: '-1',
          facetName: priceRangeField,
          facetsState,
          setFacetsState,
        }}
      />
      <AccordionDetails>
        <JustifiedFlexBox sx={{padding: '8px'}}>
          <Slider
            getAriaLabel={() => 'Price range'}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            valueLabelDisplay='auto'
            getAriaValueText={(value: number) => {
              return formattedPrice(value);
            }}
          />
        </JustifiedFlexBox>
        <FlexBox flexDirection={'row-reverse'}>
          <Tooltip title={t('search-by-price-range')} arrow>
            <Button
              size='small'
              variant='outlined'
              color={'primary'}
              endIcon={<CurrencyExchangeIcon />}
              onClick={(e) => onClick()}>
              {t(`${formattedPrice(value[0])} - ${formattedPrice(value[1])}`)}
            </Button>
          </Tooltip>
        </FlexBox>
      </AccordionDetails>
    </Accordion>
  );
};
