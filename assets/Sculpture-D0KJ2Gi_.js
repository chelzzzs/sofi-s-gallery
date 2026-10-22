import{n as e,r as t,t as n}from"./index-B_AIryzf.js";import{a as r,i,n as a,o,r as s,t as c}from"./Triangle-BWJEykpK.js";import{t as l}from"./Arrow-I1AYJycz.js";var u=t(),d=e(),f=`https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop`,p={bayer:0,noise:1,lines:2},m={atkinson:[[1,0,1/8],[2,0,1/8],[-1,1,1/8],[0,1,1/8],[1,1,1/8],[0,2,1/8]],floyd:[[1,0,7/16],[-1,1,3/16],[0,1,5/16],[1,1,1/16]]},h=.5,g=4,_=1.2,v=1.6,y=1100,b=e=>{let t=String(e||``).replace(`#`,``);t.length===3&&(t=t.replace(/./g,e=>e+e));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[0,0,0]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},x=(e,t,n,r,i)=>{let a=e/t/(n/r);return i?a>1?[a,1]:[1,1/a]:a>1?[1,1/a]:[a,1]},ee=(e,t,n)=>[t*(.5+.33*Math.sin(e*.53)+.08*Math.sin(e*1.31+.6)),n*(.5+.28*Math.sin(e*.71+1.1)+.07*Math.cos(e*1.57))],te=(e,t)=>{e.canvas.width=32,e.canvas.height=32,e.drawImage(t,0,0,32,32);let n=e.getImageData(0,0,32,32).data,r=[0,0,0],i=[0,0,0],a=0;for(let e=0;e<32;e++)for(let t=0;t<32;t++)if(!(t>0&&e>0&&t<31&&e<31)){for(let a=0;a<3;a++){let o=n[(e*32+t)*4+a]/255;r[a]+=o,i[a]+=o*o}a++}let o=[r[0]/a,r[1]/a,r[2]/a];return{matte:o,plain:o.reduce((e,t,n)=>e+Math.sqrt(Math.max(0,i[n]/a-t*t)),0)/3<.06}},S=null,ne=()=>{if(S)return S;let e=4096,t=[];for(let e=-6;e<=6;e++)for(let n=-6;n<=6;n++)t.push(n,e,Math.exp(-(n*n+e*e)/4.5));let n=new Float32Array(e),r=new Uint8Array(e),i=(e,r)=>{let i=e%64,a=(e-i)/64;for(let e=0;e<t.length;e+=3)n[(a+t[e+1]&63)*64+(i+t[e]&63)]+=r*t[e+2]},a=(t,i)=>{let a=0,o=i?-1/0:1/0;for(let s=0;s<e;s++)r[s]===t&&(i?n[s]>o:n[s]<o)&&(o=n[s],a=s);return a},o=7,s=()=>(o=o*16807%2147483647,o/2147483647);for(let t=0;t<410;){let n=Math.floor(s()*e);r[n]||(r[n]=1,i(n,1),t++)}for(let t=0;t<e;t++){let e=a(1,!0);r[e]=0,i(e,-1);let t=a(0,!1);if(r[t]=1,i(t,1),t===e)break}let c=r.slice(),l=n.slice(),u=new Uint16Array(e);for(let e=409;e>=0;e--){let t=a(1,!0);r[t]=0,i(t,-1),u[t]=e}r.set(c),n.set(l);for(let t=410;t<e;t++){let e=a(0,!1);r[e]=1,i(e,1),u[e]=t}let d=new Uint8Array(e*4);for(let t=0;t<e;t++){let n=Math.floor(u[t]/e*256);d[t*4]=n,d[t*4+1]=n,d[t*4+2]=n,d[t*4+3]=255}return S=d,d},re=(e,t,n,r,i,a,o)=>{let s=a?3:1,c=new Float32Array(t*n*s);for(let r=0;r<t*n;r++){let t=e[r*4]/255,n=e[r*4+1]/255,i=e[r*4+2]/255;a?(c[r*3]=o(t),c[r*3+1]=o(n),c[r*3+2]=o(i)):c[r]=o(.2126*t+.7152*n+.0722*i)}let l=i-1,u=new Uint8Array(t*n*4);for(let e=0;e<n;e++){let i=e&1?-1:1;for(let o=0;o<t;o++){let d=i>0?o:t-1-o,f=e*t+d;for(let o=0;o<s;o++){let p=c[f*s+o],m=Math.min(l,Math.max(0,Math.round(p*l)))/l,h=p-m,g=Math.round(m*255);a?u[f*4+o]=g:u[f*4]=u[f*4+1]=u[f*4+2]=g;for(let a=0;a<r.length;a++){let l=d+r[a][0]*i,u=e+r[a][1];l<0||l>=t||u>=n||(c[(u*t+l)*s+o]+=h*r[a][2])}}u[f*4+3]=255}}return u},ie=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ae=`#version 300 es
precision highp float;

uniform sampler2D tPrev;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
uniform float uHold;

in vec2 vUv;
out vec4 fragColor;

float strokeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uSize;
  float trail = max(texture(tPrev, vUv).r - uFade, 0.0);
  float band = max(uRadius * uSoftness, 1.0) * uHold;
  float d = strokeDistance(p, uFrom, uTo);
  trail = max(trail, clamp((uRadius - d) / band, 0.0, 1.0) * uStrength);
  fragColor = vec4(trail, 0.0, 0.0, 1.0);
}
`,oe=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tImage;
uniform sampler2D tMask;
uniform sampler2D tNoise;
uniform sampler2D tDiffused;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uLod;
uniform float uCell;
uniform int uPattern;
uniform int uPalette;
uniform float uLevels;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uRimColor;
uniform float uRim;
uniform float uContrast;
uniform float uBrightness;
uniform float uReverse;
uniform float uIntro;
uniform float uHold;
uniform vec3 uMatte;
uniform float uKey;
uniform vec2 uSize;
uniform vec4 uBursts[4];
uniform float uBurstWidth;

