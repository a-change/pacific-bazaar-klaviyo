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
import React, {Fragment, MouseEvent} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {IconButton, Tooltip} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';
//components
import {FacetListState} from '../FacetListTypes';

export interface FacetValuesExpandCollapseButtonProps {
  facetName: string,
  showLess: boolean,
  numOfDisplayedFacetFields: number,
  facetsState: FacetListState,
  setFacetsState: React.Dispatch<React.SetStateAction<FacetListState>>
}

export const FacetValuesExpandCollapseButton = (props: FacetValuesExpandCollapseButtonProps) => {
  const {
    facetName,
    showLess,
    numOfDisplayedFacetFields,
    facetsState,
    setFacetsState,
  } = props;
  const {t} = useTranslation('facet', {});

  const handleMoreOrLessFacetValues = (event: MouseEvent, facetName: string, less: boolean) => {
    const newState = {...facetsState};
    const facetField = newState[facetName];
    let newValueDisplayCount;
    if (less) {
      newValueDisplayCount =
        facetField.shown - numOfDisplayedFacetFields < numOfDisplayedFacetFields
          ? numOfDisplayedFacetFields
          : facetField.shown - numOfDisplayedFacetFields;
    } else {
      newValueDisplayCount =
        facetField.shown + numOfDisplayedFacetFields > facetField.max
          ? facetField.max
          : facetField.shown + numOfDisplayedFacetFields;
    }
    newState[facetName].shown = newValueDisplayCount;
    setFacetsState(newState);
  };

  const handleAllOrLeastFacetValues = (event: MouseEvent, facetName: string, less: boolean) => {
    const newState = {...facetsState};
    const facetField = newState[facetName];
    let newValueDisplayCount;
    if (less) {
      newValueDisplayCount = numOfDisplayedFacetFields;
    } else {
      newValueDisplayCount = Object.entries(facetField.values).length;
    }
    newState[facetName].shown = newValueDisplayCount;
    setFacetsState(newState);
  };

  const facetNameI18n = t(facetName?.toLowerCase());
  const moreOrLessMessage = t(showLess ? 'show-fewer-options' : 'show-more-options', {option: facetNameI18n});
  const mostOrLeastMessage = t(showLess ? 'show-least-options' : 'show-all-options', {option: facetNameI18n});

  return (
    <Fragment>
      <Tooltip title={mostOrLeastMessage}>
        <IconButton size={'small'} onClick={(e) => handleAllOrLeastFacetValues(e, facetName, showLess)}>
          {showLess ? <UnfoldLessDoubleIcon fontSize={'inherit'} /> : <UnfoldMoreDoubleIcon fontSize={'inherit'} />}
        </IconButton>
      </Tooltip>
      <Tooltip title={moreOrLessMessage}>
        <IconButton size={'small'} onClick={(e) => handleMoreOrLessFacetValues(e, facetName, showLess)}>
          {showLess ? <UnfoldLessIcon fontSize={'inherit'} /> : <UnfoldMoreIcon fontSize={'inherit'} />}
        </IconButton>
      </Tooltip>
    </Fragment>

  );
};
