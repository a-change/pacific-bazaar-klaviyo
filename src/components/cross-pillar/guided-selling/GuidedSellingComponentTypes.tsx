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

import {FacetFieldFilterInput} from '@/hocs/HocTypes';

type GuidedSellingItem = {
  title?: string,
  description?: string,
  image?: string,
  facets?: Array<FacetFieldFilterInput>,
};

type GuidedSellingStep = {
  title?: string,
  description?: string,
  items?: Array<GuidedSellingItem>,
};

type GuidedSellingContent = {
  query?: string;
  completeLabel?: string,
  steps: Array<GuidedSellingStep>
};

type GuidedSellingTemplate =
  | 'default';

type GuidedSellingComponentParams = {
  template: GuidedSellingTemplate;
  height: number;
  width: number;
};

type GuidedSellingTemplateProps = {
  guidedSellingContent: GuidedSellingContent,
  guidedSellingParams?: GuidedSellingComponentParams
}

export type {
  GuidedSellingItem,
  GuidedSellingStep,
  GuidedSellingContent,
  GuidedSellingTemplateProps,
  GuidedSellingTemplate,
  GuidedSellingComponentParams,
};