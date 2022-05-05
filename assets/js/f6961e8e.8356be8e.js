"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[317],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return g}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(r),g=a,f=d["".concat(l,".").concat(g)]||d[g]||u[g]||s;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,o=new Array(s);o[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var c=2;c<s;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},9943:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return u}});var n=r(7462),a=r(3366),s=(r(7294),r(3905)),o=["components"],i={},l="JavaScript",c={unversionedId:"sdks/javascript",id:"sdks/javascript",title:"JavaScript",description:"JS SDK minified and gzipped size",source:"@site/docs/sdks/javascript.md",sourceDirName:"sdks",slug:"/sdks/javascript",permalink:"/progressively/docs/sdks/javascript",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/sdks/javascript.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Usage with Docker",permalink:"/progressively/docs/get-started/with-docker"},next:{title:"React (server)",permalink:"/progressively/docs/sdks/react-ssr"}},p={},u=[{value:"Installation",id:"installation",level:2},{value:"Loading the flags",id:"loading-the-flags",level:2},{value:"Listening for flag updates",id:"listening-for-flag-updates",level:2},{value:"Usage on your own server",id:"usage-on-your-own-server",level:2},{value:"Passing custom fields",id:"passing-custom-fields",level:2}],d={toc:u};function g(e){var t=e.components,r=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"javascript"},"JavaScript"),(0,s.kt)("p",null,(0,s.kt)("img",{parentName:"p",src:"https://img.shields.io/bundlephobia/minzip/@progressively/sdk-js",alt:"JS SDK minified and gzipped size"})),(0,s.kt)("p",null,"Progressively comes with a JavaScript SDK that used under the hood of the different other framework-specific implementations."),(0,s.kt)("h2",{id:"installation"},"Installation"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @progressively/sdk-js\n")),(0,s.kt)("h2",{id:"loading-the-flags"},"Loading the flags"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-javascript"},'import ProgressivelySdk from "@progressively/sdk-js";\n\nconst sdk = ProgressivelySdk.init(clientKey);\nconst { flags, response } = await sdk.loadFlags();\n')),(0,s.kt)("h2",{id:"listening-for-flag-updates"},"Listening for flag updates"),(0,s.kt)("blockquote",null,(0,s.kt)("p",{parentName:"blockquote"},"\u26a0\ufe0f this only works in the browser")),(0,s.kt)("p",null,"Progressively comes with a websocket subscription for flag changes. You can call the following method of a previously instanciated SDK in order to listen for flag changes:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-javascript"},"sdk.onFlagUpdate(updatedFlags => /* do your things */)\n")),(0,s.kt)("h2",{id:"usage-on-your-own-server"},"Usage on your own server"),(0,s.kt)("p",null,"You may (probably) want to host Progressively on your own server and make sure your client application hits the good apis. In order to do so, you can specify the API and Websocket URL by passing ",(0,s.kt)("inlineCode",{parentName:"p"},"apiUrl")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"websocketUrl")," to the ",(0,s.kt)("inlineCode",{parentName:"p"},"Sdk.init")," call:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-javascript"},'const apiUrl = "https://your-hosting-server";\nconst websocketUrl = "wss://your-hosting-server";\n\nconst sdk = ProgressivelySdk.init(clientKey, { apiUrl, websocketUrl });\n')),(0,s.kt)("h2",{id:"passing-custom-fields"},"Passing custom fields"),(0,s.kt)("p",null,"With Progressively, you can pass extra fields to the server in order to create customized strategies. For instance, you can create a strategy that targets a specific email, let's say: ",(0,s.kt)("inlineCode",{parentName:"p"},"john.doe@gmail.com"),":"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'const sdk = ProgressivelySdk.init(clientKey, {\n  fields: { email: "john.doe@gmail.com" },\n});\n')))}g.isMDXComponent=!0}}]);