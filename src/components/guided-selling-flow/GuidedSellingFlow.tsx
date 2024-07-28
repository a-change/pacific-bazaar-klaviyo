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
//mui
import {
  Container,
  Stack,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
} from '@mui/material';
import {styled} from '@mui/system';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//other libs
//contexts
//hooks
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
//components
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
import {H3} from '@/components/common/bazaar/Typography';
//types
import {GuidedSellingFlowTemplateProps} from './GuidedSellingFlowComponentTypes';
//functions
import {remoteHtmlTags} from '@/utils/HtmlUtils';
//templates
import {OptionsStep} from '@/components/guided-selling-flow/templates/OptionsStep';
import {SearchStep} from '@/components/guided-selling-flow/templates/SearchStep';

//Custom styled components
const ColorlibConnector = styled(StepConnector)(({theme}) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.main,
    borderRadius: 1,
  },
}));

export const GuidedSellingFlowBase = (props: BrProps & GuidedSellingFlowTemplateProps) => {
  const {page, component, guidedSellingFlowContent: {steps, header, footer, imageUrl}} = props;

  const [currStepIndex, setCurrStepIndex] = useState(0);

  return (
    <FlexFullScreen image={imageUrl} sx={{
      paddingTop: '32px',
      paddingBottom: '32px',
    }}>
      <Container>
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={2}>
          {header && <H3 dangerouslySetInnerHTML={{__html: header}} />}
          {steps[currStepIndex] ?
            <OptionsStep currStepIndex={currStepIndex} setCurrStepIndex={setCurrStepIndex}
                         guidedSellingStepContent={steps[currStepIndex]} /> :
            <SearchStep guidedSellingStepContent={steps[currStepIndex - 1]}
                        setCurrStepIndex={setCurrStepIndex} {...{page, component}} />}
          <Stepper activeStep={currStepIndex} alternativeLabel connector={<ColorlibConnector />}>
            {steps.map((step, key) => (
              <Step key={key}>
                <StepLabel>{remoteHtmlTags(step.text)}</StepLabel>
              </Step>
            ))}
            <Step>
              <StepLabel>Search</StepLabel>
            </Step>
          </Stepper>
        </Stack>
      </Container>
    </FlexFullScreen>
  );
};

export const GuidedSellingFlow = withWrapper(withInlineEditing(GuidedSellingFlowBase));
