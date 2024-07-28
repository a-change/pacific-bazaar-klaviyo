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
import React, {MouseEvent} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {ButtonGroup, IconButton, Tooltip} from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import MobiledataOffIcon from '@mui/icons-material/MobiledataOff';
//types
import {FacetListState, FacetSortingType} from '../FacetListTypes';

export interface FacetValuesSortingButtonProps {
  facet: string,
  facetsState: FacetListState,
  setFacetsState: React.Dispatch<React.SetStateAction<FacetListState>>
}

export const FacetValuesSortingButton = (props: FacetValuesSortingButtonProps) => {
  const {
    facet,
    facetsState,
    setFacetsState,
  } = props;
  const {t} = useTranslation('facet', {});

  const handleSortFaceValues = (event: MouseEvent, facetName: string, value: FacetSortingType) => {
    const newState = {...facetsState};
    newState[facetName].sorting = value;
    setFacetsState(newState);
  };

  const sorting = facetsState[facet]?.sorting;

  return (
    <ButtonGroup>
      {sorting !== 'descending' && <Tooltip title={t('Name (Z - A)')}>
        <IconButton size={'small'} onClick={(e) => handleSortFaceValues(e, facet.toLowerCase(), 'descending')}>
          <SouthIcon fontSize={'inherit'} />
        </IconButton>
      </Tooltip>}
      {sorting !== 'ascending' && <Tooltip title={t('Name (A - Z)')}>
        <IconButton size={'small'} onClick={(e) => handleSortFaceValues(e, facet.toLowerCase(), 'ascending')}>
          <NorthIcon fontSize={'inherit'} />
        </IconButton>
      </Tooltip>}
      {sorting !== 'none' && <Tooltip title={t('no-sorting')}>
        <IconButton size={'small'} onClick={(e) => handleSortFaceValues(e, facet.toLowerCase(), 'none')}>
          <MobiledataOffIcon fontSize={'inherit'} />
        </IconButton>
      </Tooltip>}
    </ButtonGroup>
  );
};
