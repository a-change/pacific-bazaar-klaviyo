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

import {Reference} from '@bloomreach/spa-sdk';

type GuidedSellingOption = {
  iconUrl: string,
  label: string,
  value: string
};

type GuidedSellingStep = {
  title: string,
  text: string,
  paramName: string,
  options: Array<GuidedSellingOption>,
};

type GuidedSellingFlowContent = {
  header?: string,
  footer?: string,
  imageUrl?: string,
  steps: Array<GuidedSellingStep>
};

type GuidedSellingFlowTemplate =
  | 'default';

type GuidedSellingFlowComponentParams = {
  template: GuidedSellingFlowTemplate;
  height: number;
  width: number;
};

type GuidedSellingFlowComponentCustomProps = {
  documentRef?: Reference;
  params?: GuidedSellingFlowComponentParams;
};

type GuidedSellingFlowTemplateProps = {
  guidedSellingFlowContent: GuidedSellingFlowContent,
  guidedSellingFlowParams?: GuidedSellingFlowComponentParams
}

export type {
  GuidedSellingOption,
  GuidedSellingStep,
  GuidedSellingFlowContent,
  GuidedSellingFlowTemplateProps,
  GuidedSellingFlowTemplate,
  GuidedSellingFlowComponentParams,
  GuidedSellingFlowComponentCustomProps,
};