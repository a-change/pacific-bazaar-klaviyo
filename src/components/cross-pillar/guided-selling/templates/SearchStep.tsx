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
import {Avatar, Button, Card, Grid, Stack, styled, Typography} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {H2} from '@/components/common/bazaar/Typography';
import {GuidedSellingContent} from '@/components/cross-pillar/guided-selling/GuidedSellingComponentTypes';
import {SelectedFacets} from '@/components/cross-pillar/guided-selling/templates/SelectedFacets';
//types
import {FacetFieldFilterInput} from '@/hocs/HocTypes';

export interface SearchStepProps {
  guidedSellingContent: GuidedSellingContent;
  setCurrStepIndex: React.Dispatch<React.SetStateAction<number>>;
  facets?: Array<FacetFieldFilterInput>;
  categoryMap?: Record<string, string>;
  itemIndices: Array<number>;
}

const StepAvatar = styled(Avatar)(({theme}) => ({
  backgroundColor: theme.palette.success.main,
  fontWeight: 'bold',
  marginRight: '8px',
  '&.MuiChip-avatar': {
    color: theme.palette.primary.contrastText,
  },
}));

const SearchCard = styled(Card)(({theme}) => ({
  width: 350,
  backgroundColor: theme.palette.secondary.main,
  border: `1px solid ${theme.palette.grey['500']}`,
}));

export const SearchStep = (props: BrProps & SearchStepProps) => {
  const {guidedSellingContent, setCurrStepIndex, facets, categoryMap, itemIndices} = props;
  const {t} = useTranslation('search');

  const {completeLabel} = guidedSellingContent;

  const handleReset = () => {
    setCurrStepIndex(0);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Stack direction={'column'} justifyContent={'center'} sx={{height: '100%'}} spacing={2}>
          {completeLabel && <H2 dangerouslySetInnerHTML={{__html: completeLabel}} />}
          <SelectedFacets facets={facets} categoryMap={categoryMap} />
          <Button size={'medium'} onClick={() => handleReset()} variant='contained'
                  color={'primary'} startIcon={<RestartAltIcon />}
                  sx={{
                    width: 'fit-content',
                  }}
          >{t('start-over')}</Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack direction={'row'} alignItems={'center'} alignContent={'center'}
               sx={{height: '100%'}} spacing={2}>
          {itemIndices?.map((itemIndex, key) => {
            const option = guidedSellingContent?.steps?.[key]?.items?.[itemIndex];
            return (
              option &&
              <SearchCard key={key}>
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
                              sx={{
                                justifyContent: 'center',
                                fontSize: '20px',
                                alignItems: 'center',
                                display: 'flex',
                                fontWeight: 'bold',
                              }}>
                    <StepAvatar>{key + 1}</StepAvatar> {option.title}
                  </Typography>
                </CardContent>
              </SearchCard>
            );
          })}
        </Stack>
      </Grid>
    </Grid>
  );
};