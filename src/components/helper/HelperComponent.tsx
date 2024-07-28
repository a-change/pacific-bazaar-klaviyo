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
import React, {useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, ClickAwayListener, IconButton, Tooltip} from '@mui/material';
import {Close, Settings} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {AccordionSummaryProps} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
//bloomreach sdk
import {Reference} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//components
import {H4} from '@/components/common/bazaar/Typography';
//templates
import {ThemeHelper} from '@/components/helper/theme/ThemeHelper';
import {EngagementHelper} from '@/components/helper/engagement/EngagementHelper';
import {VisitorHelper} from '@/components/helper/visitor/VisitorHelper';
import {ChannelHelper} from '@/components/helper/channel/ChannelHelper';

//Custom styled components
const MainContainer = styled(Box)(({theme}) => ({
  top: 50,
  right: 50,
  zIndex: 1501,
  position: 'fixed',
  [theme.breakpoints.down('md')]: {display: 'none'},
}));

const StyledIconButton = styled(IconButton)(({theme}) => ({
  right: 50,
  zIndex: 99,
  bottom: 50,
  padding: 12,
  color: '#fff',
  position: 'fixed',
  borderRadius: '50%',
  boxShadow: theme.shadows[12],
  backgroundColor: theme.palette.primary.main,
  ':hover': {backgroundColor: theme.palette.primary.main},
}));

const BodyWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== 'showBody',
})<{showBody: number}>(({theme, showBody}) => ({
  overflow: 'auto',
  borderRadius: '4px',
  backgroundColor: 'white',
  opacity: showBody ? 1 : 0,
  width: showBody ? 500 : 0,
  padding: showBody ? 0 : 0,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.4s',
  maxHeight: showBody ? 'calc(100vh - 100px)' : 0,
  transform: `translateY(${showBody ? 0 : '10px'})`,
}));

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}} />}
    {...props}
  />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const AccordionHeaderTypography = styled(Typography)(({theme}) => ({
  textTransform: 'uppercase',
  fontWeight: 'bold',
}));


export interface HelperComponentProps {
  visitor: Reference;
}

export const HelperComponent = (props: BrProps & HelperComponentProps) => {
  const {page, component, visitor} = props;

  const {t} = useTranslation('common');

  const [showBody, setShowBody] = useState(false);
  const [expanded, setExpanded] = React.useState<string | false>('panel-visitor');

  const locale = page?.getLocale() ?? 'en_US';
  useEffect(() => {
    sessionStorage.setItem('locale', locale);
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <ClickAwayListener onClickAway={() => setShowBody(false)}>
      <MainContainer>
        <Tooltip title={t('pacific-demo-tools')} placement='left'>
          <StyledIconButton onClick={() => setShowBody((state) => !state)}>
            {!showBody && <Settings />}
            {showBody && <Close />}
          </StyledIconButton>
        </Tooltip>

        <BodyWrapper showBody={showBody ? 1 : 0}>
          <H4 textAlign='center' sx={{my: 2, textTransform: 'uppercase'}}>
            {t('pacific-demo-tools')}
          </H4>
          <Accordion expanded={expanded === 'panel-visitor'} onChange={handleChange('panel-visitor')}>
            <AccordionSummary aria-controls='panel-visitord-content' id='panel-visitord-header'>
              <AccordionHeaderTypography>{t('visitor')}</AccordionHeaderTypography>
            </AccordionSummary>
            <AccordionDetails>
              <VisitorHelper {...{page, component, visitor}} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel-theme'} onChange={handleChange('panel-theme')}>
            <AccordionSummary aria-controls='panel-themed-content' id='panel-themed-header'>
              <AccordionHeaderTypography>{t('theme')}</AccordionHeaderTypography>
            </AccordionSummary>
            <AccordionDetails>
              <ThemeHelper {...{page, component}} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel-engagement'} onChange={handleChange('panel-engagement')}>
            <AccordionSummary aria-controls='panel-engagementd-content' id='panel3d-header'>
              <AccordionHeaderTypography>{t('engagement')}</AccordionHeaderTypography>
            </AccordionSummary>
            <AccordionDetails>
              <EngagementHelper {...{page, component}} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel-channel'} onChange={handleChange('panel-channel')}>
            <AccordionSummary aria-controls='panel-channeld-content' id='panel-channeld-header'>
              <AccordionHeaderTypography>{t('channel')}</AccordionHeaderTypography>
            </AccordionSummary>
            <AccordionDetails>
              <ChannelHelper {...{page, component}} />
            </AccordionDetails>
          </Accordion>
        </BodyWrapper>
      </MainContainer>
    </ClickAwayListener>
  );
};