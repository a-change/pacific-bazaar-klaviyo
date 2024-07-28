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
import {useTranslation} from 'next-i18next';
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
//mui
import {Accordion, Card, FormControlLabel, FormGroup, styled, Switch} from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
//components
import {FacetToggle} from '@/components/common/facet/templates';
//functions
import {getCookie, setCookie} from '@/components/helper/discovery/DiscoveryHelperUtils';
import {ALGORITHM_PARAM_NAME} from '@/hocs/HocUtils';

export const SWITCHBOARD_COOKIE_NAME = 'switchboard-session-control';

export interface IntelligenceSwitchboardProps {
}

const IntelligenceSwitchboardCard = styled(Card)(({theme}) => ({
  overflow: 'auto',
}));

//Custom styled components
const SorterFormControlLabel = styled(FormControlLabel)(({theme}) => ({
  margin: '1rem 0',
}));

export const IntelligenceSwitchboard = (props: IntelligenceSwitchboardProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {t} = useTranslation('product');

  const initState = {
    full: false,
    none: false,
    semanticSearch: false,
    performanceRanking: false,
  };

  const loadToggles = () => {
    let switchboardSession = getCookie(SWITCHBOARD_COOKIE_NAME);
    if (switchboardSession !== '') {
      const urlParams = new URLSearchParams(
        searchParams.entries() as unknown as Record<string, string>,
      );

      if (urlParams.has(ALGORITHM_PARAM_NAME)) {
        const updatedState = {...initState};
        updatedState[urlParams.get(ALGORITHM_PARAM_NAME)] = true;
        setState(updatedState);
      }
    } else {
      setCookie(SWITCHBOARD_COOKIE_NAME, 'true', 0.02);
    }
  };

  const onClickSwitch = (item: string) => {
    let updatedState = {...initState};
    updatedState[item] = true;

    // Per Albert's Note
    let algorithm;
    if (updatedState.performanceRanking) {
      algorithm = 'performanceRanking';
    }
    if (updatedState.semanticSearch) {
      algorithm = 'semanticSearch';
    }
    if (updatedState.none) {
      algorithm = 'none';
    }
    if (updatedState.full) {
      algorithm = 'full';
    }

    setState(updatedState);

    const urlParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    urlParams.set(ALGORITHM_PARAM_NAME, algorithm);
    router.push(`${router.pathname}?${urlParams}`);
  };

  useEffect(() => {
    loadToggles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [state, setState] = useState(initState);

  return (
    <IntelligenceSwitchboardCard elevation={1}>
      <Accordion defaultExpanded={searchParams.has(ALGORITHM_PARAM_NAME)}>
        <FacetToggle eventKey={'intelligence-switchboard'} facetName={t('intelligence-switchboard')} nonFacet={true} />
        <AccordionDetails>
          <FormGroup>
            {Object.keys(initState).map((item, key) => (
              <SorterFormControlLabel
                key={key}
                control={<Switch color='info' checked={state[item]} onChange={() => {
                  onClickSwitch(item);
                }} size='small' />}
                label={t(`switchboard-${item}`)} />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </IntelligenceSwitchboardCard>
  );
};