/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless reDemoired by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const UserMock = {
  id: '7613a656-b670-4929-9e16-9d8fd97d9d10',
  email: 'bloomreach.demo@bloomreach.com',
  firstName: 'Bloomreach',
  middleName: '',
  lastName: 'Demo',
};

export const CartMock = () => {
  const int = Math.random().toString(36).slice(2, 10);

  return {
    id: `${int}-503c-4545-a2d2-3fda6e0a5e8a`,
    totalQuantity: 0,
    revision: 0,
    entries: [],
    totalListPrice: {
      moneyAmounts: [
        {
          amount: 0,
          currency: 'USD',
          displayValue: 'USD 0',
        },
      ],
    },
    totalPurchasePrice: {
      moneyAmounts: [
        {
          amount: 0,
          currency: 'USD',
          displayValue: 'USD 0',
        },
      ],
    },
    active: true,
    state: 'Active',
    discounts: [],
  };
};

export const AddressGroupMock = {
  addresses: [
    {
      id: 'Cju5EFhG66',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '50 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y55',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '11 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG55',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '52 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y44',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '13 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG33',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '54 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y9',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '14 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG8',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '55 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y7',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '15 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG6',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '56 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y5',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '14 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG4',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '52 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y3',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '114 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'Cju5EFhG2',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '5234 Eden St',
      additionalStreetInfo: 'Apt 100',
      company: '',
      postalCode: '04609',
      city: 'Sometown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
    {
      id: 'kMXhRx1Y1',
      firstName: 'Bloomreach',
      middleName: null,
      lastName: 'Demo',
      streetAddress: '112 Charles St',
      additionalStreetInfo: 'Apt 101',
      company: '',
      postalCode: '01886',
      city: 'Othertown',
      state: 'MA',
      country: 'USA',
      billingAddress: true,
      shippingAddress: true,
      readOnly: false,
    },
  ],
  defaultShippingAddress: {
    id: 'Cju5EFhG',
    firstName: 'Bloomreach',
    middleName: null,
    lastName: 'Demo',
    streetAddress: '50 Eden St',
    additionalStreetInfo: 'Apt 100',
    company: '',
    postalCode: '04609',
    city: 'Sometown',
    state: 'MA',
    country: 'US',
    billingAddress: true,
    shippingAddress: true,
    readOnly: false,
  },
  defaultBillingAddress: {
    id: 'Cju5EFhG',
    firstName: 'Bloomreach',
    middleName: null,
    lastName: 'Demo',
    streetAddress: '50 Eden St',
    additionalStreetInfo: 'Apt 100',
    company: '',
    postalCode: '04609',
    city: 'Sometown',
    state: 'MA',
    country: 'US',
    billingAddress: true,
    shippingAddress: true,
    readOnly: false,
  },
};

export const ShipmentMethodsMock = [
  {
    id: 'normal',
    name: 'Normal',
    description: 'Normal Shipping 6-7 days',
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Express Shipping 1-2 days',
  },
];