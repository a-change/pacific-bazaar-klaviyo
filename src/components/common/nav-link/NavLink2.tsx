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
import {Small} from '@/components/common/bazaar/Typography';
import Link from 'next/link';
import {FC} from 'react';

// ==============================================================
type NavLinkProps = {
  title: string;
  url?: string;
  color?: string;
  borderColor?: string;
};
// ==============================================================

const NavLink2: FC<NavLinkProps> = ({
                                      url,
                                      title = 'SHOP NOW',
                                      color,
                                      borderColor = 'primary.600',
                                    }) => {
  return url ? (
    <Link href={url ?? ''} legacyBehavior>
      <a>
        <Small fontWeight='900' borderBottom={2} color={color} borderColor={borderColor}>
          {title}
        </Small>
      </a>
    </Link>
  ) : (
    <Small fontWeight='900' borderBottom={2} color={color} borderColor={borderColor}>
      {title}
    </Small>
  );
};

export default NavLink2;
