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
import React, {useReducer} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Accordion, AccordionDetails, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';
//types
import {QUERY_PARAM_PRECISION_MODE} from '@/utils/SearchUtil';
//components
import {FacetToggle} from '@/components/common/facet/templates/FacetToggle';

export const FacetPrecisionMode = (props: any) => {
  const {query, facetsState, setFacetsState, precisionMode, precisionModeField} = props;
  const {t} = useTranslation('facet', {});

  const router = useRouter();

  const [precisionModeState, setPrecisionModeState] = useReducer((state: any, newState: any) => {
    return {...state, ...newState};
  }, {
    precisionMode,
    text: query,
  });

  return (
    <Accordion
      defaultExpanded={facetsState[precisionModeField]?.open}
    >
      <FacetToggle
        {...{
          eventKey: '-2',
          facetName: precisionModeField,
          facetsState,
          setFacetsState,
        }}
      />
      <AccordionDetails>
        <FormControl>
          <RadioGroup
            row
            name='precision-mode-radio-buttons-group'
            defaultValue={precisionMode}
          >
            {['standard', 'high'].map((value, index) => (
              <FormControlLabel
                value={value} control={<Radio />}
                label={t(value)}
                key={index}
                onChange={() => {
                  setPrecisionModeState({precisionMode: value});
                  const query = router.query;
                  query[QUERY_PARAM_PRECISION_MODE] = value;
                  router.push(router);
                }} />
            ))}
          </RadioGroup>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};