in vec2 vUv;
out vec4 fragColor;

float bayer(vec2 cell) {
  ivec2 p = ivec2(mod(cell, 8.0));
  int v = p.x ^ p.y;
  int m = ((v & 1) << 5) | ((p.y & 1) << 4) | ((v & 2) << 2) | ((p.y & 2) << 1) | ((v & 4) >> 1) | ((p.y & 4) >> 2);
  return (float(m) + 0.5) / 64.0;
}

float blueNoise(vec2 cell) {
  return (texelFetch(tNoise, ivec2(mod(cell, 64.0)), 0).r * 255.0 + 0.5) / 256.0;
}

float engraving(vec2 cell) {
  float period = 6.0;
  float f = (mod(cell.x + cell.y, period) + 0.5) / period;
  return clamp(abs(f * 2.0 - 1.0) + (bayer(cell) - 0.5) * (2.0 / period), 0.0, 1.0);
}

vec2 imageUv(vec2 uv) {
  return (uv - 0.5) * uCover + 0.5;
}

float within(vec2 p) {
  vec2 s = step(vec2(0.0), p) * step(p, vec2(1.0));
  return s.x * s.y;
}

vec3 grade(vec3 c) {
  return pow(clamp((c - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0), vec3(1.6));
}

float shockwave(vec2 p) {
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 burst = uBursts[i];
    if (burst.w <= 0.0) continue;
    float offset = distance(p, burst.xy) - burst.z;
    float edge = offset > 0.0 ? offset / (uBurstWidth * 0.35) : -offset / uBurstWidth;
    value = max(value, clamp(1.0 - edge, 0.0, 1.0) * burst.w);
  }
  return value;
}

vec3 toned(vec3 c) {
  return uPalette == 1 ? grade(c) : grade(vec3(dot(c, vec3(0.2126, 0.7152, 0.0722))));
}

