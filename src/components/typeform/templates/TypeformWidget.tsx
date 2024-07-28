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
//other libs
import {Widget} from '@typeform/embed-react';
//types
import {TypeformTemplateProps} from '@/components/typeform/TypeformComponentTypes';

export const TypeformWidget = (props: TypeformTemplateProps) => {
  const {typeformParams: {formId, height}} = props;

  const style = {
    height: `${height || 400}px`,
    width: `100%`,
  };

  //@ts-ignore - this is due to @types/react or @type/react-dom mismatching Typeform,  update Typeform package if deps allow
  return <Widget id={formId} style={style} disableAutoFocus />;
};