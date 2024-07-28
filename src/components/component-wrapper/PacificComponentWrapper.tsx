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

/* eslint-disable react/display-name */
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, Button} from '@mui/material';
import {styled} from '@mui/system';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Wraps a component in a styled Material UI {@link Box}
 * Used by all BR Content components
 *
 * @author Michael Reynolds <michael.reynolds@bloomreach.com>
 * @returns A Material UI {@link Box} containing the component
 * *
 * @param {BrProps} props
 * @returns {FC} a NextJS component
 */

//Custom styled components
const MockButton = styled(Button)(({theme}) => ({}));

const withWrapper = (Component: React.ComponentType) => (props) => {
  const {component, disableWrapper, mock} = props;
  const {t} = useTranslation('common');

  const params = component.getParameters();
  const {background, borders, elevation, margins, padding} = params;

  // Cross Pillar support
  let {mt, mb} = params;

  if (mt) {
    mt = parseInt(mt) || 'auto';
  }

  if (mb) {
    mb = parseInt(mb) || 'auto';
  }

  const sx: any = background?.image ? {
    backgroundImage: `url(${background.image})`,
    backgroundSize: background.size,
    backgroundRepeat: background.repeat,
    backgroundPosition: background.position,
  } : {};

  if (mock) {
    sx.display = 'inline-grid';
  }

  if (disableWrapper) {
    return <Component {...props} />;
  } else {
    return (
      <Box
        bgcolor={background?.color || 'inherit'}
        borderBottom={borders?.bottom || 0}
        borderLeft={borders?.left || 0}
        borderRight={borders?.right || 0}
        borderTop={borders?.top || 0}
        borderColor={borders?.color || 'inherit'}
        boxShadow={elevation || 0}
        mb={margins?.bottom || mb || 1}
        ml={margins?.left || 0}
        mr={margins?.right || 0}
        mt={margins?.top || mt || 0}
        pb={padding?.botom || 0}
        pl={padding?.left || 0}
        pr={padding?.right || 0}
        pt={padding?.top || 0}
        width='100%'
        sx={sx}
      >
        {mock && <MockButton startIcon={<ErrorOutlineIcon />} variant={'text'}
                             color={'warning'}>{t('mock-content', {name: component.getLabel()})}</MockButton>}
        <Component {...props} />
      </Box>
    );
  }
};

export default withWrapper;