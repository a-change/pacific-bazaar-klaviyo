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

import {useContext, useEffect, useState} from 'react';
import {Page} from '@bloomreach/spa-sdk';
import {initializeSegmentation, segmentsSubscription} from '@bloomreach/segmentation';
import {UserContext} from '@/contexts/UserContext';

export interface SegmentationComponentProps {
  page?: Page;
  perPage?: boolean;
}

export const SegmentationComponent = ({page, perPage}: SegmentationComponentProps) => {
  const [initialized, setInitialized] = useState(false);
  const channelProps = page ? page!.getChannelParameters() : {};

  const segmentationConfigs = {
    projectToken: channelProps.exponeaProjectToken ?? process.env.NEXT_PUBLIC_EXPONEA_PROJECT_TOKEN,
    targetURL: channelProps.exponeaApiTarget ?? process.env.NEXT_PUBLIC_EXPONEA_API_TARGET,
  };

  const {segmentationState: {segmentationStatus, setSegmentationStatus, setSegmentUpdates}} = useContext(UserContext);

  useEffect(() => {
    if (initialized) {
      console.log('[EXPONEA]', 'createSubscription');
      const sub: any = segmentsSubscription((props) => {
        console.log('[EXPONEA]', 'CHANGED', props, segmentationStatus);
        setSegmentationStatus(1);
        setSegmentUpdates(props);
      });
    }
  }, [initialized]);  // eslint-disable-line react-hooks/exhaustive-deps

  //console.log('[EXPONEA]', 'COUNTER', segmentationStatus);

  if (perPage) {
    !initialized && initializeSegmentation(segmentationConfigs).then(() => {
      //console.log('[EXPONEA]', 'initializeSegmentation finished', segmentationConfigs);
      setInitialized(true);
    });
  } else {
    !initialized &&
    initializeSegmentation(segmentationConfigs).then(() => {
      //console.log('[EXPONEA]', 'initializeSegmentation finished', segmentationConfigs);
      setInitialized(true);
    });
  }
  return null;
};
