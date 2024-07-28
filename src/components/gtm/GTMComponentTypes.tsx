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

/**
 * GTM types
 */
type WidgetProps = {
  rid: string;
  id: string;
  type: string;
};

type GTMProps = {
  gtmId: string,  //GTM id, must be something like GTM-000000.
  dataLayer?: any,	//Object that contains all of the information that you want to pass to Google Tag Manager.
  dataLayerName?: string,	//Custom name for dataLayer object.
  events?: any,	//Additional events such as 'gtm.start': new Date().getTime(),event:'gtm.js'.
  auth?: string,	//used to set environments.
  preview?: string //used to set environments, something like env-00.
};

export type {
  GTMProps,
  WidgetProps,
};
