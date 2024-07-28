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
import React, {useContext} from 'react';
//mui
import {Button, Grid, Typography} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {SearchBoxComponent} from '@/components/search-box/SearchBoxComponent';
import {H2} from '@/components/common/bazaar/Typography';
//templates
import {GuidedSellingStep} from '@/components/guided-selling-flow/GuidedSellingFlowComponentTypes';

export interface SearchStepProps {
  guidedSellingStepContent: GuidedSellingStep;
  setCurrStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const SearchStep = (props: BrProps & SearchStepProps) => {
  const {page, component, guidedSellingStepContent, setCurrStepIndex} = props;

  const {userSegmentState: {userSegment, setUserSegment}} = useContext(UserContext)!;
  const useSearchContext = () => useContext(GlobalSearchContext);
  const {setGlobalSearchParams} = useSearchContext()!;

  if (!guidedSellingStepContent) {
    return null;
  }

  const {text, title} = guidedSellingStepContent;

  const handleReset = () => {
    const resetParams = {view_id: process.env.NEXT_PUBLIC_DEFAULT_VIEW_ID, segment: '', filter: ''};
    setGlobalSearchParams(resetParams);
    // Reset segment
    setUserSegment({secondary: ''});
    setCurrStepIndex(0);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        {title && <Typography>{title}</Typography>}
        {text && <H2 dangerouslySetInnerHTML={{__html: text}} />}
        <Button onClick={() => handleReset()} variant='contained' color={'primary'}>Reset</Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <SearchBoxComponent {...{
          page,
          component,
        }} />
      </Grid>
    </Grid>
  );
};