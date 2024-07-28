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

//react
import React, {ReactNode} from 'react';
//next
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {
  EngagementRecommendationInputProps,
  EngagementRecommendationProps,
  withEngagementRecommendation,
} from '@/hocs/engagement/EngagementRecommendationHoc';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
//functions
import {
  getEngagementRecommendationsProps,
} from '@/components/engagement-recommendations/EngagementRecommendationsComponentUtils';

export interface EngagementRecommendationTemplateProps {
  caption?: string,
  subTitle?: string,
  numberOfColumns?: number,
  titleNode?: ReactNode,
  size?: number,
}

function EngagementRecommendationsBase(props: BrProps & EngagementRecommendationProps & EngagementRecommendationInputProps & EngagementRecommendationTemplateProps) {
  const {
    loading,
    engagementRecommendationResult,
    caption,
    subTitle,
    numberOfColumns,
    titleNode,
    size,
  } = props;

  const {t} = useTranslation('common');
  if (loading) {
    return <Status container loading status={`${t('loading-engagement-recommendations')}...`} />;
  }

  if (!engagementRecommendationResult) {
    return <Status error status={'No Engagement Recommendation!'} />;
  }

  const productGridProps = getEngagementRecommendationsProps(
    engagementRecommendationResult,
    {
      caption,
      subTitle,
      numberOfColumns,
      titleNode,
      size,
    },
  );

  return (
    <ProductGrid {...productGridProps} />
  );
}

export const EngagementRecommendations = withEngagementRecommendation(EngagementRecommendationsBase);