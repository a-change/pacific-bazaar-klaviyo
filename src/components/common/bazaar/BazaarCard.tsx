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
import {FC} from 'react';
import {Card, CardProps, styled} from '@mui/material';

interface BazaarCardProps extends CardProps {
  hoverEffect?: boolean;
}

const BazaarCard = styled<FC<BazaarCardProps>>(
  ({hoverEffect, children, ...rest}) => <Card {...rest}>{children}</Card>,
)<BazaarCardProps>(({theme, hoverEffect}) => ({
  overflow: 'unset',
  borderRadius: '8px',
  transition: 'all 250ms ease-in-out',
  '&:hover': {...(hoverEffect && {boxShadow: theme.shadows[3], transform: 'scale(1.5)', zIndex: 10})},
}));

BazaarCard.defaultProps = {hoverEffect: false};

export default BazaarCard;
