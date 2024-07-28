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

import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";
import i18nextConfig from "../next-i18next.config";
import createEmotionCache from "@/utils/createEmotionCache";

export default class Bazaar extends Document<DocumentProps> {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          {/*         <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />*/}
          {/*          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />*/}
          {/*          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />*/}
          {/*          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />*/}
          {/*          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />*/}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <script
            id='exponea'
            dangerouslySetInnerHTML={{
              __html: `
    // The following values (target, token) are overwritten by
    // by values in Channel -> Settings if they are available there (see code below)
    let target = "${process.env.NEXT_PUBLIC_EXPONEA_API_TARGET}";
    let token = "${process.env.NEXT_PUBLIC_EXPONEA_PROJECT_TOKEN}";
    const urlParams = new URLSearchParams(window.location.search);
    let endpoint = null;
    let channel = null;

    let isPreview = false;
    if (urlParams.has('endpoint')) {
      endpoint = urlParams.get('endpoint');
      isPreview = true;
    } else {
      // See if target, token values are specified in Channel->Settings
      // If so, use those
      const urlPathSegments = window.location.pathname.split('/');
      if (urlPathSegments.length > 1) {
        channel = urlPathSegments[1];

        const endpointUrl = "${process.env.NEXT_PUBLIC_BRXM_ENDPOINT}";
        const segments = endpointUrl.split('/');
        if (segments[segments.length - 1] === 'pages') {
          segments[segments.length - 2] = channel;
        } else {
          segments.push(channel, 'pages');
        }
        endpoint = segments.join('/');
      }
    }
    try {
      if (endpoint && (!!channel || isPreview)) {
        console.log("[EXPONEA]", "Endpoint", endpoint);

        let request = new XMLHttpRequest();
        if (urlParams.has('token')) {
          request.setRequestHeader('authorization', 'Bearer ' + urlParams.get('token'));
        }
        request.open('GET', endpoint, false);
        request.send(null);
        
        if (request.status === 200) {
          const data = JSON.parse(request.responseText);

          const props = data?.channel?.info?.props;
          if (props) {
            //console.log("[EXPONEA]", "Channel props", props);
            if (props?.exponeaApiTarget) {
              target = props?.exponeaApiTarget;
            }
            if (props?.exponeaProjectToken) {
              token = props?.exponeaProjectToken;
            }
          }
        }
      }
    } catch (error) {
      console.log("[EXPONEA]", error);
    } finally {

      if (token) {
        // Following script code provided by Exponea
        !function(e,n,t,i,o,r){function a(e){if("number"!=typeof e)return e;var n=new Date;return new Date(n.getTime()+1e3*e)}var s=4e3,c="xnpe_async_hide";function p(e){return e.reduce((function(e,n){return e[n]=function(){e._.push([n.toString(),arguments])},e}),{_:[]})}function m(e,n,t){var i=t.createElement(n);i.src=e;var o=t.getElementsByTagName(n)[0];return o.parentNode.insertBefore(i,o),i}function u(e){return"[object Date]"===Object.prototype.toString.call(e)}r.target=r.target||"//api.exponea.com",r.file_path=r.file_path||r.target+"/js/exponea.min.js",o[n]=p(["anonymize","initialize","identify","getSegments","update","track","trackLink","trackEnhancedEcommerce","getHtml","showHtml","showBanner","showWebLayer","ping","getAbTest","loadDependency","getRecommendation","reloadWebLayers","_preInitialize"]),o[n].notifications=p(["isAvailable","isSubscribed","subscribe","unsubscribe"]),o[n].segments=p(["subscribe"]),o[n]["snippetVersion"]="v2.6.0",function(e,n,t){e[n]["_"+t]={},e[n]["_"+t].nowFn=Date.now,e[n]["_"+t].snippetStartTime=e[n]["_"+t].nowFn()}(o,n,"performance"),function(e,n,t,i,o,r){e[o]={sdk:e[i],sdkObjectName:i,skipExperiments:!!t.new_experiments,sign:t.token+"/"+(r.exec(n.cookie)||["","new"])[1],path:t.target}}(o,e,r,n,i,RegExp("__exponea_etc__"+"=([\\\\w-]+)")),function(e,n,t){m(e.file_path,n,t)}(r,t,e),function(e,n,t,i,o,r,p){if(e.new_experiments){!0===e.new_experiments&&(e.new_experiments={});var l,f=e.new_experiments.hide_class||c,_=e.new_experiments.timeout||s,d=encodeURIComponent(r.location.href.split("#")[0]);e.cookies&&e.cookies.expires&&("number"==typeof e.cookies.expires||u(e.cookies.expires)?l=a(e.cookies.expires):e.cookies.expires.tracking&&("number"==typeof e.cookies.expires.tracking||u(e.cookies.expires.tracking))&&(l=a(e.cookies.expires.tracking))),l&&l<new Date&&(l=void 0);var g=e.target+"/webxp/"+n+"/"+r[t].sign+"/modifications.min.js?http-referer="+d+"&timeout="+_+"ms"+(l?"&cookie-expires="+Math.floor(l.getTime()/1e3):"");"sync"===e.new_experiments.mode&&r.localStorage.getItem("__exponea__sync_modifications__")?function(e,n,t,i,o){t[o][n]="<"+n+' src="'+e+'"></'+n+">",i.writeln(t[o][n]),i.writeln("<"+n+">!"+o+".init && document.writeln("+o+"."+n+'.replace("/'+n+'/", "/'+n+'-async/").replace("><", " async><"))</'+n+">")}(g,n,r,p,t):function(e,n,t,i,o,r,a,s){r.documentElement.classList.add(e);var c=m(t,i,r);function p(){o[s].init||m(t.replace("/"+i+"/","/"+i+"-async/"),i,r)}function u(){r.documentElement.classList.remove(e)}c.onload=p,c.onerror=p,o.setTimeout(u,n),o[a]._revealPage=u}(f,_,g,n,r,p,o,t)}}(r,t,i,0,n,o,e),function(e,n,t){var i;(null===(i=t.experimental)||void 0===i?void 0:i.non_personalized_weblayers)&&e[n]._preInitialize(t),e[n].start=function(i){i&&Object.keys(i).forEach((function(e){return t[e]=i[e]})),e[n].initialize(t)}}(o,n,r)}(document,"exponea","script","webxpClient",window, {        
          target: target,
          token: token,
          //remove sync mode to stop routing to /service-worker.js
          new_experiments: { mode: "sync" },
          //tracking exposed segments
          exposed_segments: {  
            notify: true,  
          },
          track: { activity: true, visits: true },
          // replace with current customer ID or leave commented out for an anonymous customer
          // customer: window.currentUserId,
        });
  
        console.log("[EXPONEA]", "Starting exponea with", target, token);
        exponea.start();
      }
    }
  `,
            }}
          />
          <script
            type="text/javascript"
            src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=RbXbnB"
          ></script>
           <script
            id='klaviyo-sdk'
            dangerouslySetInnerHTML={{
              __html: `
                !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`,
            }}
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
Bazaar.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props) =>
      (
        <CacheProvider value={cache}>
          <App {...props} />
        </CacheProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
