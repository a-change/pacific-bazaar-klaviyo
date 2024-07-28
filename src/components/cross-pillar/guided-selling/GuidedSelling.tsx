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
import React, {useEffect, useRef, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
//mui
import {Box, Container, Stack, Step, StepConnector, stepConnectorClasses, StepLabel, Stepper} from '@mui/material';
import {styled} from '@mui/system';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
import {Search} from '@/components/search/Search';
//types
import {GuidedSellingTemplateProps} from './GuidedSellingComponentTypes';
import {FacetFieldFilterInput} from '@/hocs/HocTypes';
//functions
import {remoteHtmlTags} from '@/utils/HtmlUtils';
import {QUERY_PARAM_QUERY} from '@/utils/SearchUtil';
//templates
import {OptionsStep} from '@/components/cross-pillar/guided-selling/templates/OptionsStep';
import {SearchStep} from '@/components/cross-pillar/guided-selling/templates/SearchStep';

//Custom styled components
const GuidedSellingStepper = styled(Stepper)(({theme}) => ({
  minWidth: '50%',
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main,
  },
}));

const ColorlibConnector = styled(StepConnector)(({theme}) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.main,
    borderRadius: 1,
  },
}));

const GuidedSellingFlowStepLabel = styled(StepLabel)({
  textTransform: 'capitalize',
});

export const GuidedSellingFlowBase = (props: BrProps & GuidedSellingTemplateProps) => {
  const {query: routerQuery, asPath} = useRouter();
  const {t} = useTranslation('search');

  const {page, component, guidedSellingContent} = props;

  const {query: queryInput, steps} = guidedSellingContent;
  const [currStepIndex, setCurrStepIndex] = useState(0);
  const [currItemIndex, setCurrItemIndex] = useState(0);
  const [itemIndices, setItemIndices] = useState<Array<number>>([]);

  const [facets, setFacets] = useState<Array<FacetFieldFilterInput>>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const scrollToRef = useRef(null);

  useEffect(() => {
    // If `scrollToRef` points to an element, then scroll it into view.
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView();
    }
  }, [currStepIndex]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrStepIndex(0);
  }, [asPath]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currStepIndex === 0) {
      setItemIndices([]);
      setFacets([]);
    } else {
      setFacets(facets.concat(steps?.[currStepIndex - 1].items?.[currItemIndex]?.facets));
      const updateItemIndices = [...itemIndices];
      updateItemIndices[currStepIndex - 1] = currItemIndex;
      setItemIndices(updateItemIndices);
    }
  }, [currStepIndex, currItemIndex]);// eslint-disable-line react-hooks/exhaustive-deps

  let query = queryInput;

  if (routerQuery[QUERY_PARAM_QUERY]) {
    query = routerQuery[QUERY_PARAM_QUERY] as string;
  }

  let searchTitle;
  const queryTitle = query ? ` for ${query}` : '';
  if (currStepIndex === 0) {
    searchTitle = `Search Results${queryTitle}`;
  } else if (currStepIndex === steps.length) {
    searchTitle = `Final Search Results${queryTitle}`;
  } else {
    searchTitle = `Step ${currStepIndex}: Search Results${queryTitle}`;
  }

  return (
    <FlexFullScreen sx={{
      paddingTop: '32px',
      paddingBottom: '32px',
    }}>
      <Container>
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={4}>
          {steps[currStepIndex] ?
            <OptionsStep {...{
              currStepIndex,
              setCurrStepIndex,
              setCurrItemIndex,
              facets,
              categoryMap,
              guidedSellingStepContent: steps[currStepIndex],
            }} />
            :
            <SearchStep {...{
              guidedSellingContent,
              setCurrStepIndex,
              facets,
              categoryMap,
              itemIndices,
              page,
              component,
            }} />}
          <GuidedSellingStepper activeStep={currStepIndex}
                                alternativeLabel
                                connector={<ColorlibConnector />}
                                ref={steps[currStepIndex] ? null : scrollToRef}>
            {steps.map((step, key) => (
              <Step key={key}>
                <GuidedSellingFlowStepLabel>{remoteHtmlTags(step.title)}</GuidedSellingFlowStepLabel>
              </Step>
            ))}
            {/*<Step>
              <GuidedSellingFlowStepLabel>{t('search')}</GuidedSellingFlowStepLabel>
            </Step>*/}
          </GuidedSellingStepper>
          <Box sx={{
            width: '100%',
          }}>
            <Search
              {...{
                query,
                searchContent: {},
                groupByOptions: [],
                facetFieldFilters: facets,
                searchParams: {
                  caption: searchTitle,
                  template: 'default',
                  showCaption: false,
                  showFacets: false,
                  showPagination: false,
                },
                setCategoryMap,
                page,
                component,
              }}
            />
          </Box>
        </Stack>
      </Container>
    </FlexFullScreen>
  );
};

export const GuidedSelling = withWrapper(GuidedSellingFlowBase);
