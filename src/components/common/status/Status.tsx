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
//mui
import {Alert, AlertColor, Card, CircularProgress, Container, styled} from '@mui/material';
//components
import {H2} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';

export interface StatusProps {
  customMessage?: string,
  container?: boolean,
  status?: string | null,
  dismissible?: boolean,
  warning?: boolean,
  error?: boolean,
  loading?: boolean,
  onClose?: Function
}

const StatusCard = styled(Card)(({theme}) => ({
  width: '100%',
  marginTop: '16px',
  marginBottom: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1.25rem',
  [theme.breakpoints.down('md')]: {
    padding: '1rem 1.25rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1.25rem 1.25rem 0.25rem',
  },
}));

export const Status = (props: StatusProps) => {
  const [show, setShow] = useState(true);

  let {
    customMessage,
    container,
    status,
    dismissible,
    warning,
    error,
    loading,
    onClose,
  } = props;

  if (!status) {
    return null;
  }

  const WithContainer = ({container, children}: any) => (container ?
      <Container maxWidth={false} disableGutters>
        {children}
      </Container>
      : children
  );

  const dismiss = !!dismissible ? {
    onClose: () => {
      onClose && onClose();
      setShow(false);
    }, dismissible: true,
  } : {};

  if (!show) {
    return null;
  }

  // Figure out variant for alert
  let displayMessage = status;
  let variant = 'success';
  if (warning) {
    variant = 'warning';
  }
  if (error) {
    variant = 'error';
  }

  if (loading) {
    return (
      <WithContainer container={container}>
        <StatusCard elevation={1}>
          <FlexBox alignItems='center'
                   width={'100%'}
                   columnGap={4}
                   flexWrap='wrap'
                   my='0.5rem'>
            <CircularProgress />
            <H2>{displayMessage || customMessage || 'Just one second'}</H2>
          </FlexBox>
        </StatusCard>
      </WithContainer>
    );
  } else {
    return (
      <WithContainer container={container}>
        <StatusCard elevation={1}>
          <Alert severity={variant as AlertColor} {...dismiss} sx={{width: '100%'}}>
            {displayMessage || customMessage}
          </Alert>
        </StatusCard>
      </WithContainer>
    );
  }
};
