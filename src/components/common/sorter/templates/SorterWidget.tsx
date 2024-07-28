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
import {useTranslation} from 'next-i18next';
//mui
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
//components
import {WidgetParams} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentTypes';

//Component Props
export interface SorterWidgetProps {
  widgetParams: WidgetParams;
}

export const SorterWidget = (props: SorterWidgetProps) => {
  const {widgetParams: {widget, widgets, setWidget}} = props;
  const {t} = useTranslation('product');

  return widgets?.length > 1 && <FormControl sx={{
    alignItems: 'center',
    my: '0.25rem',
  }} size='small'>
    <InputLabel id={`widget-select-label`}>{t('widget')}</InputLabel>
    <Select
      labelId={`widget-select-label`}
      fullWidth
      placeholder='Select widget'
      label={t('widget')}
      defaultValue={widget?.widgetId ?? ''}
      displayEmpty
      sx={{flex: '1 1 0', minWidth: '150px'}}
      onChange={(e) => {
        const matchedWidget = widgets?.find(widget => e.target.value === widget.widgetId);
        if (matchedWidget && widget?.widgetId !== matchedWidget?.widgetId) {
          setWidget(matchedWidget);
        }
      }}>
      {widgets?.map((item) => (
        <MenuItem value={item.widgetId} key={item.widgetId}>
          {item.title}
        </MenuItem>
      ))}
    </Select>
  </FormControl>;
};