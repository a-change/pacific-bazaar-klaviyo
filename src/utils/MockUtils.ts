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

export async function mockApiCall(stallTime = 1000) {
  await new Promise(resolve => setTimeout(resolve, stallTime));
}

export function extractNamesFromEmail(email: string) {
  const user: any = {
    email,
  };
  const index = email.indexOf('@');
  if (index !== -1) {
    const names = email.substring(0, index).split('.');
    user.firstName = names[0];
    if (names.length == 3) {
      user.middleName = names[1];
      user.lastName = names[2];
    } else if (names.length == 2) {
      user.lastName = names[1];
    }
  }
  return user;
}
