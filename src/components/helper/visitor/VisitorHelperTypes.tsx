/*
 * Copyright 2020-2023 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum Constants {
  CAT_AGGREGATE = 'aggregate',
  CAT_PROPERTY = 'property',
  CAT_SEGMENTATION = 'segmentation',
  CURRENCY_EURO = 'EUR',
  CURRENCY_GBP = 'GBP',
  CURRENCY_USD = 'USD',
  LOCALE_GB = 'en-GB',
  LOCALE_US = 'en-US',
  PROP_AGE = 'age',
  PROP_AVATAR = 'avatar',
  PROP_BIRTHDATE = 'birth_date',
  PROP_CITY = 'city',
  PROP_COUNTRY = 'country',
  PROP_EMAIL = 'email',
  PROP_EXTSCORE = 'external_score',
  PROP_FIRSTNAME = 'first_name',
  PROP_GENDER = 'gender',
  PROP_GENERATION = 'generation',
  PROP_ID = 'id',
  PROP_LANGUAGE = 'language',
  PROP_LASTNAME = 'last_name',
  PROP_LOYALTYPOINTS = 'loyalty_points',
  TEXT_DATE = 'date',
  TEXT_TIMESTAMP = 'timestamp',
  VALUE_EMAIL = 'user@demo.com',
  VALUE_FIRSTNAME = 'Anonymous',
  VALUE_LASTNAME = 'User',
  VALUE_NA = 'na',
  VALUE_UNDEFINED = 'undefined',
}

export type AttributesMapItemType = {
  type: string;
  name: string;
};

export type ResultsItemType = {
  success: boolean;
  value: any;
};

export enum VisitorAttributeTypes {
  AGGREGATES = 'aggregates',
  GENDER = 'gender',
  LANGUAGE = 'language',
  LOCALE = 'locale',
  NAME = 'name',
  SEGMENTATIONS = 'segmentations',
  ATTRIBUTES = 'attributes',
}

export type VisitorType = {
  age?: any;
  aggregates?: any;
  avatar?: any;
  birth_date?: any;
  city?: any;
  cookie?: any;
  country?: any;
  email?: any;
  external_score?: any;
  first_name?: any;
  gender?: any;
  generation?: any;
  id?: any;
  language?: any;
  last_name?: any;
  loyalty_points?: any;
  segmentations?: Record<string, Array<string>>;
};
