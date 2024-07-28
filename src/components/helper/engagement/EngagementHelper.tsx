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
import React, {useState} from 'react';
//next
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {styled} from '@mui/material/styles';
import {Button, Stack, TextField} from '@mui/material';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import VisibilityIcon from '@mui/icons-material/Visibility';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
//types
import {CAMPAIGN_PARAM_NAME, isSaas, SEGMENT_PARAM_NAME, SEGMENT_SAAS_PARAM_NAME} from '@/utils/SearchUtil';
//components
import {H6} from '@/components/common/bazaar/Typography';

const EngagementHelperLabel = styled(H6)(({theme}) => ({
  textTransform: 'uppercase',
}));

export const EngagementHelper = (props: BrProps) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const {t} = useTranslation('common');

  const [providedCampaign, setProvidedCampaign] = useState('');
  const [providedSegment, setProvidedSegment] = useState('');

  const update = () => {
    const urlSearchParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    const paramName = isSaas() ? SEGMENT_SAAS_PARAM_NAME : SEGMENT_PARAM_NAME;
    urlSearchParams.set(paramName, providedSegment);
    urlSearchParams.set(CAMPAIGN_PARAM_NAME, providedCampaign);
    router.push(`${router.pathname}?${urlSearchParams}`);
  };

  const reset = () => {
    setProvidedSegment('');
    setProvidedCampaign('');

    const urlSearchParams = new URLSearchParams(
      searchParams.entries() as unknown as Record<string, string>,
    );
    const paramName = isSaas() ? SEGMENT_SAAS_PARAM_NAME : SEGMENT_PARAM_NAME;
    urlSearchParams.delete(paramName);
    urlSearchParams.delete(CAMPAIGN_PARAM_NAME);
    router.push(`${router.pathname}?${urlSearchParams}`);
  };

  return (
    <form>
      <Stack spacing={2}>
        <EngagementHelperLabel>Weblayer</EngagementHelperLabel>
        <Button sx={{
          width: 'fit-content',
        }} size={'small'} color={'primary'} variant={'contained'} startIcon={<VisibilityIcon />} onClick={() => {
          ;(window as any)?.exponea?.showWebLayer('5fb2301d0d68192e9f778b3d');
        }}>{t('show-weblayer')}</Button>

        <EngagementHelperLabel>{t('campaign')}</EngagementHelperLabel>

        <TextField
          id='campaign-text-field'
          label={t('campaign')}
          variant='outlined'
          placeholder={t('campaign')}
          fullWidth
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => setProvidedCampaign(event.currentTarget.value)}
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' || event.key === 'NumpadEnter') {
              update();
            }
          }}
        />

        <TextField
          id='segment-text-field'
          label={t('segment')}
          variant='outlined'
          placeholder={t('segment')}
          fullWidth
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => setProvidedSegment(event.currentTarget.value)}
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' || event.key === 'NumpadEnter') {
              update();
            }
          }}
        />

        <Stack direction={'row'} spacing={1}>
          <Button size={'small'} color={'primary'} variant={'contained'} startIcon={<BrowserUpdatedIcon />}
                  onClick={() => {
                    update();
                  }}>{t('update')}</Button>
          <Button size={'small'} color={'primary'} variant={'contained'} startIcon={<ResetTvIcon />} type={'reset'}
                  onClick={() => {
                    reset();
                  }}>{t('reset')}</Button>
        </Stack>
      </Stack>
    </form>
  );
};