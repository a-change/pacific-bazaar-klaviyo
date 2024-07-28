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
import {AccordionSummary, styled} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//components
import {H6} from '@/components/common/bazaar/Typography';

export interface FacetToggleProps {
  eventKey: string,
  facetName: string,
  nonFacet?: boolean,
}

export interface NonFacetProps {
  nonFacet?: boolean,
}

const FacetToggleAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) =>
    prop !== 'nonFacet',
})<NonFacetProps>(({theme, nonFacet}) => {
  return nonFacet && {
    backgroundColor: theme.palette.warning.main,
  };
});


export const FacetToggle = (props: FacetToggleProps) => {
  const {
    eventKey,
    facetName,
    nonFacet,
  } = props;
  const {t} = useTranslation('facet', {});
  return (
    <FacetToggleAccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={facetName}
      id={eventKey}
      nonFacet={nonFacet}
    >
      <H6 sx={{textTransform: 'uppercase'}}>{t(facetName?.toLowerCase())}</H6>
    </FacetToggleAccordionSummary>
  );
};
