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
//mui
import {Avatar, Card, CardActionArea, Chip, Grid, Stack, styled, Typography} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//components
import {H2} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {
  GuidedSellingItem,
  GuidedSellingStep,
} from '@/components/cross-pillar/guided-selling/GuidedSellingComponentTypes';
import {FacetFieldFilterInput} from '@/hocs/HocTypes';
//templates
import {SelectedFacets} from '@/components/cross-pillar/guided-selling/templates/SelectedFacets';

export interface OptionsStepProps {
  guidedSellingStepContent: GuidedSellingStep;
  currStepIndex: number;
  setCurrStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrItemIndex: React.Dispatch<React.SetStateAction<number>>;
  facets?: Array<FacetFieldFilterInput>;
  categoryMap?: Record<string, string>;
}

const StepAvatar = styled(Avatar)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  fontWeight: 'bold',
  '&.MuiChip-avatar': {
    color: theme.palette.primary.contrastText,
  },
}));

export const OptionCard = styled(Card)(({theme}) => ({
  width: 350,
  backgroundColor: theme.palette.secondary.main,
  border: `1px solid ${theme.palette.grey['500']}`,
  ':hover': {
    transform: 'scale(1.05)',
    transition: '0.5s',
    border: `1px solid`,
  },
}));

export const OptionsStep = (props: OptionsStepProps) => {
  const {
    guidedSellingStepContent: {title, description, items},
    currStepIndex,
    setCurrStepIndex,
    setCurrItemIndex,
    facets,
    categoryMap,
  } = props;

  const handleOptionClick = (index: number) => {
    setCurrItemIndex(index);
    const nextStepIndex = currStepIndex + 1;
    setCurrStepIndex(nextStepIndex);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <FlexBox flexDirection={'column'} justifyContent={'center'} sx={{height: '100%'}}>
          {title && <Chip avatar={<StepAvatar>{currStepIndex + 1}</StepAvatar>} label={title} sx={{
            width: 'fit-content',
            fontWeight: 'bold',
          }} />}
          {description && <H2 dangerouslySetInnerHTML={{__html: description}} />}
          <SelectedFacets facets={facets} categoryMap={categoryMap} />
        </FlexBox>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack direction={'row'} alignItems={'center'} alignContent={'center'}
               sx={{height: '100%'}} spacing={3}>
          {items?.map((option: GuidedSellingItem, index: number) => (
            <OptionCard onClick={() => {
              handleOptionClick(index);
            }} key={index}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  sx={{
                    height: 350,
                    backgroundImage: `url(${option.image})`,
                    backgroundRepeat: 'none',
                    backgroundSize: 'cover',
                  }}
                />
                <CardContent>
                  <Typography color='secondary.contrastText' component={'h1'}
                              sx={{textAlign: 'center', fontSize: '20px', fontWeight: 'bold'}}>
                    {option.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </OptionCard>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};