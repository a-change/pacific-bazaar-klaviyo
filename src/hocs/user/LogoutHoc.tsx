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

import React, {useState} from 'react';
import {mockApiCall} from '../../utils/MockUtils';
import {anonymizeExponeaUser} from '@/components/exponea/ExponeaUtils';

export interface LogoutProps {
  logout: () => Promise<void>;
  loading: boolean;
}

function withLogoutBase<P>(Component: React.ComponentType<P & LogoutProps>) {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const [loading, setLoading] = useState(false);

    const logout = async () => {
      setLoading(true);
      try {
        await mockApiCall();
        //deleteCookie('__br__segment_ids');
        //deleteCookie('__br__segmentation_time');
      } finally {
        anonymizeExponeaUser(() => {
          setLoading(false);
        });
      }
    };

    return <Component logout={logout} loading={loading} {...props} />;
  };
}

export function withLogout<P>(Component: React.ComponentType<P & LogoutProps>) {
  return withLogoutBase(Component);
}
