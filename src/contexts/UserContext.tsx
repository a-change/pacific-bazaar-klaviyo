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

import {useRouter} from 'next/router';
import React, {useEffect, useReducer, useState} from 'react';
import {useCookies} from 'react-cookie';
import {VisitorType} from '@/components/helper/visitor/VisitorHelperTypes';

const RECENT_SEARCH_COOKIE = 'recent_keyword_search';

type UserType = {
  email: string,
  firstName: string | null,
  id: string,
  lastName: string | null,
  middleName: string | null,
  username?: string,
  segment?: string,
  altSegment?: string,
  merchandisingSegments?: string,
  discoverySegments?: string,
  contentSegments?: string,
}

type UserSegmentType = {
  primary?: string | null,
  secondary?: string | null,
  affinity?: string | null,
  campaign?: string | null
}

type DiscoveryApiCallType = {
  endpoint?: string,
  params?: URLSearchParams,
  response?: Object,
}

type DiscoveryApiCallsType = {
  discoveryApiCalls: Record<string, Record<string, DiscoveryApiCallType>>,
}

type ComponentDiscoveryApiCallType = {
  componentId?: string,
  apiType?: string,
  apiCall?: DiscoveryApiCallType,
  apiTypes?: string[],
  apiCalls?: DiscoveryApiCallType[],
}

type UserContextType = {
  userState: {
    user: Partial<UserType>,
    setUser: React.Dispatch<UserType | null>,
    visitor: Partial<VisitorType>,
    setVisitor: React.Dispatch<VisitorType | null>
  },
  gtmEventState: {
    gtmEvent: any,
    setGtmEvent: React.Dispatch<any>
  },
  userSegmentState: {
    userSegment: Partial<UserSegmentType>,
    setUserSegment: React.Dispatch<UserSegmentType | null>
  },
  recentSearchesState: {
    recentSearches: Partial<any>,
    setRecentSearches: React.Dispatch<any | null>
  },
  headerState: {
    showVerticalMenu: boolean,
    setShowVerticalMenu: React.Dispatch<boolean>
  },
  discoveryApiCallsState: {
    discoveryApiCalls: Partial<Record<string, DiscoveryApiCallsType>>,
    setDiscoveryApiCalls: React.Dispatch<ComponentDiscoveryApiCallType | null>
  },
  segmentationState: {
    segmentationStatus: number,
    setSegmentationStatus: React.Dispatch<number>
    segmentUpdates: Array<ExponeaSegment>,
    setSegmentUpdates: React.Dispatch<Array<ExponeaSegment>>
  },
}

export type {
  UserType,
  UserSegmentType,
  UserContextType,
  DiscoveryApiCallsType,
  ComponentDiscoveryApiCallType,
};

export const USER_SEGMENT_PREFIX = 'customer_profile:';

export type ExponeaSegment = {
  id: string;
  segmentation_id?: string;
}

let reducer = (user: Partial<UserType>, newUser: UserType | null) => {
  if (newUser === null) {
    sessionStorage.removeItem('user');
    return {};
  }
  const updatedUser = {...user, ...newUser};
  if (updatedUser.email) {
    updatedUser.username = updatedUser.email;
  }
  return updatedUser;
};

let gtmReducer = (event: any, newEvent: any) => {
  let updatedEvent: any = {};
  if (newEvent.cleanup) {
    const componentIds = newEvent.componentIds;
    Object.keys(event).forEach((key) => {
      if (componentIds && componentIds.includes(key)) {
        updatedEvent[key] = {...event[key]};
      }
    });
  } else {
    updatedEvent = {...event, ...newEvent};
  }
  updatedEvent.url = window.location.href;
  return updatedEvent;
};

let segmentReducer = (userSegment: Partial<UserSegmentType>, newUserSegment: UserSegmentType | null) => {
  if (newUserSegment === null) {
    sessionStorage.removeItem('userSegment');
    return {};
  }
  return {...userSegment, ...newUserSegment};
};

