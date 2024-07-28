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

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let split = el.split('=');
    cookie[split[0].trim()] = split.slice(1).join("=");
  })
  return cookie[name];
}

function klaviyoIdentify() {
  const klaviyo = (window as any)?.klaviyo;

  // klaviyo && klaviyo.identify({
  //   'email': 'nikolay@exponea.horse',
  //   'first_name': 'Nikolay',
  //   'last_name': 'Semyonov'
  // }, function (res) {
  //   console.log("[trackViewItem] Klaviyo identify response result:", res);
  // });
}

function getKlaviyoToExponeaItemNamingMapping() {
  return {
    "ProductName": "title",
    "ProductID": "product_id",
    "SKU": "sku",
    "Categories": "categories",
    "ImageURL": "image",
    "URL": "url",
    "Brand": "brand",
    "Price": "price",
    "CompareAtPrice": "original_price",
  }
}

export const trackCheckout = (step: string, payload: any) => {
  const klaviyo = (window as any)?.klaviyo;
  console.log("[trackCartUpdate] Klaviyo item:", payload, "has Klaviyo:", window.hasOwnProperty("klaviyo"));
  payload.step = step;

  trackExponeaEvent("checkout", payload);
  klaviyoIdentify();
  klaviyo && klaviyo.push(["track", "Checkout", payload]);

}

export const trackCartUpdate = (payload: any) => {
  const klaviyo = (window as any)?.klaviyo;
  console.log("[trackCartUpdate] Klaviyo item:", payload, "has Klaviyo:", window.hasOwnProperty("klaviyo"));
  
  klaviyoIdentify();
  klaviyo.track("Cart Updated", payload).then(res => {
    console.log("[trackCartUpdate] Klaviyo track response result:", res);
  });;
  trackExponeaEvent("cart_update", payload);
}

export const trackViewItem = (payload: any) => {
  try {
    const klaviyo = (window as any)?.klaviyo;
    const klaviyoPayload = Object.assign({}, payload);
    klaviyoPayload["Metadata"] = {
      Brand: payload["brand"],
      Price: payload["price"],
      CompareAtPrice: payload["original_price"]
    };

    console.log("[trackViewItem] Klaviyo item:", klaviyoPayload, "has Klaviyo:", window.hasOwnProperty("klaviyo"));
    klaviyoIdentify();
    // klaviyo && klaviyo.push(["track", "Viewed Product", item]);

    klaviyo.track("Viewed Product", klaviyoPayload).then(res => {
      console.log("[trackViewItem] Klaviyo track response result:", res);
    });

    trackExponeaEvent("view_item", payload);

  } catch (e) {
    console.error("[trackViewItem] error:", e);
  }

}

export const trackExponeaEvent = (name: string, payload: any) => {
  const exponea = (window as any)?.exponea;
  if (exponea) {
    exponea.track(name, payload);
  }
};

export const identifyExponeaUser = (email: string, callback: Function) => {
  const exponea = (window as any)?.exponea;
  if (exponea) {
    exponea.identify(email.toLowerCase().trim(), undefined, undefined, undefined, true, callback);
  }
};

export const anonymizeExponeaUser = (callback: Function) => {
  const exponea = (window as any)?.exponea;
  if (exponea) {
    exponea.anonymize(callback);
  }
};
