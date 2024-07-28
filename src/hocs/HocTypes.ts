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

export interface PriceRange {
  priceMin: number;
  priceMax: number;
}

export interface ParamInput {
  name: string;
  values: (string | null)[];
}

export interface FacetFieldFilterInput {
  id: string;
  values: (string | null)[];
}

export interface QueryHintInput {
  brUid2?: string | null;
  domainKey?: string | null;
  viewId?: string | null;
  catalogViews?: string | null;
  facetFieldFilters?: (FacetFieldFilterInput | null)[] | null;
  cursor?: string | null;
  params?: (ParamInput | null)[] | null;
  customAttrFields?: (string | null)[] | null;
  customVariantAttrFields?: (string | null)[] | null;
  widgetType?: string | null;
  widgetId?: string | null;
}

export interface ItemId {
  id: string;
  code?: string;
}

const ITEM_ID = /([\w\d._=-]+[\w\d=]?)?___([\w\d._=/-]+[\w\d=]?)?/i;

const ITEM_ID_ALTERNATE = /id=([\w\d._=-]+[\w\d=]?)?;code=([\w\d._=/-]+[\w\d=]?)?/i;

export class ItemId implements ItemId {
  constructor(value: string) {
    if (ITEM_ID_ALTERNATE.test(value)) {
      [, this.id, this.code] = ITEM_ID_ALTERNATE.exec(value) ?? ['', value];
    } else {
      [, this.id, this.code] = ITEM_ID.exec(value) ?? ['', value];
    }

    this.id = this.id?.trim();
    this.code = this.code?.trim();
  }
}

export interface CurrentCustomer {
  id: string;
  email: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  merchandisingSegments?: string;
  discoverySegments?: string;
  contentSegments?: string;
}

export interface Cart {
  id: string;
  totalQuantity: number;
  revision: number | null;
  entries: Object | null;
  totalListPrice: Object | null;
  totalPurchasePrice: Object | null;
  active: boolean;
  state: string | null;
  discounts: (Object | null)[] | null;
}

export interface LoginProps {
  username?: string;
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  password?: string;
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  login: (prefilledUsername: any) => Promise<CurrentCustomer | undefined>;
  loading: boolean;
  customer?: CurrentCustomer;
  cart?: Cart;
}