export const getSegmentWithPrefix = (segment: string | null | undefined) => {
  if (segment && !segment.startsWith(USER_SEGMENT_PREFIX)) {
    return USER_SEGMENT_PREFIX + segment;
  } else {
    return segment;
  }
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

function UserProvider(props: any) {
  const [localState, setLocalState] = useState<UserType>({
    email: '',
    firstName: '',
    id: '',
    lastName: '',
    middleName: '',
  } as UserType);
  const [localSegmentState, setLocalSegmentState] = useState<UserSegmentType>({});
  const [sessionRead, setSessionRead] = useState(false);
  const router = useRouter();
  const [cookies, setCookies, remoteCookie] = useCookies();

  const [discoveryApiCalls, setDiscoveryApiCalls] = useReducer(
    (state: Record<string, DiscoveryApiCallsType>, newState: ComponentDiscoveryApiCallType | null) => {
      const {componentId, apiType, apiCall, apiTypes, apiCalls} = newState ?? {};
      if (!componentId || (!apiType && !apiTypes) || (!apiCall && !apiCalls)) {
        return {...state};
      }

      const componentState = {};

      const componentApiCallState = {};
      if (apiTypes) {
        apiTypes.forEach((value, index) => {
          componentApiCallState[value] = apiCalls[index];
        });
      } else {
        componentApiCallState[apiType] = apiCall;
      }
      componentState[componentId] = componentApiCallState;

      return {...state, ...componentState};
    },
    {},
  );

  const [recentSearches, setRecentSearches] = useReducer(
    (state: Array<string>, newState: any) => {
      if (newState === null) {
        return [];
      }
      newState = Array.isArray(newState) ? newState : [newState];
      const updatedState = state.filter((item) => !newState.includes(item)).concat(newState);
      while (updatedState?.length > 5) {
        updatedState.shift();
      }
      return updatedState;
    },
    cookies?.[RECENT_SEARCH_COOKIE]?.length > 0 ? cookies?.[RECENT_SEARCH_COOKIE].split('|') : [],
  );

  //Load sessionStorage w/ sessionRead boolean to prevent overwriting of sessionStorage before it is read
  useEffect(() => {
    const getLocalState = async () => {
      setLocalState(JSON.parse(sessionStorage.getItem('user') as string) as UserType);
      setLocalSegmentState(
        JSON.parse(sessionStorage.getItem('userSegment') as string) as UserSegmentType,
      );
      setSessionRead(true);
    };
    getLocalState();
  }, []);

  //FIX the URL to match router.
  const [user, setUser] = useReducer(reducer, localState);
  const [visitor, setVisitor] = useState<VisitorType | null>(null);

  const [gtmEvent, setGtmEvent] = useReducer(gtmReducer, {
    url: router.asPath,
  });
  const [userSegment, setUserSegment] = useReducer(segmentReducer, localSegmentState);

  const [showVerticalMenu, setShowVerticalMenu] = useState(false);

  const [segmentationStatus, setSegmentationStatus] = useReducer((state: number, newState: number) => {
    if (newState === 0) {
      return 0;
    } else {
      return state + 1;
    }
  }, 0);

  const [segmentUpdates, setSegmentUpdates] = useState<Array<ExponeaSegment>>([]);

  //When localStorage is read and state is updated, overwrite user details w/ new local state
  useEffect(() => {
    setUser(localState);
    setUserSegment(localSegmentState);
  }, [localState, localSegmentState]);

  useEffect(() => {
    if (sessionRead) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sessionRead) {
      sessionStorage.setItem('userSegment', JSON.stringify(userSegment));
    }
  }, [userSegment]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (recentSearches?.length === 0) {
      remoteCookie(RECENT_SEARCH_COOKIE);
    } else {
      setCookies(RECENT_SEARCH_COOKIE, recentSearches.join('|'), {
        path: '/',
        maxAge: 3600, // just keep for one hour
      });
    }
  }, [recentSearches]);// eslint-disable-line react-hooks/exhaustive-deps


  return (
    <UserContext.Provider value={
      {
        userState: {user, setUser, visitor, setVisitor},
        gtmEventState: {gtmEvent, setGtmEvent},
        userSegmentState: {userSegment, setUserSegment},
        recentSearchesState: {recentSearches, setRecentSearches},
        headerState: {showVerticalMenu, setShowVerticalMenu},
        discoveryApiCallsState: {discoveryApiCalls, setDiscoveryApiCalls},
        segmentationState: {segmentationStatus, setSegmentationStatus, segmentUpdates, setSegmentUpdates},
      }
    }>
      {props.children}
    </UserContext.Provider>
  );
}

export {UserContext, UserProvider};

