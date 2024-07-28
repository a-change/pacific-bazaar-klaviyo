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

import {FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {slideDown} from '@/components/common/animations/keyframes';
import clsx from 'clsx';

type StickyProps = {
  fixedOn: number;
  children: ReactElement;
  scrollDistance?: number;
  notifyPosition?: number;
  containerRef?: {current: any};
  onSticky?: (isFixed: boolean) => void;
  notifyOnScroll?: (hasReachedPosition: boolean) => void;
};

type StyledBoxProps = {
  fixed?: boolean;
  fixedOn?: number;
  children: ReactNode;
  componentHeight?: number;
};

export const StyledBox = styled<FC<StyledBoxProps>>(
  ({children, componentHeight, fixedOn, fixed, ...rest}) => (
    <div {...rest}>{children}</div>
  ),
)<StyledBoxProps>(({theme, componentHeight, fixedOn, fixed}) => ({
  '& .hold': {
    zIndex: 5,
    boxShadow: 'none',
    position: 'relative',
  },

  '& .fixed': {
    left: 0,
    right: 0,
    zIndex: 1199, //1500,
    position: 'fixed',
    top: `${fixedOn}px`,
    boxShadow: theme.shadows[2],
    transition: 'all 350ms ease-in-out',
    animation: `${slideDown} 400ms ${theme.transitions.easing.easeInOut}`,
  },
  '& + .section-after-sticky': {paddingTop: fixed ? componentHeight : 0},
}));

const Sticky: FC<StickyProps> = ({
                                   fixedOn,
                                   children,
                                   onSticky,
                                   containerRef,
                                   notifyPosition,
                                   notifyOnScroll,
                                   scrollDistance = 0,
                                 }) => {
  const [fixed, setFixed] = useState(false);
  const [parentHeight, setParentHeight] = useState(0);
  const elementRef = useRef<any>(null);
  const positionRef = useRef(0);

  const scrollListener = useCallback(() => {
    if (!window) return;

    // Distance of element from window top (-) minus value
    let distance = window.pageYOffset - positionRef.current;

    if (containerRef?.current) {
      let containerDistance =
        containerRef.current.offsetTop +
        containerRef.current?.offsetHeight -
        window.pageYOffset;

      if (notifyPosition && notifyOnScroll) {
        notifyOnScroll(
          distance <= notifyPosition && containerDistance > notifyPosition,
        );
      }

      return setFixed(distance <= fixedOn && containerDistance > fixedOn);
    }

    if (notifyPosition && notifyOnScroll) {
      notifyOnScroll(distance >= notifyPosition);
    }

    let isFixed = distance >= fixedOn + scrollDistance;

    if (positionRef.current === 0) {
      isFixed =
        distance >= fixedOn + elementRef.current?.offsetHeight + scrollDistance;
    }

    setFixed(isFixed);
  }, [containerRef, fixedOn, notifyOnScroll, notifyPosition, scrollDistance]);

  useEffect(() => {
    if (!window) return;

    window.addEventListener('scroll', scrollListener);
    window.addEventListener('resize', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', scrollListener);
    };
  }, [scrollListener]);

  useEffect(() => {
    if (!positionRef.current) {
      positionRef.current = elementRef.current?.offsetTop;
    }
    setParentHeight(elementRef.current?.offsetHeight || 0);
  }, [children]);

  useEffect(() => {
    if (onSticky) onSticky(fixed);
  }, [fixed, onSticky]);

  return (
    <StyledBox fixedOn={fixedOn} componentHeight={parentHeight} fixed={fixed}>
      <div className={clsx({hold: !fixed, fixed: fixed})} ref={elementRef}>
        {children}
      </div>
    </StyledBox>
  );
};

export default Sticky;