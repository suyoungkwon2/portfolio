(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,76740,e=>{"use strict";var t=e.i(43476),i=e.i(46932),r=e.i(57688),o=e.i(22016),a=e.i(92207),s=e.i(71645),n=e.i(75157);let l=["type","domain","proof"];function u({chips:e,className:i}){let r=`goo-${(0,s.useId)().replace(/:/g,"")}`,o="rounded-full px-2.5 py-1 text-xs font-medium leading-none";return(0,t.jsxs)("div",{className:(0,n.cn)("grid w-fit",i),children:[(0,t.jsx)("svg",{"aria-hidden":!0,className:"absolute h-0 w-0",children:(0,t.jsxs)("filter",{id:r,children:[(0,t.jsx)("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"3",result:"blur"}),(0,t.jsx)("feColorMatrix",{in:"blur",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"})]})}),(0,t.jsx)("div",{"aria-hidden":!0,className:"col-start-1 row-start-1 flex gap-[3px]",style:{filter:`url(#${r})`},children:l.map(i=>(0,t.jsx)("span",{className:(0,n.cn)(o,"bg-paper-2 text-transparent"),children:e[i]},i))}),(0,t.jsx)("ul",{className:"relative col-start-1 row-start-1 flex gap-[3px]",children:l.map(i=>(0,t.jsx)("li",{className:(0,n.cn)(o,"text-ink"),children:e[i]},i))})]})}let c=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,h=8294400;class d{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=(function(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")})();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(e,t,i,r,o=0,a=0,s=2,n=h,l=[]){if(e?.nodeType===1)this.parentElement=e;else throw Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const e=this.ownerDocument.createElement("style");e.innerHTML=m,e.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(e)}const u=this.ownerDocument.createElement("canvas");this.canvasElement=u,this.parentElement.prepend(u),this.fragmentShader=t,this.providedUniforms=i,this.mipmaps=l,this.currentFrame=a,this.minPixelRatio=s,this.maxPixelCount=n;const c=u.getContext("webgl2",r);if(!c)throw Error("Paper Shaders: WebGL is not supported in this browser");this.gl=c,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(o),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let e=function(e,t,i){let r=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),o=r?r.precision:null;o&&o<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let a=f(e,e.VERTEX_SHADER,t),s=f(e,e.FRAGMENT_SHADER,i);if(!a||!s)return null;let n=e.createProgram();return n?(e.attachShader(n,a),e.attachShader(n,s),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS))?(e.detachShader(n,a),e.detachShader(n,s),e.deleteShader(a),e.deleteShader(s),n):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(n)),e.deleteProgram(n),e.deleteShader(a),e.deleteShader(s),null):null}(this.gl,c,this.fragmentShader);e&&(this.program=e)};setupPositionAttribute=()=>{let e=this.gl.getAttribLocation(this.program,"a_position"),t=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([t,i])=>{if(e[t]=this.gl.getUniformLocation(this.program,t),i instanceof HTMLImageElement){let i=`${t}AspectRatio`;e[i]=this.gl.getUniformLocation(this.program,i)}}),this.uniformLocations=e};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([e])=>{if(e?.borderBoxSize[0]){let t=e.devicePixelContentBoxSize?.[0];void 0!==t&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=t.inlineSize,this.parentDevicePixelHeight=t.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let e=this.ownerDocument.defaultView;e?.IntersectionObserver&&(this.intersectionObserver=new e.IntersectionObserver(([e])=>{this.isInViewport=e?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let e=0,t=0,i=Math.max(1,window.devicePixelRatio),r=visualViewport?.scale??1;if(this.devicePixelsSupported){let o=Math.max(1,this.minPixelRatio/i);e=this.parentDevicePixelWidth*o*r,t=this.parentDevicePixelHeight*o*r}else{var o;let a,s,n=Math.max(i,this.minPixelRatio)*r;this.isSafari&&(n*=Math.max(1,(o=this.ownerDocument,(s=Math.round(100*(a=outerWidth/((visualViewport?.scale??1)*(visualViewport?.width??window.innerWidth)+(window.innerWidth-o.documentElement.clientWidth)))))%5==0?s/100:33===s?1/3:67===s?2/3:133===s?4/3:a))),e=Math.round(this.parentWidth)*n,t=Math.round(this.parentHeight)*n}let a=Math.min(1,Math.sqrt(this.maxPixelCount)/Math.sqrt(e*t)),s=Math.round(e*a),n=Math.round(t*a),l=s/Math.round(this.parentWidth);(this.canvasElement.width!==s||this.canvasElement.height!==n||this.renderScale!==l)&&(this.renderScale=l,this.canvasElement.width=s,this.canvasElement.height=n,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=e=>{if(this.hasBeenDisposed)return;if(null===this.program)return void console.warn("Tried to render before program or gl was initialized");let t=e-this.lastRenderTime;this.lastRenderTime=e,0!==this.currentSpeed&&(this.currentFrame+=t*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,.001*this.currentFrame),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),0!==this.currentSpeed?this.requestRender():this.rafId=null};requestRender=()=>{null!==this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(e,t)=>{if(!t.complete||0===t.naturalWidth)throw Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);let i=this.textures.get(e);i&&this.gl.deleteTexture(i),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);let r=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+r);let o=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,o),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,t),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let a=this.gl.getError();if(a!==this.gl.NO_ERROR||null===o)return void console.error("Paper Shaders: WebGL error when uploading texture:",a);this.textures.set(e,o);let s=this.uniformLocations[e];if(s){this.gl.uniform1i(s,r);let i=`${e}AspectRatio`,o=this.uniformLocations[i];if(o){let e=t.naturalWidth/t.naturalHeight;this.gl.uniform1f(o,e)}}};areUniformValuesEqual=(e,t)=>e===t||!!(Array.isArray(e)&&Array.isArray(t))&&e.length===t.length&&e.every((e,i)=>this.areUniformValuesEqual(e,t[i]));setUniformValues=e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([e,t])=>{let i=t;if(t instanceof HTMLImageElement&&(i=`${t.src.slice(0,200)}|${t.naturalWidth}x${t.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[e],i))return;this.uniformCache[e]=i;let r=this.uniformLocations[e];if(!r)return void console.warn(`Uniform location for ${e} not found`);if(t instanceof HTMLImageElement)this.setTextureUniform(e,t);else if(Array.isArray(t)){let i=null,o=null;if(void 0!==t[0]&&Array.isArray(t[0])){let r=t[0].length;if(!t.every(e=>e.length===r))return void console.warn(`All child arrays must be the same length for ${e}`);i=t.flat(),o=r}else o=(i=t).length;switch(o){case 2:this.gl.uniform2fv(r,i);break;case 3:this.gl.uniform3fv(r,i);break;case 4:this.gl.uniform4fv(r,i);break;case 9:this.gl.uniformMatrix3fv(r,!1,i);break;case 16:this.gl.uniformMatrix4fv(r,!1,i);break;default:console.warn(`Unsupported uniform array length: ${o}`)}}else"number"==typeof t?this.gl.uniform1f(r,t):"boolean"==typeof t?this.gl.uniform1i(r,+!!t):console.warn(`Unsupported uniform type for ${e}: ${typeof t}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(e=1)=>{this.speed=e,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=e=>{this.currentSpeed=e,null===this.rafId&&0!==e&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),null!==this.rafId&&0===e&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(e=h)=>{this.maxPixelCount=e,this.handleResize()};setMinPixelRatio=(e=2)=>{this.minPixelRatio=e,this.handleResize()};setUniforms=e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,null!==this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}}function f(e,t,i){let r=e.createShader(t);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))?r:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(r)),e.deleteShader(r),null):null}let m=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function p(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function g(e){let t={},i=[];return Object.entries(e).forEach(([e,r])=>{if("string"==typeof r){let o=r||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";if(!(e=>{try{if(e.startsWith("/"))return!0;return new URL(e),!0}catch{return!1}})(o))return void console.warn(`Uniform "${e}" has invalid URL "${o}". Skipping image loading.`);let a=new Promise((i,r)=>{let a=new Image;(e=>{try{if(e.startsWith("/"))return!1;return new URL(e,window.location.origin).origin!==window.location.origin}catch{return!1}})(o)&&(a.crossOrigin="anonymous"),a.onload=()=>{p(a),t[e]=a,i()},a.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${o}`),r()},a.src=o});i.push(a)}else if(r instanceof HTMLImageElement){let o=r.decode().then(()=>{p(r),t[e]=r});i.push(o)}else t[e]=r}),await Promise.all(i),t}let v=(0,s.forwardRef)(function({fragmentShader:e,uniforms:i,webGlContextAttributes:r,speed:o=0,frame:a=0,width:n,height:l,minPixelRatio:u,maxPixelCount:c,mipmaps:h,style:f,...m},p){var v;let x,_,[b,w]=(0,s.useState)(!1),S=(0,s.useRef)(null),y=(0,s.useRef)(null),R=(0,s.useRef)(r);(0,s.useEffect)(()=>((async()=>{let t=await g(i);S.current&&!y.current&&(y.current=new d(S.current,e,t,R.current,o,a,u,c,h),w(!0))})(),()=>{y.current?.dispose(),y.current=null}),[e]),(0,s.useEffect)(()=>{let e=!1;return(async()=>{let t=await g(i);e||y.current?.setUniforms(t)})(),()=>{e=!0}},[i,b]),(0,s.useEffect)(()=>{y.current?.setSpeed(o)},[o,b]),(0,s.useEffect)(()=>{y.current?.setMaxPixelCount(c)},[c,b]),(0,s.useEffect)(()=>{y.current?.setMinPixelRatio(u)},[u,b]),(0,s.useEffect)(()=>{y.current?.setFrame(a)},[a,b]);let E=(v=[S,p],x=s.useRef(void 0),_=s.useCallback(e=>{let t=v.map(t=>{if(null!=t){if("function"==typeof t){let i=t(e);return"function"==typeof i?i:()=>{t(null)}}return t.current=e,()=>{t.current=null}}});return()=>{t.forEach(e=>e?.())}},v),s.useMemo(()=>v.every(e=>null==e)?null:e=>{x.current&&(x.current(),x.current=void 0),null!=e&&(x.current=_(e))},v));return(0,t.jsx)("div",{ref:E,style:void 0!==n||void 0!==l?{width:"string"==typeof n&&!1===isNaN(+n)?+n:n,height:"string"==typeof l&&!1===isNaN(+l)?+l:l,...f}:f,...m})});v.displayName="ShaderMount";let x={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},_={none:0,contain:1,cover:2};function b(e){if(Array.isArray(e))return 4===e.length?e:3===e.length?[...e,1]:S;if("string"!=typeof e)return S;let t,i,r,o=1;if(e.startsWith("#")){var a;(3===(a=(a=e).replace(/^#/,"")).length||4===a.length)&&(a=a.split("").map(e=>e+e).join("")),6===a.length&&(a+="ff"),[t,i,r,o]=/^[0-9a-f]{8}$/i.test(a)?[parseInt(a.slice(0,2),16)/255,parseInt(a.slice(2,4),16)/255,parseInt(a.slice(4,6),16)/255,parseInt(a.slice(6,8),16)/255]:(console.warn("Invalid hex color"),S)}else if(e.startsWith("rgb")){let a,s=(a=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(a[1]??"0")/255,parseInt(a[2]??"0")/255,parseInt(a[3]??"0")/255,void 0===a[4]?1:parseFloat(a[4])]:null;if(null===s)return S;[t,i,r,o]=s}else{let a;if(!e.startsWith("hsl"))return console.error("Unsupported color format",e),S;let s=(a=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(a[1]??"0"),parseInt(a[2]??"0"),parseInt(a[3]??"0"),void 0===a[4]?1:parseFloat(a[4])]:null;if(null===s)return S;[t,i,r,o]=function(e){let t,i,r,[o,a,s,n]=e,l=o/360,u=a/100,c=s/100;if(0===a)t=i=r=c;else{let e=(e,t,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6)?e+(t-e)*6*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e,o=c<.5?c*(1+u):c+u-c*u,a=2*c-o;t=e(a,o,l+1/3),i=e(a,o,l),r=e(a,o,l-1/3)}return[t,i,r,n]}(s)}return[w(t,0,1),w(i,0,1),w(r,0,1),w(o,0,1)]}let w=(e,t,i)=>Math.min(Math.max(e,t),i),S=[.5,.5,.5,1],y=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,R=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,E=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`,U=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[10];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${y}
${R}
${E}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = v_objectUV;
  uv += .5;
  vec2 grainUV = uv * 1000.;

  float mixerGrain = 0.;
  if (u_grainMixer > 0.) {
    mixerGrain = .4 * u_grainMixer * (noise(grainUV, vec2(0.)) - .5);
  }

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time + firstFrameOffset);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec2 uvRotated = uv;
  uvRotated -= vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < 10; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, t) + mixerGrain;
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);

    dist = pow(dist, 3.5);
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  if (u_grainOverlay > 0.) {
    float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
    grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
    grainOverlay = pow(grainOverlay, 1.3);

    float grainOverlayV = grainOverlay * 2. - 1.;
    vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
    float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
    grainOverlayStrength = pow(grainOverlayStrength, .8);
    color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

    opacity += .5 * grainOverlayStrength;
  }
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,A={name:"Default",params:{...x,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},B=(0,s.memo)(function({speed:e=A.params.speed,frame:i=A.params.frame,colors:r=A.params.colors,distortion:o=A.params.distortion,swirl:a=A.params.swirl,grainMixer:s=A.params.grainMixer,grainOverlay:n=A.params.grainOverlay,fit:l=A.params.fit,rotation:u=A.params.rotation,scale:c=A.params.scale,originX:h=A.params.originX,originY:d=A.params.originY,offsetX:f=A.params.offsetX,offsetY:m=A.params.offsetY,worldWidth:p=A.params.worldWidth,worldHeight:g=A.params.worldHeight,...x}){let w={u_colors:r.map(b),u_colorsCount:r.length,u_distortion:o,u_swirl:a,u_grainMixer:s,u_grainOverlay:n,u_fit:_[l],u_rotation:u,u_scale:c,u_offsetX:f,u_offsetY:m,u_originX:h,u_originY:d,u_worldWidth:p,u_worldHeight:g};return(0,t.jsx)(v,{...x,speed:e,frame:i,fragmentShader:U,uniforms:w})},function(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let i in e){if("colors"===i){let i=Array.isArray(e.colors),r=Array.isArray(t.colors);if(!i||!r){if(!1===Object.is(e.colors,t.colors))return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((e,i)=>e===t.colors?.[i]))return!1;continue}if(!1===Object.is(e[i],t[i]))return!1}return!0});function z(e,t){let i=0x811c9dc5^t;for(let t=0;t<e.length;t++)i=Math.imul(i^e.charCodeAt(t),0x1000193);return(i>>>0)/0x100000000}function O({colors:e,mesh:i,seed:r="",className:o}){let[a,n]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)"),t=()=>n(e.matches);return t(),e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]),(0,t.jsx)("div",{className:o,style:{backgroundImage:`linear-gradient(135deg, ${e.join(", ")})`},children:(0,t.jsx)(B,{colors:e,distortion:i?.distortion??.7,swirl:i?.swirl??.2,offsetY:i?.offsetY??0,frame:1e5*z(r,1),speed:a?0:.45*(.8+.4*z(r,2)),className:"h-full w-full"})})}let V={"AI Research":"from-accent-soft via-accent-soft/40 to-transparent",Projects:"from-accent-2-soft via-accent-2-soft/40 to-transparent"};e.s(["WorkCard",0,function({work:e,index:s}){return(0,t.jsx)(i.motion.div,{initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5,delay:s%2*.08,ease:"easeOut"},children:(0,t.jsxs)(o.default,{href:`/work/${e.slug}`,className:"group block",children:[e.video&&"full"===e.videoLayout?(0,t.jsx)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg bg-line",children:(0,t.jsx)("video",{src:e.video,poster:e.videoPoster,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})}):e.video?(0,t.jsxs)("div",{className:"relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-[#E1E6E9] py-3",children:[e.gradient&&(0,t.jsx)(O,{colors:e.gradient,seed:e.slug,className:"absolute inset-0"}),(0,t.jsx)("div",{className:"relative aspect-[440/340] h-full overflow-hidden rounded-[7.5px] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]",children:(0,t.jsx)("video",{src:e.video,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"absolute -left-[2px] top-0 h-full w-[calc(100%+4px)] max-w-none object-cover"})})]}):e.gradient?(0,t.jsxs)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg",children:[(0,t.jsx)(O,{colors:e.gradient,mesh:e.mesh,seed:e.slug,className:"absolute inset-0"}),e.thumbnail&&(0,t.jsx)(r.default,{src:e.thumbnail,alt:"",fill:!0,sizes:"(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw",className:"object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})]}):e.thumbnail?(0,t.jsx)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg bg-ink",children:(0,t.jsx)(r.default,{src:e.thumbnail,alt:"",fill:!0,sizes:"(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw",className:"object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})}):(0,t.jsx)("div",{className:"aspect-[16/10] overflow-hidden rounded-lg bg-ink",children:(0,t.jsx)("div",{className:`h-full w-full bg-gradient-to-br ${V[e.sector]} transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]`})}),(0,t.jsxs)("div",{className:"mt-4 flex flex-col gap-1",children:[(0,t.jsx)(u,{chips:a.projects[e.slug].chips,className:"mb-2"}),(0,t.jsx)("h3",{className:"font-display text-xl font-medium text-ink",children:e.title}),e.metrics&&(0,t.jsx)("p",{className:"text-sm font-medium text-accent",children:e.metrics})]})]})})}],76740)}]);