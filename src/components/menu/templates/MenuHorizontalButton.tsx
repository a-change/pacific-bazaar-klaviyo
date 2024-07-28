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
import React from 'react';
//next
import {useRouter} from 'next/router';
//mui
import {IconButton, styled} from '@mui/material';
//components
import {FlexBox} from '@/components/common/flex-box';
import Google from '@/components/common/icons/Google';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
import {SocialIcon} from '@/components/common/social/SocialIcon';
//types
import {MenuContentItem, MenuTemplateProps} from '@/components/menu/MenuComponentTypes';
//functions
import {getInternalImageUrl} from '@/utils/ImageUtils';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//Component Props
interface RenderProps {
  menuItem: MenuContentItem;
}

//Custom styled components
const MenuImage = styled(BazaarImage, {
  shouldForwardProp: (props) => props !== 'name',
})<{name: string}>(({name}) => ({
  ...(name === 'logo' ? {height: 60, maxWidth: 220, cursor: 'pointer', objectFit: 'contain'} : {}),
}));

const MenuIconButton = styled(IconButton)({
  fontSize: 10,
  backgroundColor: 'rgba(0,0,0,0.2)',
  ':hover': {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export const MenuHorizontalButton = (props: MenuTemplateProps) => {
  const {menuContent: {name, menuContentItems}} = props;
  const router = useRouter();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const RenderMenuItem = ({menuItem}: RenderProps) => {
    switch (menuItem.display) {
      case 'image':
        return (
          <MenuImage src={getInternalImageUrl(menuItem.image)} name={name}
                     onClick={() => router.push(menuItem.url ?? '')} />
        );
      case 'icon':
        return <MenuIconButton size={'small'} title={menuItem.name}>
          <SocialIcon type={menuItem.name} link={{
            url: menuItem.url,
          }} />
        </MenuIconButton>;
      default:
        return <Google fontSize='inherit' />;
    }
  };

  return <FlexBox mx={downMd ? 0 : -0.625}>
    {menuContentItems?.map((menuItem, key) => (
      <RenderMenuItem key={key} menuItem={menuItem} />
    ))}
  </FlexBox>;
};
