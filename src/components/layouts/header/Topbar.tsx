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
import {FC, useState} from 'react';
//mui
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Box, Breakpoint, IconButton, styled} from '@mui/material';
//bloomreach sdks
import {BrComponent} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {FlexBox, JustifiedFlexBox, JustifiedFlexContainer} from '@/components/common/flex-box';
//types
import {layoutConstant} from '@/utils/constants';

type TopbarProps = {};

const Topbar: FC<TopbarProps> = (): React.ReactElement => {
  const {settings} = useSettings();
  const {layouts} = settings;
  const {maxPageWidth, maxContainerWidth, topbar} = layouts;
  const [expand, setExpand] = useState<boolean>(false);

  const TopbarWrapper = styled(Box)<{expand: number}>(
    ({theme, expand}) => ({
      backgroundColor: topbar.bgColor,
      borderBottom: topbar.borderBottom,
      borderBottomColor: topbar.borderColor,
      // boxShadow={topbar.elevation}
      color: topbar.color,
      fontSize: topbar.fontSize,
      mb: topbar.mb,
      mt: topbar.mt,
      maxHeight: topbar.height || layoutConstant.topbarHeight,
      minHeight: topbar.height || layoutConstant.topbarHeight,
      overflow: 'hidden',
      pb: topbar.pb,
      pt: topbar.pt,
      transition: 'max-height 300ms ease',
      '& .toggle': {
        display: 'none',
        height: topbar.height || 40,
        padding: 0,
      },
      '& .MuiSvgIcon-root': {
        color: topbar.color || 'white',
      },
      [theme.breakpoints.down('sm')]: {
        maxHeight: expand ? topbar.maxHeight || 80 : topbar.height || layoutConstant.topbarHeight,
        '& .toggle': {display: 'block'},
      },
    }),
  );

  const StyledContainer = styled(JustifiedFlexContainer)(
    ({theme}) => ({
      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    }),
  );

  return (
    <TopbarWrapper boxShadow={topbar.elevation} expand={expand ? 1 : 0}>
      <StyledContainer maxWidth={topbar?.maxWidth as Breakpoint}>
        <JustifiedFlexBox>
          <BrComponent path='header/row1__col1'>
            <FlexBox alignItems='center'>
              <BrComponent />
            </FlexBox>
          </BrComponent>
          <IconButton disableRipple className='toggle' onClick={() => setExpand((state) => !state)}>
            {expand ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </JustifiedFlexBox>
        <BrComponent path='header/row1__col3'>
          <FlexBox alignItems='center'>
            <BrComponent />
          </FlexBox>
        </BrComponent>
      </StyledContainer>
    </TopbarWrapper>
  );
};

export default Topbar;