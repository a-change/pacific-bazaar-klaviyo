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
import React, {Children, CSSProperties, FC, Fragment, ReactNode} from 'react';
//mui
import {SxProps} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//other libs
import clsx from 'clsx';
import {Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
//hooks
import useSettings from 'hooks/useSettings';

//Custom styled components
import {
  StyledArrowBackButton,
  StyledArrowNextButton,
  StyledCarouselProvider,
  StyledDot,
  StyledDotGroup,
  StyledSlider,
} from './styles';

// ===================================================================
export interface CarouselProps {
  children?: ReactNode;
  sx?: SxProps;
  step?: number;
  interval?: number;
  infinite?: boolean;
  autoPlay?: boolean;
  totalSlides: number;
  currentSlide?: number;
  visibleSlides?: number;
  naturalSlideWidth?: number;
  naturalSlideHeight?: number;
  isIntrinsicHeight?: boolean;
  hasMasterSpinner?: boolean;
  dotClass?: string;
  dotColor?: string;
  showDots?: boolean;
  dotGroupMarginTop?: string;
  spacing?: string;
  showArrow?: boolean;
  showArrowOnHover?: boolean;
  arrowButtonClass?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
  leftButtonStyle?: CSSProperties;
  rightButtonStyle?: CSSProperties;
  arrowButtonColor?: 'primary' | 'secondary' | 'inherit';
}

// ===================================================================

const Carousel: FC<CarouselProps> = ({
                                       sx,
                                       step,
                                       spacing,
                                       infinite,
                                       children,
                                       autoPlay,
                                       interval,
                                       showDots,
                                       dotClass,
                                       dotColor,
                                       showArrow,
                                       totalSlides,
                                       currentSlide,
                                       visibleSlides,
                                       leftButtonClass,
                                       leftButtonStyle,
                                       arrowButtonClass,
                                       rightButtonClass,
                                       rightButtonStyle,
                                       hasMasterSpinner,
                                       isIntrinsicHeight,
                                       naturalSlideWidth,
                                       dotGroupMarginTop,
                                       naturalSlideHeight,
                                     }) => {
  // site settings
  const {settings} = useSettings();

  return (
    <StyledCarouselProvider
      sx={sx}
      step={step}
      spacing={spacing}
      interval={interval}
      infinite={infinite}
      isPlaying={autoPlay}
      totalSlides={totalSlides}
      currentSlide={currentSlide}
      visibleSlides={visibleSlides}
      hasMasterSpinner={hasMasterSpinner}
      isIntrinsicHeight={isIntrinsicHeight}
      naturalSlideWidth={naturalSlideWidth || 100}
      naturalSlideHeight={naturalSlideHeight || 125}
    >
      <StyledSlider spacing={spacing}>
        {Children.map(children, (child, ind) => (
          <Slide index={ind}>{child}</Slide>
        ))}
      </StyledSlider>

      {showDots && (
        <StyledDotGroup
          className={clsx(dotClass)}
          dot_margin_top={dotGroupMarginTop}
          renderDots={(props: any) => renderDots({...props, step, dotColor})}
        />
      )}

      {showArrow && (
        <Fragment>
          <StyledArrowBackButton
            id='backArrowButton'
            sx={{left: '-20px'}}
            style={leftButtonStyle || {}}
            className={clsx(leftButtonClass, arrowButtonClass)}
          >
            {settings.direction === 'ltr' ? (
              <ArrowBackIcon fontSize='small' color='inherit' />
            ) : (
              <ArrowForwardIcon fontSize='small' color='inherit' />
            )}
          </StyledArrowBackButton>

          <StyledArrowNextButton
            id='backForwardButton'
            sx={{right: '-20px'}}
            style={rightButtonStyle || {}}
            className={clsx(arrowButtonClass, rightButtonClass)}
          >
            {settings.direction === 'ltr' ? (
              <ArrowForwardIcon fontSize='small' color='inherit' />
            ) : (
              <ArrowBackIcon fontSize='small' color='inherit' />
            )}
          </StyledArrowNextButton>
        </Fragment>
      )}
    </StyledCarouselProvider>
  );
};

const renderDots = ({
                      step,
                      dotColor,
                      totalSlides,
                      currentSlide,
                      visibleSlides,
                      carouselStore,
                    }: any) => {
  const dots = [];
  const total = totalSlides - visibleSlides + 1;
  // handle dot button
  const handleClick = (currentSlide: any, autoplay: boolean) => {
    carouselStore.setStoreState({
      autoPlay: autoplay,
      currentSlide: currentSlide,
    });
  };

  for (let i = 0; i < total; i += step) {
    dots.push(
      <StyledDot
        dot_color={dotColor}
        onClick={() => handleClick(i, false)}
        dot_active={currentSlide === i ? i + 1 : 0}
        key={(Math.random() * i + Date.now()).toString()}
      />,
    );

    if (total - (i + 1) < step && total - (i + 1) !== 0) {
      dots.push(
        <StyledDot
          dot_color={dotColor}
          dot_active={totalSlides - visibleSlides}
          key={(Math.random() * i + Date.now()).toString()}
          onClick={() => handleClick(totalSlides - visibleSlides, false)}
        />,
      );
    }
  }
  return dots;
};

Carousel.defaultProps = {
  sx: {},
  step: 1,
  interval: 2000,
  showDots: false,
  showArrow: true,
  autoPlay: false,
  infinite: false,
  totalSlides: 10,
  visibleSlides: 5,
  spacing: '1.5rem',
  naturalSlideWidth: 100,
  naturalSlideHeight: 125,
  hasMasterSpinner: false,
  isIntrinsicHeight: true,
  dotGroupMarginTop: '2rem',
  arrowButtonColor: 'secondary',
};

export default Carousel;
