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
import {FC, ReactNode} from 'react';
//mui
import {Avatar, Badge, styled} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//Custom styled components
export const SmallAvatar = styled(Avatar)(({theme}) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

type ProductSelectedAttributeProps = {
  selected?: boolean;
  children?: ReactNode;
};

export const ProductSelectedAttribute: FC<ProductSelectedAttributeProps> = (props) => {
  const {selected, children} = props;
  if (selected) {
    return <Badge
      overlap='circular'
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      badgeContent={
        <SmallAvatar>
          <CheckCircleIcon color={'success'} />
        </SmallAvatar>
      }
    >
      {children}
    </Badge>;
  } else {
    return <>{children}</>;
  }
};
