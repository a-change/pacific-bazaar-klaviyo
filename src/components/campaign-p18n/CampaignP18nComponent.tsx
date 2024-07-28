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
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Chip, Stack} from '@mui/material';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {H2} from '@/components/common/bazaar/Typography';

const CampaignP18N = () => {
  const {query} = useRouter();
  const {t} = useTranslation('profile');

  const firstName = query['fn'] || '';
  const loyalty = query['lvl'] as string || 'basic';

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      spacing={2}
    >
      <H2 className='h2'>{t('hello', {name: firstName ? ` ${firstName}` : ``})}</H2>
      {loyalty && (
        <Chip label={t(`${loyalty}-member`)} />
      )}
    </Stack>
  );
};

export const CampaignP18NComponent = withWrapper(CampaignP18N);
