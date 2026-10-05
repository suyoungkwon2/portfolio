(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,32177,e=>{"use strict";var t=e.i(43476),i=e.i(57688),r=e.i(71645),a=e.i(46932),s=e.i(71164),o=e.i(38544);function n(){s.hasReducedMotionListener.current||(0,o.initPrefersReducedMotion)();let[e]=(0,r.useState)(s.prefersReducedMotion.current);return e}var l=e.i(75157),c=e.i(20266);let u=[{field:"B2B AI SaaS",org:"Asleep",value:"$60K+ {MRR}",label:"First B2B revenue line,\nbuilt 0 → 1 at a sleep-tech startup"},{field:"Digital Health",org:"Asleep",value:"K-FDA {Approved}",label:"Clinical trial for\nan insomnia digital therapeutic app"},{field:"AI Search",org:"Kurly",value:"$3.5M+ {/mo}",label:"Revenue recovered from\nno-result searches, 3.5M MAU"},{field:"AI Research",org:"CMU LTI",value:"EMNLP 2025",label:"Main Conference paper,\nco‑first author"}],h=[{title:"Product Manager",src:"/images/img_hero_2productmanager.jpg"},{title:"UX Designer",src:"/images/img_hero_3UXdesigner.jpg"},{title:"HCI Researcher",src:"/images/img_hero_4HCIresearcher.jpg"},{title:"MDes @ CMU",src:"/images/img_hero_5mastercmu.jpg"}],d=[-5,3,-3,4],m=[10,0,4,2],f=[{x:0,y:0,r:0},{x:14,y:6,r:4},{x:26,y:10,r:7},{x:36,y:15,r:10}];function p({value:e}){return e.split(/\{(.*?)\}/).map((e,i)=>i%2==1?(0,t.jsx)("span",{className:"ml-0.5 text-[0.55em] font-medium tracking-normal",children:e},i):e)}function g({spread:e,onSpread:s}){let o,c,u,p,v,x,_,b,y,w,R=(0,r.useRef)(null),S=(0,r.useRef)([]),{width:E,resizing:U}=function(e){let[t,i]=(0,r.useState)(1100),[a,s]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{let t,r=e.current;if(!r||"u"<typeof ResizeObserver)return;let a=!0,o=new ResizeObserver(([e])=>{if(i(e.contentRect.width),a){a=!1;return}s(!0),clearTimeout(t),t=setTimeout(()=>s(!1),200)});return o.observe(r),()=>{o.disconnect(),clearTimeout(t)}},[e]),{width:t,resizing:a}}(R),[A,B]=(0,r.useState)([]),j=n(),{fontSize:z,cardWidth:O,cards:T,height:M}=(o=E>=640?4:2,u=1.6*(c=Math.min(30,Math.max(14,.022*E-6))),v=.03*(p=(E+20*(o-1))/(o+.06)),x=(E-2*v-p)/(o-1),b=u+(_=p/1.7)+.12*p,y=Math.min(230,Math.max(150,.14*E)),w=h.map((e,t)=>{let i=Math.floor(t/o);return{spread:{x:v+t%o*x,y:i*b+u+m[t],width:p,height:_,rotate:d[t]},stacked:{x:f[t].x,y:u+f[t].y,width:y,height:y/1.23,rotate:f[t].r}}}),{fontSize:c,cardWidth:p,cards:w,height:Math.ceil(4===o?b:2*b)});(0,r.useLayoutEffect)(()=>{B(S.current.map(e=>e?.offsetWidth??0))},[z]);let V=t=>j||U?{duration:0}:{type:"spring",stiffness:110,damping:19,mass:.9,delay:e?.06*t:0};return(0,t.jsx)("div",{ref:R,"aria-hidden":!0,className:"relative",style:{height:M},children:h.map((r,o)=>{let n=(O-(A[o]??0))/2;return(0,t.jsxs)(a.motion.div,{initial:!1,animate:e?T[o].spread:T[o].stacked,whileHover:e?{scale:1.04}:void 0,transition:{...V(o),scale:{type:"spring",stiffness:300,damping:24}},style:{zIndex:h.length-o},className:"absolute left-0 top-0",children:[(0,t.jsx)(a.motion.span,{ref:e=>{S.current[o]=e},initial:!1,animate:0===o?{x:e?n:0}:{x:n,opacity:+!!e},transition:0===o?V(o):{x:{duration:0},opacity:j?{duration:0}:{duration:.7,ease:"easeOut",delay:e?.35+.1*o:0}},style:{fontSize:z,marginBottom:.25*z},className:"font-manrope absolute bottom-full left-0 whitespace-nowrap font-semibold leading-[1.3] tracking-[-0.02em] text-ink",children:r.title}),(0,t.jsx)("button",{type:"button",tabIndex:-1,onClick:s,className:(0,l.cn)("absolute inset-0 overflow-hidden bg-paper-2 shadow-[0_2px_14px_rgba(0,0,0,0.10)]",e?"cursor-default":"cursor-pointer"),children:(0,t.jsx)(i.default,{src:r.src,alt:"",fill:!0,priority:0===o,sizes:"(min-width: 1024px) 28vw, 55vw",className:"object-cover brightness-[1.08] contrast-[0.88] saturate-[0.85]"})})]},r.src)})})}e.s(["Hero",0,function({children:e}){let[i,s]=function(){let[e,t]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let e=()=>{t(!0),clearTimeout(i),window.removeEventListener("scroll",e)},i=setTimeout(e,300);return window.addEventListener("scroll",e,{passive:!0}),()=>{clearTimeout(i),window.removeEventListener("scroll",e)}},[]),[e,()=>t(!0)]}(),o=n(),d={initial:!1,animate:{opacity:+!!i,y:i?0:-12},transition:o?{duration:0}:{duration:.5,ease:"easeOut",delay:.35*!!i}};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("section",{id:"hero",className:"flex flex-col px-6 pb-10 pt-12 md:px-10 md:pt-16",children:[(0,t.jsxs)("h1",{className:c.heroTitleClass,children:["I’m Mel,",(0,t.jsxs)("span",{className:"sr-only",children:[" ",h.map(e=>e.title).join(", ")]})]}),(0,t.jsx)("div",{className:"mt-2",children:(0,t.jsx)(g,{spread:i,onSpread:s})}),(0,t.jsxs)(a.motion.div,{...d,className:(0,l.cn)(!i&&"pointer-events-none"),children:[(0,t.jsxs)("p",{className:"font-manrope mt-10 text-[22px] font-medium leading-[1.32] tracking-[-0.02em] text-ink md:text-[32px]",children:["I design & ship B2C/B2B/AI products"," ",(0,t.jsx)("br",{className:"hidden md:inline"}),"for startups and tech companies"," ",(0,t.jsx)("br",{className:"hidden md:inline"}),"toward positive social impact"]}),(0,t.jsx)("div",{className:"mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0",children:u.map((e,i)=>(0,t.jsxs)("div",{className:(0,l.cn)("xl:px-6",0===i?"xl:pl-0":"xl:border-l xl:border-ink/15"),children:[(0,t.jsxs)("p",{className:"flex items-baseline gap-2 text-[13px] text-ink",children:[e.field,(0,t.jsxs)("span",{className:"font-manrope text-[13px] font-medium text-ink-muted",children:["@ ",e.org]})]}),(0,t.jsx)("p",{className:"font-manrope mt-3 whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[30px]",children:(0,t.jsx)(p,{value:e.value})}),(0,t.jsx)("p",{className:"mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-muted lg:max-w-none",children:e.label.split("\n").map((e,i)=>(0,t.jsxs)(r.Fragment,{children:[i>0&&(0,t.jsxs)(t.Fragment,{children:[" ",(0,t.jsx)("br",{className:"hidden lg:inline"})]}),e]},e))})]},e.value))})]})]}),e&&(0,t.jsx)(a.motion.div,{initial:!1,animate:{opacity:+!!i,y:i?0:-12},transition:o?{duration:0}:{duration:.6,ease:"easeOut",delay:.55*!!i},className:(0,l.cn)(!i&&"pointer-events-none"),children:e})]})}],32177)},20266,e=>{"use strict";var t=e.i(43476),i=e.i(75157);e.s(["PageTitle",0,function({children:e,className:r}){return(0,t.jsx)("h1",{className:(0,i.cn)("font-manrope text-[28px] font-semibold leading-[1.25] tracking-[-0.025em] text-ink md:text-[36px]",r),children:e})},"heroTitleClass",0,"font-manrope text-[38px] font-semibold leading-[1.3] tracking-[-0.03em] text-ink md:text-[52px] lg:text-[calc(var(--f)*4.6)]","sectionTitleClass",0,"font-manrope text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl"])},76740,e=>{"use strict";var t=e.i(43476),i=e.i(46932),r=e.i(57688),a=e.i(22016),s=e.i(92207),o=e.i(71645),n=e.i(75157);let l=["type","domain","proof"];function c({chips:e,className:i}){let r=`goo-${(0,o.useId)().replace(/:/g,"")}`,a="rounded-full px-2.5 py-1 text-xs font-medium leading-none";return(0,t.jsxs)("div",{className:(0,n.cn)("grid w-fit",i),children:[(0,t.jsx)("svg",{"aria-hidden":!0,className:"absolute h-0 w-0",children:(0,t.jsxs)("filter",{id:r,children:[(0,t.jsx)("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"3",result:"blur"}),(0,t.jsx)("feColorMatrix",{in:"blur",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"})]})}),(0,t.jsx)("div",{"aria-hidden":!0,className:"col-start-1 row-start-1 flex gap-[3px]",style:{filter:`url(#${r})`},children:l.map(i=>(0,t.jsx)("span",{className:(0,n.cn)(a,"bg-paper-2 text-transparent"),children:e[i]},i))}),(0,t.jsx)("ul",{className:"relative col-start-1 row-start-1 flex gap-[3px]",children:l.map(i=>(0,t.jsx)("li",{className:(0,n.cn)(a,"text-ink"),children:e[i]},i))})]})}let u=`#version 300 es
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
}`,h=8294400;class d{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=(function(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")})();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(e,t,i,r,a=0,s=0,o=2,n=h,l=[]){if(e?.nodeType===1)this.parentElement=e;else throw Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const e=this.ownerDocument.createElement("style");e.innerHTML=f,e.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(e)}const c=this.ownerDocument.createElement("canvas");this.canvasElement=c,this.parentElement.prepend(c),this.fragmentShader=t,this.providedUniforms=i,this.mipmaps=l,this.currentFrame=s,this.minPixelRatio=o,this.maxPixelCount=n;const u=c.getContext("webgl2",r);if(!u)throw Error("Paper Shaders: WebGL is not supported in this browser");this.gl=u,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(a),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let e=function(e,t,i){let r=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),a=r?r.precision:null;a&&a<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let s=m(e,e.VERTEX_SHADER,t),o=m(e,e.FRAGMENT_SHADER,i);if(!s||!o)return null;let n=e.createProgram();return n?(e.attachShader(n,s),e.attachShader(n,o),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS))?(e.detachShader(n,s),e.detachShader(n,o),e.deleteShader(s),e.deleteShader(o),n):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(n)),e.deleteProgram(n),e.deleteShader(s),e.deleteShader(o),null):null}(this.gl,u,this.fragmentShader);e&&(this.program=e)};setupPositionAttribute=()=>{let e=this.gl.getAttribLocation(this.program,"a_position"),t=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([t,i])=>{if(e[t]=this.gl.getUniformLocation(this.program,t),i instanceof HTMLImageElement){let i=`${t}AspectRatio`;e[i]=this.gl.getUniformLocation(this.program,i)}}),this.uniformLocations=e};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([e])=>{if(e?.borderBoxSize[0]){let t=e.devicePixelContentBoxSize?.[0];void 0!==t&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=t.inlineSize,this.parentDevicePixelHeight=t.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let e=this.ownerDocument.defaultView;e?.IntersectionObserver&&(this.intersectionObserver=new e.IntersectionObserver(([e])=>{this.isInViewport=e?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let e=0,t=0,i=Math.max(1,window.devicePixelRatio),r=visualViewport?.scale??1;if(this.devicePixelsSupported){let a=Math.max(1,this.minPixelRatio/i);e=this.parentDevicePixelWidth*a*r,t=this.parentDevicePixelHeight*a*r}else{var a;let s,o,n=Math.max(i,this.minPixelRatio)*r;this.isSafari&&(n*=Math.max(1,(a=this.ownerDocument,(o=Math.round(100*(s=outerWidth/((visualViewport?.scale??1)*(visualViewport?.width??window.innerWidth)+(window.innerWidth-a.documentElement.clientWidth)))))%5==0?o/100:33===o?1/3:67===o?2/3:133===o?4/3:s))),e=Math.round(this.parentWidth)*n,t=Math.round(this.parentHeight)*n}let s=Math.min(1,Math.sqrt(this.maxPixelCount)/Math.sqrt(e*t)),o=Math.round(e*s),n=Math.round(t*s),l=o/Math.round(this.parentWidth);(this.canvasElement.width!==o||this.canvasElement.height!==n||this.renderScale!==l)&&(this.renderScale=l,this.canvasElement.width=o,this.canvasElement.height=n,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=e=>{if(this.hasBeenDisposed)return;if(null===this.program)return void console.warn("Tried to render before program or gl was initialized");let t=e-this.lastRenderTime;this.lastRenderTime=e,0!==this.currentSpeed&&(this.currentFrame+=t*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,.001*this.currentFrame),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),0!==this.currentSpeed?this.requestRender():this.rafId=null};requestRender=()=>{null!==this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(e,t)=>{if(!t.complete||0===t.naturalWidth)throw Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);let i=this.textures.get(e);i&&this.gl.deleteTexture(i),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);let r=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+r);let a=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,a),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,t),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||null===a)return void console.error("Paper Shaders: WebGL error when uploading texture:",s);this.textures.set(e,a);let o=this.uniformLocations[e];if(o){this.gl.uniform1i(o,r);let i=`${e}AspectRatio`,a=this.uniformLocations[i];if(a){let e=t.naturalWidth/t.naturalHeight;this.gl.uniform1f(a,e)}}};areUniformValuesEqual=(e,t)=>e===t||!!(Array.isArray(e)&&Array.isArray(t))&&e.length===t.length&&e.every((e,i)=>this.areUniformValuesEqual(e,t[i]));setUniformValues=e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([e,t])=>{let i=t;if(t instanceof HTMLImageElement&&(i=`${t.src.slice(0,200)}|${t.naturalWidth}x${t.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[e],i))return;this.uniformCache[e]=i;let r=this.uniformLocations[e];if(!r)return void console.warn(`Uniform location for ${e} not found`);if(t instanceof HTMLImageElement)this.setTextureUniform(e,t);else if(Array.isArray(t)){let i=null,a=null;if(void 0!==t[0]&&Array.isArray(t[0])){let r=t[0].length;if(!t.every(e=>e.length===r))return void console.warn(`All child arrays must be the same length for ${e}`);i=t.flat(),a=r}else a=(i=t).length;switch(a){case 2:this.gl.uniform2fv(r,i);break;case 3:this.gl.uniform3fv(r,i);break;case 4:this.gl.uniform4fv(r,i);break;case 9:this.gl.uniformMatrix3fv(r,!1,i);break;case 16:this.gl.uniformMatrix4fv(r,!1,i);break;default:console.warn(`Unsupported uniform array length: ${a}`)}}else"number"==typeof t?this.gl.uniform1f(r,t):"boolean"==typeof t?this.gl.uniform1i(r,+!!t):console.warn(`Unsupported uniform type for ${e}: ${typeof t}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(e=1)=>{this.speed=e,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=e=>{this.currentSpeed=e,null===this.rafId&&0!==e&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),null!==this.rafId&&0===e&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(e=h)=>{this.maxPixelCount=e,this.handleResize()};setMinPixelRatio=(e=2)=>{this.minPixelRatio=e,this.handleResize()};setUniforms=e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,null!==this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}}function m(e,t,i){let r=e.createShader(t);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))?r:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(r)),e.deleteShader(r),null):null}let f=`@layer paper-shaders {
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
}`;function p(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function g(e){let t={},i=[];return Object.entries(e).forEach(([e,r])=>{if("string"==typeof r){let a=r||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";if(!(e=>{try{if(e.startsWith("/"))return!0;return new URL(e),!0}catch{return!1}})(a))return void console.warn(`Uniform "${e}" has invalid URL "${a}". Skipping image loading.`);let s=new Promise((i,r)=>{let s=new Image;(e=>{try{if(e.startsWith("/"))return!1;return new URL(e,window.location.origin).origin!==window.location.origin}catch{return!1}})(a)&&(s.crossOrigin="anonymous"),s.onload=()=>{p(s),t[e]=s,i()},s.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${a}`),r()},s.src=a});i.push(s)}else if(r instanceof HTMLImageElement){let a=r.decode().then(()=>{p(r),t[e]=r});i.push(a)}else t[e]=r}),await Promise.all(i),t}let v=(0,o.forwardRef)(function({fragmentShader:e,uniforms:i,webGlContextAttributes:r,speed:a=0,frame:s=0,width:n,height:l,minPixelRatio:c,maxPixelCount:u,mipmaps:h,style:m,...f},p){var v;let x,_,[b,y]=(0,o.useState)(!1),w=(0,o.useRef)(null),R=(0,o.useRef)(null),S=(0,o.useRef)(r);(0,o.useEffect)(()=>((async()=>{let t=await g(i);w.current&&!R.current&&(R.current=new d(w.current,e,t,S.current,a,s,c,u,h),y(!0))})(),()=>{R.current?.dispose(),R.current=null}),[e]),(0,o.useEffect)(()=>{let e=!1;return(async()=>{let t=await g(i);e||R.current?.setUniforms(t)})(),()=>{e=!0}},[i,b]),(0,o.useEffect)(()=>{R.current?.setSpeed(a)},[a,b]),(0,o.useEffect)(()=>{R.current?.setMaxPixelCount(u)},[u,b]),(0,o.useEffect)(()=>{R.current?.setMinPixelRatio(c)},[c,b]),(0,o.useEffect)(()=>{R.current?.setFrame(s)},[s,b]);let E=(v=[w,p],x=o.useRef(void 0),_=o.useCallback(e=>{let t=v.map(t=>{if(null!=t){if("function"==typeof t){let i=t(e);return"function"==typeof i?i:()=>{t(null)}}return t.current=e,()=>{t.current=null}}});return()=>{t.forEach(e=>e?.())}},v),o.useMemo(()=>v.every(e=>null==e)?null:e=>{x.current&&(x.current(),x.current=void 0),null!=e&&(x.current=_(e))},v));return(0,t.jsx)("div",{ref:E,style:void 0!==n||void 0!==l?{width:"string"==typeof n&&!1===isNaN(+n)?+n:n,height:"string"==typeof l&&!1===isNaN(+l)?+l:l,...m}:m,...f})});v.displayName="ShaderMount";let x={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},_={none:0,contain:1,cover:2};function b(e){if(Array.isArray(e))return 4===e.length?e:3===e.length?[...e,1]:w;if("string"!=typeof e)return w;let t,i,r,a=1;if(e.startsWith("#")){var s;(3===(s=(s=e).replace(/^#/,"")).length||4===s.length)&&(s=s.split("").map(e=>e+e).join("")),6===s.length&&(s+="ff"),[t,i,r,a]=/^[0-9a-f]{8}$/i.test(s)?[parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255,parseInt(s.slice(6,8),16)/255]:(console.warn("Invalid hex color"),w)}else if(e.startsWith("rgb")){let s,o=(s=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(s[1]??"0")/255,parseInt(s[2]??"0")/255,parseInt(s[3]??"0")/255,void 0===s[4]?1:parseFloat(s[4])]:null;if(null===o)return w;[t,i,r,a]=o}else{let s;if(!e.startsWith("hsl"))return console.error("Unsupported color format",e),w;let o=(s=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(s[1]??"0"),parseInt(s[2]??"0"),parseInt(s[3]??"0"),void 0===s[4]?1:parseFloat(s[4])]:null;if(null===o)return w;[t,i,r,a]=function(e){let t,i,r,[a,s,o,n]=e,l=a/360,c=s/100,u=o/100;if(0===s)t=i=r=u;else{let e=(e,t,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6)?e+(t-e)*6*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e,a=u<.5?u*(1+c):u+c-u*c,s=2*u-a;t=e(s,a,l+1/3),i=e(s,a,l),r=e(s,a,l-1/3)}return[t,i,r,n]}(o)}return[y(t,0,1),y(i,0,1),y(r,0,1),y(a,0,1)]}let y=(e,t,i)=>Math.min(Math.max(e,t),i),w=[.5,.5,.5,1],R=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,S=`
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

${R}
${S}
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
`,A={name:"Default",params:{...x,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},B=(0,o.memo)(function({speed:e=A.params.speed,frame:i=A.params.frame,colors:r=A.params.colors,distortion:a=A.params.distortion,swirl:s=A.params.swirl,grainMixer:o=A.params.grainMixer,grainOverlay:n=A.params.grainOverlay,fit:l=A.params.fit,rotation:c=A.params.rotation,scale:u=A.params.scale,originX:h=A.params.originX,originY:d=A.params.originY,offsetX:m=A.params.offsetX,offsetY:f=A.params.offsetY,worldWidth:p=A.params.worldWidth,worldHeight:g=A.params.worldHeight,...x}){let y={u_colors:r.map(b),u_colorsCount:r.length,u_distortion:a,u_swirl:s,u_grainMixer:o,u_grainOverlay:n,u_fit:_[l],u_rotation:c,u_scale:u,u_offsetX:m,u_offsetY:f,u_originX:h,u_originY:d,u_worldWidth:p,u_worldHeight:g};return(0,t.jsx)(v,{...x,speed:e,frame:i,fragmentShader:U,uniforms:y})},function(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let i in e){if("colors"===i){let i=Array.isArray(e.colors),r=Array.isArray(t.colors);if(!i||!r){if(!1===Object.is(e.colors,t.colors))return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((e,i)=>e===t.colors?.[i]))return!1;continue}if(!1===Object.is(e[i],t[i]))return!1}return!0});function j(e,t){let i=0x811c9dc5^t;for(let t=0;t<e.length;t++)i=Math.imul(i^e.charCodeAt(t),0x1000193);return(i>>>0)/0x100000000}function z({colors:e,mesh:i,seed:r="",className:a}){let[s,n]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)"),t=()=>n(e.matches);return t(),e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]),(0,t.jsx)("div",{className:a,style:{backgroundImage:`linear-gradient(135deg, ${e.join(", ")})`},children:(0,t.jsx)(B,{colors:e,distortion:i?.distortion??.7,swirl:i?.swirl??.2,offsetY:i?.offsetY??0,frame:1e5*j(r,1),speed:s?0:.45*(.8+.4*j(r,2)),className:"h-full w-full"})})}let O={"AI Research":"from-accent-soft via-accent-soft/40 to-transparent",Projects:"from-accent-2-soft via-accent-2-soft/40 to-transparent"};e.s(["WorkCard",0,function({work:e,index:o}){return(0,t.jsx)(i.motion.div,{initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5,delay:o%2*.08,ease:"easeOut"},children:(0,t.jsxs)(a.default,{href:`/work/${e.slug}`,className:"group block",children:[e.video&&"full"===e.videoLayout?(0,t.jsx)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg bg-line",children:(0,t.jsx)("video",{src:e.video,poster:e.videoPoster,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})}):e.video?(0,t.jsxs)("div",{className:"relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-[#E1E6E9] py-3",children:[e.gradient&&(0,t.jsx)(z,{colors:e.gradient,seed:e.slug,className:"absolute inset-0"}),(0,t.jsx)("div",{className:"relative aspect-[440/340] h-full overflow-hidden rounded-[7.5px] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]",children:(0,t.jsx)("video",{src:e.video,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"absolute -left-[2px] top-0 h-full w-[calc(100%+4px)] max-w-none object-cover"})})]}):e.gradient?(0,t.jsxs)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg",children:[(0,t.jsx)(z,{colors:e.gradient,mesh:e.mesh,seed:e.slug,className:"absolute inset-0"}),e.thumbnail&&(0,t.jsx)(r.default,{src:e.thumbnail,alt:"",fill:!0,sizes:"(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw",className:"object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})]}):e.thumbnail?(0,t.jsx)("div",{className:"relative aspect-[16/10] overflow-hidden rounded-lg bg-ink",children:(0,t.jsx)(r.default,{src:e.thumbnail,alt:"",fill:!0,sizes:"(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw",className:"object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"})}):(0,t.jsx)("div",{className:"aspect-[16/10] overflow-hidden rounded-lg bg-ink",children:(0,t.jsx)("div",{className:`h-full w-full bg-gradient-to-br ${O[e.sector]} transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]`})}),(0,t.jsxs)("div",{className:"mt-4 flex flex-col gap-1",children:[(0,t.jsx)(c,{chips:s.projects[e.slug].chips,className:"mb-2"}),(0,t.jsx)("h3",{className:"font-display text-xl font-medium text-ink",children:e.title}),e.metrics&&(0,t.jsx)("p",{className:"text-sm font-medium text-accent",children:e.metrics})]})]})})}],76740)}]);