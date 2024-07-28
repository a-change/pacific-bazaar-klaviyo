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
import {Card, CardActionArea, Grid, Stack, Typography} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//contexts
import {UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {H2} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {
  GuidedSellingOption,
  GuidedSellingStep,
} from '@/components/guided-selling-flow/GuidedSellingFlowComponentTypes';
import {getSelectedPair} from '@/utils/SelectUtils';

export interface OptionsStepProps {
  guidedSellingStepContent: GuidedSellingStep;
  currStepIndex: number;
  setCurrStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const OptionsStep = (props: OptionsStepProps) => {
  const {guidedSellingStepContent: {paramName, options, text, title}, currStepIndex, setCurrStepIndex} = props;

  const {userSegmentState: {userSegment, setUserSegment}} = useContext(UserContext);
  const {globalSearchParams, setGlobalSearchParams} = useContext(GlobalSearchContext);

  const handleOptionClick = ({paramName, paramValue}: any) => {
    const newParams: any = {};
    const key = getSelectedPair(paramName)?.key ?? paramName;
    newParams[key] = paramValue;

    const updatedParams = {...globalSearchParams, ...newParams};
    setGlobalSearchParams(updatedParams);

    // Set segment in userContext
    if (updatedParams?.segment !== userSegment?.secondary) {
      setUserSegment({secondary: updatedParams?.segment});
    }

    const nextStepIndex = currStepIndex + 1;
    setCurrStepIndex(nextStepIndex);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <FlexBox flexDirection={'column'} justifyContent={'center'} sx={{height: '100%'}}>
          {title && <Typography>{title}</Typography>}
          {text && <H2 dangerouslySetInnerHTML={{__html: text}} />}
        </FlexBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction={'row'} alignItems={'center'} alignContent={'center'}
               sx={{height: '100%'}} spacing={2}>
          {options && options.map((option: GuidedSellingOption, index: number) => (
            option && option.value &&
            <Card sx={{height: 200, width: 200, backgroundColor: 'primary.main'}} key={index}
                  onClick={() => handleOptionClick({paramName, paramValue: option.value})}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  sx={{
                    height: 150,
                    backgroundImage: `url(${option.iconUrl})`,
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'none',
                    backgroundSize: 'contain',
                  }}
                />
                <CardContent>
                  <Typography color='primary.contrastText' sx={{textAlign: 'center'}}>
                    {option.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};