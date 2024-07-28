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
import {SvgIcon, SvgIconProps} from '@mui/material';

const CartBag = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 20 23'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M5.33329 7.37181V5.37181C5.33329 2.79431 7.42079 0.705139 9.99996 0.705139C12.5791 0.705139 14.6666 2.79431 14.6666 5.37181V7.37181H17.3333C18.4375 7.37181 19.3333 8.26764 19.3333 9.37181V18.0385C19.3333 20.2468 17.5416 22.0385 15.3333 22.0385H4.66663C2.45746 22.0385 0.666626 20.2468 0.666626 18.0385V9.37181C0.666626 8.26764 1.56204 7.37181 2.66663 7.37181H5.33329ZM7.33329 7.37181H12.6666V5.37181C12.6666 3.89889 11.4708 2.70514 9.99996 2.70514C8.52913 2.70514 7.33329 3.89889 7.33329 5.37181V7.37181ZM2.66663 9.37181V18.0385C2.66663 19.1426 3.56204 20.0385 4.66663 20.0385H15.3333C16.4375 20.0385 17.3333 19.1426 17.3333 18.0385V9.37181H14.6666V11.7051C14.6666 12.2593 14.2208 12.7051 13.6666 12.7051C13.1125 12.7051 12.6666 12.2593 12.6666 11.7051V9.37181H7.33329V11.7051C7.33329 12.2593 6.88746 12.7051 6.33329 12.7051C5.77913 12.7051 5.33329 12.2593 5.33329 11.7051V9.37181H2.66663Z'
        fill='currentColor'
      />
    </SvgIcon>
  );
};

export default CartBag;