vec3 quantize(vec3 v, float t) {
  float steps = max(uLevels - 1.0, 1.0);
  vec3 s = v * steps;
  vec3 base = floor(s);
  return min(base + step(vec3(t), s - base), vec3(steps)) / steps;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec2 cellUv = vec2(center.x / uResolution.x, 1.0 - center.y / uResolution.y);

  vec2 sampleUv = imageUv(cellUv);
  float framed = within(sampleUv);
  vec3 level;
  if (uPattern == 3) {
    level = texelFetch(tDiffused, ivec2(cell), 0).rgb;
  } else {
    vec3 c = mix(uMatte, textureLod(tImage, sampleUv, uLod).rgb, framed);
    float t = uPattern == 1 ? blueNoise(cell) : (uPattern == 2 ? engraving(cell) : bayer(cell));
    level = quantize(toned(c), t);
  }

  vec3 color = mix(uInk, mix(uInk, uPaper, level), max(framed, uKey));
  vec3 backdrop = mix(uInk, uPaper, toned(uMatte));
  vec2 photoUv = imageUv(vUv);
  vec3 raw = texture(tImage, photoUv).rgb;
  float plain = uKey * (1.0 - smoothstep(0.05, 0.22, distance(raw, uMatte)));
  vec3 photo = mix(mix(uInk, backdrop, uKey), mix(raw, backdrop, plain), within(photoUv));

  vec2 point = vec2(cellUv.x, 1.0 - cellUv.y) * uSize;
  float mask = max(clamp(texture(tMask, cellUv).r * uHold, 0.0, 1.0), shockwave(point));
  float shown = mix(mask, 1.0 - mask, uReverse);
  float order = bayer(cell.yx);
  float low = order * (1.0 - uRim);
  color = mix(color, uRimColor, step(low, shown) * step(0.001, uRim));
  color = mix(color, photo, step(low + uRim, shown));

  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float spread = length((cellUv - 0.5) * aspect) / length(aspect * 0.5);
  float appear = step(spread * 0.72 + bayer(cell + vec2(3.0, 5.0)) * 0.28, uIntro * 1.001);
  fragColor = vec4(mix(uInk, color, appear), 1.0);
}
`,C=({src:e=f,fit:t=`contain`,pattern:n=`floyd`,pixelSize:l=2,levels:S=2,palette:C=`duotone`,inkColor:w=`#120f17`,paperColor:T=`#f4f1ea`,contrast:E=1.15,brightness:D=0,revealRadius:O=200,softness:k=.6,linger:se=1,rimColor:A=`#a78bfa`,rim:j=0,reverse:M=!1,wander:N=!1,clickBurst:ce=!0,className:le=``,style:P})=>{let ue=(0,u.useRef)(null),F=(0,u.useRef)(null),I=(0,u.useRef)(()=>{}),[L,de]=(0,u.useState)(0);return(0,u.useEffect)(()=>{F.current={fit:t,pattern:n,pixelSize:l,levels:S,palette:C,inkColor:w,paperColor:T,contrast:E,brightness:D,revealRadius:O,softness:k,linger:se,rimColor:A,rim:j,reverse:M,wander:N,clickBurst:ce},I.current()}),(0,u.useEffect)(()=>{let t=ue.current;if(!t)return;let n=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,l=new r({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!1,antialias:!1}),u=l.gl,d=u.canvas;d.style.display=`block`,d.style.width=`100%`,d.style.height=`100%`,t.appendChild(d);let f=e=>e.preventDefault(),S=()=>de(e=>e+1);d.addEventListener(`webglcontextlost`,f),d.addEventListener(`webglcontextrestored`,S);let C=l.isWebgl2&&!!l.getExtension(`EXT_color_buffer_float`),w=new c(u),T=()=>new s(u,{image:new Uint8Array(4),width:1,height:1,generateMipmaps:!1,flipY:!1,minFilter:u.NEAREST,magFilter:u.NEAREST}),E=new s(u,{minFilter:u.LINEAR_MIPMAP_LINEAR,magFilter:u.LINEAR}),D=T(),O=T(),k=(e,t)=>new a(u,{width:e,height:t,depth:!1,type:C?u.HALF_FLOAT:u.UNSIGNED_BYTE,internalFormat:C?u.RGBA16F:u.RGBA,minFilter:u.LINEAR,magFilter:u.LINEAR}),se=e=>{u.deleteFramebuffer(e.buffer),u.deleteTexture(e.texture.texture)},A=[k(2,2),k(2,2)],j={tPrev:{value:A[0].texture},uSize:{value:[1,1]},uFrom:{value:[0,0]},uTo:{value:[0,0]},uRadius:{value:1},uSoftness:{value:.5},uStrength:{value:0},uFade:{value:1},uHold:{value:v}},M={tImage:{value:E},tMask:{value:A[0].texture},tNoise:{value:D},tDiffused:{value:O},uResolution:{value:[1,1]},uCover:{value:[1,1]},uLod:{value:0},uCell:{value:3},uPattern:{value:0},uPalette:{value:0},uLevels:{value:2},uInk:{value:[0,0,0]},uPaper:{value:[1,1,1]},uRimColor:{value:[1,1,1]},uRim:{value:0},uContrast:{value:1},uBrightness:{value:0},uReverse:{value:0},uIntro:{value:0},uHold:{value:v},uMatte:{value:[0,0,0]},uKey:{value:0},uSize:{value:[1,1]},uBursts:{value:Array.from({length:16},()=>0)},uBurstWidth:{value:60}},N=(e,t)=>new o(u,{vertex:ie,fragment:e,uniforms:t,depthTest:!1,depthWrite:!1}),ce=new i(u,{geometry:w,program:N(ae,j)}),le=new i(u,{geometry:w,program:N(oe,M)}),P=document.createElement(`canvas`),L=P.getContext(`2d`,{willReadFrequently:!0}),R=null,fe=0,pe=``,me=!1,z=1,B=1,V=!0,H=0,U=performance.now(),he=0,W=0,G=0,K={x:0,y:0,inside:!1,fresh:!0,placed:!1},q={x:0,y:0,px:0,py:0},J=[],ge=()=>{z=Math.max(1,t.clientWidth),B=Math.max(1,t.clientHeight),l.setSize(z,B),M.uResolution.value=[d.width,d.height],j.uSize.value=[z,B],M.uSize.value=[z,B];let e=Math.max(2,Math.round(z*h)),n=Math.max(2,Math.round(B*h));(e!==A[0].width||n!==A[0].height)&&(A.forEach(se),A=[k(e,n),k(e,n)]),K.placed||(K.x=z/2,K.y=B/2)},_e=(e,t)=>{if(!R||!L)return;let n=Math.ceil(d.width/e),r=Math.ceil(d.height/e),i=[t.pattern,t.levels,t.palette,t.contrast,t.brightness,t.fit,n,r,d.width,d.height].join(`|`);if(i===pe)return;pe=i;let[a,o]=M.uCover.value,s=R.naturalWidth,c=R.naturalHeight;P.width=n,P.height=r,L.imageSmoothingEnabled=!0,L.imageSmoothingQuality=`high`;let[l,u,f]=M.uMatte.value;L.fillStyle=`rgb(${l*255}, ${u*255}, ${f*255})`,L.fillRect(0,0,n,r);let p=(.5-.5*a)*s,h=(.5-.5*o)*c,g=n*e/d.width*a*s,_=r*e/d.height*o*c,v=Math.max(p,0),y=Math.max(h,0),b=Math.min(p+g,s),x=Math.min(h+_,c);b>v&&x>y&&L.drawImage(R,v,y,b-v,x-y,(v-p)/g*n,(y-h)/_*r,(b-v)/g*n,(x-y)/_*r);let ee=e=>Math.min(1,Math.max(0,(e-.5)*t.contrast+.5+t.brightness))**1.6,te=L.getImageData(0,0,n,r).data;O.image=re(te,n,r,m[t.pattern],t.levels,t.palette===`rgb`,ee),O.width=n,O.height=r,O.needsUpdate=!0},ve=e=>{H=0;let t=F.current;if(!t)return;let r=Math.min(.05,Math.max(0,(e-U)/1e3));U=e;let i=t.wander&&!n,a=K.x,o=K.y;if(!K.inside&&i){G=Math.min(1,G+r/1.2);let[t,n]=ee(e/1e3,z,B),i=G*G*(3-2*G);a+=(t-a)*i,o+=(n-o)*i}else G=0;if(W+=((K.inside||i?1:0)-W)*(1-Math.exp(-r/.16)),K.fresh)q.x=q.px=a,q.y=q.py=o,K.fresh=!1;else{let e=1-Math.exp(-r/.035);q.x+=(a-q.x)*e,q.y+=(o-q.y)*e}let s=M.uBursts.value;s.fill(0);for(let t=J.length-1;t>=0;t--)(e-J[t].start)/1e3>=_&&J.splice(t,1);J.forEach((t,n)=>{let r=Math.max(0,(e-t.start)/1e3/_),i=Math.hypot(Math.max(t.x,z-t.x),Math.max(t.y,B-t.y))+M.uBurstWidth.value;s[n*4]=t.x,s[n*4+1]=t.y,s[n*4+2]=i*Math.sin(r*Math.PI/2),s[n*4+3]=1-r*r*r}),W>.002&&(he=e+t.linger*1e3+150);let c=C?0:1.5/255,u=t.linger>0?r/t.linger:1;j.tPrev.value=A[0].texture,j.uFrom.value=[q.px,q.py],j.uTo.value=[q.x,q.y],j.uRadius.value=t.revealRadius*(.45+.55*W),j.uSoftness.value=t.softness,j.uStrength.value=W,j.uFade.value=Math.max(u,c),M.uBurstWidth.value=Math.max(60,t.revealRadius*.9),l.render({scene:ce,target:A[1]}),A.reverse(),q.px=q.x,q.py=q.y;let f=Math.max(1,Math.round(t.pixelSize*l.dpr));R&&(M.uCover.value=x(d.width,d.height,R.naturalWidth,R.naturalHeight,t.fit===`contain`));let h=p[t.pattern]??0;if(m[t.pattern]&&(h=0,R&&!me))try{_e(f,t),h=3}catch{me=!0}h===1&&D.width!==64&&(D.image=ne(),D.width=64,D.height=64,D.needsUpdate=!0);let g=R?M.uCover.value[0]*R.naturalWidth/d.width:1;M.tMask.value=A[0].texture,M.uCell.value=f,M.uLod.value=Math.log2(Math.max(f*g,1)),M.uPattern.value=h,M.uPalette.value=+(t.palette===`rgb`),M.uLevels.value=Math.max(2,Math.round(t.levels)),M.uInk.value=b(t.inkColor),M.uPaper.value=b(t.paperColor),M.uRimColor.value=b(t.rimColor),M.uRim.value=Math.min(Math.max(t.rim,0),.95),M.uContrast.value=t.contrast,M.uBrightness.value=t.brightness,M.uReverse.value=+!!t.reverse;let v=R?Math.min(1,(e-fe)/y):0;M.uIntro.value=1-(1-v)**2,l.render({scene:le}),(K.inside||i||W>.002||J.length>0||e<he||R&&v<1)&&V&&(H=requestAnimationFrame(ve))},Y=()=>{!H&&V&&(U=performance.now(),H=requestAnimationFrame(ve))};I.current=Y;let X=new Image;X.crossOrigin=`anonymous`,X.decoding=`async`,X.onload=()=>{R=X,E.image=X;try{if(L){let e=te(L,X);M.uMatte.value=e.matte,M.uKey.value=+!!e.plain}}catch{}fe=performance.now(),Y()},X.src=e;let ye=e=>{let n=t.getBoundingClientRect();K.x=e.clientX-n.left,K.y=e.clientY-n.top,K.placed=!0},Z=e=>{ye(e),K.inside||(K.inside=!0,K.fresh=!0),Y()},Q=()=>{K.inside=!1,Y()},be=e=>{Z(e),!(!F.current?.clickBurst||e.pointerType===`mouse`&&e.button!==0)&&(J.push({x:K.x,y:K.y,start:performance.now()}),J.length>g&&J.shift())};t.addEventListener(`pointermove`,Z,{passive:!0}),t.addEventListener(`pointerenter`,Z,{passive:!0}),t.addEventListener(`pointerdown`,be,{passive:!0}),t.addEventListener(`pointerleave`,Q,{passive:!0}),t.addEventListener(`pointercancel`,Q,{passive:!0});let xe=new ResizeObserver(()=>{ge(),Y()});xe.observe(t);let $=new IntersectionObserver(([e])=>{V=e.isIntersecting,Y()});return $.observe(t),ge(),Y(),()=>{cancelAnimationFrame(H),I.current=()=>{},xe.disconnect(),$.disconnect(),X.onload=null,t.removeEventListener(`pointermove`,Z),t.removeEventListener(`pointerenter`,Z),t.removeEventListener(`pointerdown`,be),t.removeEventListener(`pointerleave`,Q),t.removeEventListener(`pointercancel`,Q),d.removeEventListener(`webglcontextlost`,f),d.removeEventListener(`webglcontextrestored`,S),u.getExtension(`WEBGL_lose_context`)?.loseContext(),d.parentNode&&d.parentNode.removeChild(d)}},[e,L]),(0,d.jsx)(`div`,{ref:ue,className:`dither-veil ${le}`.trim(),style:P})},w={hero:`_hero_731d7_1`,layer:`_layer_731d7_17`,next:`_next_731d7_47`,bob:`_bob_731d7_1`,sink:`_sink_731d7_1`,vanish:`_vanish_731d7_1`};function T({onNext:e}){return(0,d.jsxs)(`section`,{className:w.hero,"aria-label":`Escultura`,children:[(0,d.jsx)(`div`,{className:w.layer,children:(0,d.jsx)(C,{src:n,pattern:`floyd`,pixelSize:1,inkColor:`#120f17`,paperColor:`#f4f1ea`,revealRadius:185,softness:.6,linger:1,fit:`contain`,rimColor:`#a78bfa`,palette:`duotone`,levels:2,contrast:1.15,brightness:0,rim:0,reverse:!1,wander:!1,clickBurst:!0})}),(0,d.jsx)(`button`,{type:`button`,className:w.next,onClick:e,"aria-label":`Ver as fotos`,children:(0,d.jsx)(l,{dir:`down`})})]})}export{T as Sculpture};