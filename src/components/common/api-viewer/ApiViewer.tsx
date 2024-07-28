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
import React, {useContext, useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, Button, Modal, styled, Typography} from '@mui/material';
//bloomreach sdk
import {BrComponentContext} from '@bloomreach/react-sdk';
//other libs
import {JsonViewer} from '@textea/json-viewer';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import {Accordion, AccordionDetails, AccordionSummary} from '@/components/helper/HelperComponent';
import {H4} from '@/components/common/bazaar/Typography';

//Custom styled components
const RequestResponseBox = styled(Box)(({theme}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '800px',
  backgroundColor: theme.palette.background.paper,
  border: '2px solid ${theme.palette.grey[400]}',
  boxShadow: '24px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

interface ApiViewerProps {
  requestResponse: boolean,
  setRequestResponse: React.Dispatch<React.SetStateAction<boolean>>
}

export const ApiViewer = (props: ApiViewerProps) => {
  const {requestResponse, setRequestResponse} = props;

  const {t} = useTranslation('search');

  const component = useContext(BrComponentContext);
  const componentId = component.getId();

  const [expanded, setExpanded] = useState<string | false>('panel-request');
  const [apiKey, setApiKey] = useState(null);

  const {discoveryApiCallsState: {discoveryApiCalls}} = useContext(UserContext);
  const componentDiscoveryApiCalls = discoveryApiCalls?.[componentId] ?? {};
  const apiKeys = Object.keys(componentDiscoveryApiCalls).sort().reverse();

  useEffect(() => {
    if (apiKeys?.indexOf(apiKey) === -1) {
      setApiKey(apiKeys?.[0]);
    }
  }, [apiKey, apiKeys]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const {endpoint, params, response} = componentDiscoveryApiCalls?.[apiKey] ?? {};

  let searchParams = {};
  if (params instanceof URLSearchParams) {
    const urlSearchParams = params as URLSearchParams;
    for (const key of urlSearchParams.keys()) {
      searchParams[key] = urlSearchParams.getAll(key).length > 1 ? urlSearchParams.getAll(key) : urlSearchParams.get(key);
    }
  }

  return (
    <Modal
      open={requestResponse}
      onClose={() => setRequestResponse(false)}
    >
      <RequestResponseBox>
        <H4 textAlign='center' sx={{my: 2}}>
          {t('discovery-api-request-response')} {apiKeys.map((apiKeyItem, key) =>
          <Button
            size={'small'}
            variant={'contained'}
            color={apiKeyItem === apiKey ? 'warning' : 'primary'}
            onClick={() => setApiKey(apiKeyItem)}
            sx={{
              marginRight: '2px',
            }}
            key={key}>
            {t(apiKeyItem)}
          </Button>,
        )}
        </H4>
        <Accordion expanded={expanded === 'panel-request'} onChange={handleChange('panel-request')}>
          <AccordionSummary aria-controls='panel-requestd-content' id='panel-requestd-header'>
            <Typography>{t('request')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='button' display='block' gutterBottom>
              {t('endpoint')}
            </Typography>
            <Typography variant='body1' gutterBottom>{endpoint}</Typography>
            <Typography variant='button' display='block' gutterBottom marginTop={'24px'}>
              {t('search-parameters')}
            </Typography>
            <JsonViewer value={searchParams} />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel-response'} onChange={handleChange('panel-response')}>
          <AccordionSummary aria-controls='panel-responsed-content' id='panel-responsed-header'>
            <Typography>{t('response')}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{
            maxHeight: '50vh',
            overflow: 'auto',
          }}>
            <JsonViewer value={response} />
          </AccordionDetails>
        </Accordion>
      </RequestResponseBox>
    </Modal>
  );
};