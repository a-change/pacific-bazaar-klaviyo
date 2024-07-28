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

import {Span} from '@/components/common/typography/Typography';
import React from 'react';

interface Address {
  name?: string | null;
  address1?: string | null;
  country?: string | null;
  zip?: string | null;
}

interface AddressProps {
  address?: Address | null;
  header?: string | null;
}

export default function Address({address, header}: AddressProps) {
  if (!address) {
    return null;
  }
  const {name, address1, country, zip} = address;
  const fullName = `${name}`;
  return (
    <Span>
      {header && <strong>{header}</strong>}
      <Span>{fullName}, </Span>
      {address1 && <Span>{address1}</Span>}
      <Span>{`${country ? country + ' ' : ''}${zip || ''}`}</Span>
    </Span>
  );
}
