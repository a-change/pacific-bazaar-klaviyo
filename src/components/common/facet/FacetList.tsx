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
import React, {ChangeEvent, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {usePathname, useSearchParams} from 'next/navigation';
//mui
import {
  Accordion,
  AccordionDetails,
  Box,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
  styled,
} from '@mui/material';
//components
import FlexBetween from '@/components/common/flex-box/FlexBetween';
import FlexBox from '@/components/common/flex-box/FlexBox';
//types
import {FacetListState} from './FacetListTypes';
import {BrFacet, BrFacetField} from '@/utils/CommonTypes';
import {PriceRange} from '@/hocs/HocTypes';
import {PrecisionModeType} from '@/components/product/ProductComponentTypes';
import {QUERY_PARAM_CONTENT_FACET, QUERY_PARAM_FACET, QUERY_PARAM_PRECISION_MODE} from '@/utils/SearchUtil';
import {DEFAULT_STATS_FIELD} from '@/hocs/HocUtils';
//functions
import {getFacetsState, getFilteredFacets, getFilteredFacetsV2, getSelectedFacets} from './FacetListUtils';
//templates
import {
  FacetCategoryBreadcrumb,
  FacetPrecisionMode,
  FacetPriceRange,
  FacetRatingLabel,
  FacetToggle,
  FacetValuesExpandCollapseButton,
  FacetValuesSortingButton,
  SelectedFacets,
} from './templates';

//Component Props
export interface FacetListComponentProps {
  facetFields?: Record<string, BrFacetField[]>;
  facets?: BrFacet[];
  isContent?: boolean;
  priceRange?: PriceRange;
  enablePriceRange?: boolean;
  precisionMode?: PrecisionModeType;
  enablePrecisionMode?: boolean;
  config: {
    excluded: Array<string>
    numOfDisplayedFacetItems: number
    numOfOpenedFacets: number
  };
}

//Custom styled components
const FacetFormControlLabel = styled(FormControlLabel)(({theme}) => ({
  '& .MuiFormControlLabel-label': {
    width: '100%',
  },
}));

export const FacetList = (props: FacetListComponentProps) => {
  const {
    facets,
    facetFields,
    isContent = false,
    priceRange,
    enablePriceRange = false,
    precisionMode = '',
    enablePrecisionMode = false,
    config: {excluded = [], numOfDisplayedFacetItems = 5, numOfOpenedFacets = 1},
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {t} = useTranslation('facet');

  const priceRangeField = DEFAULT_STATS_FIELD;
  const precisionModeField = QUERY_PARAM_PRECISION_MODE;

  const filteredFacets = facetFields ? getFilteredFacets(facetFields, excluded) : getFilteredFacetsV2(facets, excluded);
  const selectedFacets: Record<string, BrFacetField[]> = getSelectedFacets(router.query, isContent);

  const [facetsState, setFacetsState] = useState<FacetListState>(
    getFacetsState(filteredFacets, selectedFacets, numOfDisplayedFacetItems, numOfOpenedFacets, enablePriceRange, priceRangeField, enablePrecisionMode, precisionModeField),
  );

  const handleFacetValueClick = (
    event: ChangeEvent<HTMLInputElement>,
    facet: string,
    value: string,
  ) => {
    const facetFilterName = isContent ? QUERY_PARAM_CONTENT_FACET : QUERY_PARAM_FACET;
    const updatedFacets: Record<string, BrFacetField[]> = JSON.parse(JSON.stringify(selectedFacets));
    const clickedFacet = updatedFacets[facet];
    const newState = {...facetsState};
    const filterValue = {
      name: value,
      count: 0,
    };
    if (event.target.checked) {
      //add
      if (!clickedFacet) {
        updatedFacets[facet] = [filterValue];
      } else {
        clickedFacet.push(filterValue);
      }
      newState[facet].values[value] = true;
    } else {
      //remove
      if (clickedFacet) {
        updatedFacets[facet] = clickedFacet.filter((entry) => entry?.name !== value);
        if (updatedFacets[facet].length == 0) {
          delete updatedFacets[facet];
        }
      }
      newState[facet].values[value] = false;
    }

    setFacetsState(newState);
    // console.log(searchParams.entries());
    const queryParameters = new URLSearchParams(searchParams.entries() as unknown as Record<string, string>);
    // console.log(queryParameters);
    const categoryElement = `${facet}:'${value}'`;
    let pageQueryParam = 0;
    queryParameters.forEach((value, key) => {
      if (key === 'page' || key.endsWith(':page')) {
        queryParameters.set(key, '1');
        pageQueryParam++;
      }
    });
    if (pageQueryParam === 0) queryParameters.append('page', '1');

    let categoryParameters = queryParameters.getAll(facetFilterName);
    if (event.target.checked) {
      // add
      if (queryParameters.has(facetFilterName)) {
        if (!categoryParameters.includes(categoryElement)) {
          queryParameters.append(facetFilterName, categoryElement);
        }
      } else {
        queryParameters.set(facetFilterName, categoryElement);
      }
    } else {
      // remove
      if (queryParameters.has(facetFilterName)) {
        const index = categoryParameters.indexOf(categoryElement);
        if (index > -1) {
          categoryParameters.splice(index, 1);
          queryParameters.delete(facetFilterName);
          categoryParameters.forEach(categoryParameter => {
            queryParameters.append(facetFilterName, categoryParameter);
          });
        }
      }
    }
    router.push(`${pathname}?${queryParameters}`, undefined, {scroll: false});
  };

  const RenderFacetLabel = ({facetName, facetLabel}) => {
    if (facetName === 'rating') {
      return <FacetRatingLabel facetLabel={facetLabel} />;
    } else {
      return <Box sx={{
        textTransform: 'capitalize',
      }}>{t(facetLabel)}</Box>;
    }
  };

  const showFacets = Object.keys(filteredFacets).length > 0;
  return (
    <Card sx={{overflow: 'auto'}} elevation={1}>
      <SelectedFacets
        {...{
          selectedFacets,
          facets: filteredFacets,
          handleFacetValueClick,
          isContent,
        }}
      />
      {showFacets && enablePrecisionMode && <FacetPrecisionMode {...{
        query: '',
        precisionMode,
        facetsState,
        setFacetsState,
        precisionModeField,
      }} />}
      {showFacets && enablePriceRange && <FacetPriceRange {...{
        query: '',
        defaultMin: 1,
        defaultMax: 100,
        priceMin: priceRange?.priceMin,
        priceMax: priceRange?.priceMax,
        facetsState,
        setFacetsState,
        priceRangeField,
      }} />}
      {Object.keys(filteredFacets).map((key, index: number) => {
        const facet = filteredFacets[key];
        if (!facet) {
          return null;
        }
        const eventKey = index.toString();
        const facetName = key;
        const facetSoring = facetsState[facetName]?.sorting !== 'none';
        const descending = facetsState[facetName]?.sorting === 'descending';
        const sortedFacet = facetSoring ? (JSON.parse(JSON.stringify(facet)))?.sort((facetValueA: BrFacetField, facetValueB: BrFacetField) => {
          const nameA = facetValueA?.name?.toLowerCase();
          const nameB = facetValueB?.name?.toLowerCase();
          if (nameA < nameB) {
            return descending ? 1 : -1;
          }
          if (nameA > nameB) {
            return descending ? -1 : 1;
          }
          return 0;
        }) : facet;

        return (
          <Accordion
            key={index}
            defaultExpanded={facetsState[facetName]?.open}
          >
            <FacetToggle
              {...{
                eventKey,
                facetName,
                facetsState,
                setFacetsState,
              }}
            />
            <AccordionDetails>
              <Box>
                <FormGroup>
                  {sortedFacet?.map(
                    (facetValue, valueKey: number) =>
                      facetsState[facetName]?.shown > valueKey && (
                        <FacetFormControlLabel
                          control={
                            <Checkbox
                              checked={!!facetsState?.[facetName]?.values[facetValue.key]}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFacetValueClick(e, facetName, facetValue?.key)
                              }
                            />
                          }
                          label={
                            <FlexBetween>
                              <Stack direction={'column'}>
                                {facetValue?.cat_id ?
                                  <FacetCategoryBreadcrumb facets={facets} facetFields={facetFields}
                                                           catId={facetValue?.cat_id} facetLabel={facetValue?.name} />
                                  :
                                  <RenderFacetLabel facetName={facetName} facetLabel={facetValue?.name} />
                                }
                              </Stack>
                              <Chip label={`${facetValue?.count}`} />
                            </FlexBetween>
                          }
                          key={valueKey}
                        />
                      ),
                  )}
                </FormGroup>
                <FlexBox flexDirection={'row-reverse'}>
                  {facet.length > 1 && (
                    <FacetValuesSortingButton
                      facet={key}
                      facetsState={facetsState}
                      setFacetsState={setFacetsState}
                    />
                  )}
                  {facet.length > numOfDisplayedFacetItems && (
                    <div className='m-1 ml-2 pt-1'>
                      {facetsState[facetName]?.shown > numOfDisplayedFacetItems && (
                        <FacetValuesExpandCollapseButton
                          facetName={facetName}
                          showLess={true}
                          facetsState={facetsState}
                          setFacetsState={setFacetsState}
                          numOfDisplayedFacetFields={numOfDisplayedFacetItems}
                        />
                      )}
                      {facetsState[facetName]?.shown < facetsState[facetName]?.max && (
                        <FacetValuesExpandCollapseButton
                          facetName={facetName}
                          showLess={false}
                          facetsState={facetsState}
                          setFacetsState={setFacetsState}
                          numOfDisplayedFacetFields={numOfDisplayedFacetItems}
                        />
                      )}
                    </div>
                  )}
                </FlexBox>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Card>
  );
};
