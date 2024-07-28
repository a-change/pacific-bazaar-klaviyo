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
import {Container, Grid, styled} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {initializeSegmentation} from '@bloomreach/segmentation';
//other libs
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//types
import {FormCrossPillarComponentCustomProps, FormCrossPillarTemplateProps} from './FormCrossPillarComponentTypes';

//Custom styled components
const FormContainer = styled(Container)({
  '& button': {
    marginTop: '8px',
  },
});

function FormCrossPillarBase(props: BrProps & FormCrossPillarComponentCustomProps & FormCrossPillarTemplateProps) {
  const {page, component, formCrossPillarContent: {form, submit, event}, formCrossPillarParams} = props;

  const channelProps = page.getChannelParameters() ?? {};
  const segmentationConfigs = {
    projectToken: channelProps.exponeaProjectToken,
    targetURL: channelProps.exponeaApiTarget,
    cacheMaxTime: 0,
  };

  let jsonForm;
  try {
    jsonForm = JSON.parse(form);
  } catch (e: any) {
    console.warn('Error parsing through the JSON schema, setting empty', form);
    jsonForm = {jsonSchema: {}, uischema: {}};
  }

  const schema = jsonForm.jsonSchema ?? {};
  const uischema = jsonForm.uiSchema ?? {};

  uischema['ui:submitButtonOptions'] = {
    'submitText': submit,
  };

  switch (formCrossPillarParams.template) {
    default:
      return (
        <FormContainer>
          <Grid container>
            <Grid item xs={12}>
              <Form
                idPrefix={component.getName()}
                validator={validator}
                schema={schema}
                uiSchema={uischema}
                onSubmit={(submissionData) => {
                  // @ts-ignore
                  exponea.track(event, submissionData.formData, (e: any) => {
                    setInterval(() => {
                      initializeSegmentation(segmentationConfigs).then(() => {
                        console.log('refresh segments after form sent');
                      });
                    }, 2000);
                  }, () => console.log('not succeeded to send form'));
                }}
              />
            </Grid>
          </Grid>
        </FormContainer>
      );
  }
}

export const FormCrossPillar = withWrapper(FormCrossPillarBase);
