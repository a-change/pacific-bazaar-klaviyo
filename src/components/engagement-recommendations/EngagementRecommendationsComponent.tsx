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
import React, {Fragment, useContext} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, IconButton, Stack, Tooltip} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import {EngagementRecommendations} from './EngagementRecommendations';
import {H3, Paragraph} from '@/components/common/bazaar/Typography';
import {Status} from '@/components/common/status/Status';
//functions
import {stripePTags} from '@/utils/HtmlUtils';

export const EngagementRecommendationsComponent = (props: BrProps) => {
  const {page, component} = props;
  const {t} = useTranslation('common');
  const {recommendationId, numberOfColumns, size, fillWithRandom, caption, subTitle} = component!.getParameters();

  const {userState: {user}} = useContext(UserContext);
  let name: string = user?.firstName || user?.username! || '';
  let title = caption;
  if (caption) {
    title = name ? title.replaceAll('%s', `${name}!`) : `${t('welcome-back')}!`;
  }

  if (!recommendationId) {
    if (!page.isPreview()) {
      return null;
    } else {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Engagement Recommendations'})} />;
    }
  }

  return (
    <EngagementRecommendations
      recommendationId={recommendationId}
      size={size}
      fillWithRandom={fillWithRandom}
      numberOfColumns={numberOfColumns}
      caption={title}
      subTitle={subTitle}
      titleNode={
        <Box>
          <H3 sx={{
            textTransform: 'capitalize',
          }}>{title} {!subTitle && <Tooltip title={
            <Fragment>
              These recommendations are provided by <strong>Engagement</strong> based on personal browsing behavior
            </Fragment>
          }>
            <IconButton size={'small'}>
              <InfoIcon />
            </IconButton>
          </Tooltip>}</H3>
          {subTitle &&
            <Stack direction={'row'} spacing={2}>
              <Paragraph color='grey.600' dangerouslySetInnerHTML={{
                __html: stripePTags(subTitle),
              }} sx={{
                display: 'flex',
                alignItems: 'center',
              }} />
              <Tooltip title={
                <Fragment>
                  These recommendations are provided by <strong>Engagement</strong> based on personal browsing behavior
                </Fragment>
              }>
                <IconButton size={'small'}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        </Box>
      }
    />
  );
};
