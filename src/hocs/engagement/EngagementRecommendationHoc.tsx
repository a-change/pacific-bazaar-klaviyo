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

import React, {useEffect, useState} from 'react';
import {BrProps} from '@bloomreach/react-sdk';

// Component output parameters
export interface EngagementRecommendationProps {
  loading: boolean;
  engagementRecommendationResult: Array<any> | undefined | null;
}

// Component input parameters
export interface EngagementRecommendationInputProps {
  recommendationId: string;
  size?: number;
  fillWithRandom?: boolean;
}

function withEngagementRecommendationBase<P extends BrProps>(
  Component: React.ComponentType<P & EngagementRecommendationProps>,
) {
  // eslint-disable-next-line react/display-name
  return (props: P & EngagementRecommendationInputProps) => {
    const {
      recommendationId,
      size = 12,
      fillWithRandom = true,
    } = props;

    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<any>(null);

    const [exponea, setExponea] = useState<any>(null);

    useEffect(() => {
      setExponea((window as any)?.exponea);
    }, []);

    //const exponea = (window as any)?.exponea;

    if (exponea && loading) {
      exponea.getRecommendation({
        recommendationId,
        size,
        fillWithRandom,
        callback: (data: any) => {
          if (!data) {
            console.log('[HOC]', 'exponea getRecommendation empty return!', recommendationId, size, fillWithRandom);
          }
          setLoading(false);
          setResult(data);
        },
      });
    }

    return <Component loading={loading} engagementRecommendationResult={result} {...props} />;
  };
}

export function withEngagementRecommendation<P extends BrProps>(
  Component: React.ComponentType<P & EngagementRecommendationProps>,
) {
  return withEngagementRecommendationBase(Component);
}
