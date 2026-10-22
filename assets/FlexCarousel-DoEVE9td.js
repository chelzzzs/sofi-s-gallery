import{n as e,r as t}from"./index-CQ_-efgU.js";import{a as n,i as r,n as i,o as a,r as o,s,t as c}from"./Triangle-BWJEykpK.js";var l=class e extends s{constructor(t,{width:n=1,height:r=1,widthSegments:i=1,heightSegments:a=1,attributes:o={}}={}){let s=i,c=a,l=(s+1)*(c+1),u=s*c*6,d=new Float32Array(l*3),f=new Float32Array(l*3),p=new Float32Array(l*2),m=u>65536?new Uint32Array(u):new Uint16Array(u);e.buildPlane(d,f,p,m,n,r,0,s,c),Object.assign(o,{position:{size:3,data:d},normal:{size:3,data:f},uv:{size:2,data:p},index:{data:m}}),super(t,o)}static buildPlane(e,t,n,r,i,a,o,s,c,l=0,u=1,d=2,f=1,p=-1,m=0,h=0){let g=m,ee=i/s,te=a/c;for(let _=0;_<=c;_++){let v=_*te-a/2;for(let a=0;a<=s;a++,m++){let te=a*ee-i/2;if(e[m*3+l]=te*f,e[m*3+u]=v*p,e[m*3+d]=o/2,t[m*3+l]=0,t[m*3+u]=0,t[m*3+d]=o>=0?1:-1,n[m*2]=a/s,n[m*2+1]=1-_/c,_===c||a===s)continue;let y=g+a+_*(s+1),b=g+a+(_+1)*(s+1),x=g+a+(_+1)*(s+1)+1,ne=g+a+_*(s+1)+1;r[h*6]=y,r[h*6+1]=b,r[h*6+2]=ne,r[h*6+3]=b,r[h*6+4]=x,r[h*6+5]=ne,h++}}}},u=t(),d=e(),f=e=>`https://images.unsplash.com/${e}?w=1200&q=80&auto=format&fit=max`,p=[{src:f(`photo-1737071371043-761e02b1ef95`),alt:`An iridescent chrome sculpture of a head`,title:`Iridescence`},{src:f(`photo-1693645325828-62cd35c8da8f`),alt:`A person in dark clothes standing in front of a white backdrop`,title:`White Room`},{src:f(`photo-1739056238917-d89cd05c48d5`),alt:`A twisted chrome form on black`,title:`Liquid Metal`},{src:f(`photo-1747191092806-c7da11881986`),alt:`A clay bust shown in profile`,title:`Clay Study`},{src:f(`photo-1605034313761-73ea4a0cfbf3`),alt:`Black and white low top sneakers`,title:`Low Tops`},{src:f(`photo-1495462911434-be47104d70fa`),alt:`A woman in a wide black hat`,title:`Brim`},{src:f(`photo-1786835568925-20cd20007ed0`),alt:`Three swirling shapes in white, gold and silver on grey`,title:`Three Forms`},{src:f(`photo-1770249196550-ff6c641165cb`),alt:`A chrome humanoid sculpture`,title:`Automaton`},{src:f(`photo-1787181875088-087d612262a7`),alt:`A black textured sculpture with an opening at its center`,title:`Obsidian`},{src:f(`photo-1770062422885-2dfcbe8fb65b`),alt:`A woman in a white shirt crouching on a dark set`,title:`Poise`},{src:f(`photo-1726910133626-9b573eca70ff`),alt:`Black curved shapes stacked like a fan`,title:`Fins`},{src:f(`photo-1604854574958-59047362c165`),alt:`A white plaster bust on a black table`,title:`Plaster`}],m={liquid:{lensWidth:.74,lensHeight:1.18,tilt:62,roundness:1,bend:.34,reach:.38,curl:`twist`,dispersion:.45,liquid:0,followCursor:!1},ribbon:{lensWidth:.8,lensHeight:.8,tilt:0,roundness:1,bend:.34,reach:.34,curl:`twist`,dispersion:.4,liquid:0,followCursor:!1},vortex:{lensWidth:.7,lensHeight:.95,tilt:30,roundness:1,bend:.46,reach:.3,curl:`twist`,dispersion:.5,liquid:0,followCursor:!1},arch:{lensWidth:.8,lensHeight:.8,tilt:0,roundness:1,bend:.3,reach:.36,curl:`rise`,dispersion:.4,liquid:0,followCursor:!1}},h={portrait:.75,square:1,landscape:4/3},g=12,ee=45e5,te={rise:2.1,bloom:1.6,spin:2.2,deal:1.5,fade:.35},_=(e,t)=>((e+t/2)%t+t)%t-t/2,v=e=>Math.min(Math.max(e,0),1),y=e=>1-(1-v(e))**3,b=e=>1-(1-v(e))**5,x=e=>{let t=v(e);return t<.5?4*t*t*t:1-(-2*t+2)**3/2},ne=`#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`,re=`#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`,ie=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ae=`#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${g}; i++) {
      float s = (float(i) + 0.5) / float(${g});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`,S=({value:e})=>(0,d.jsx)(`span`,{className:`flex-carousel__digits`,children:String(e).padStart(2,`0`).split(``).map((e,t)=>(0,d.jsx)(`span`,{className:`flex-carousel__digit`,children:(0,d.jsx)(`span`,{className:`flex-carousel__reel`,style:{transform:`translateY(${-Number(e)*10}%)`},children:`0123456789`.split(``).map(e=>(0,d.jsx)(`span`,{children:e},e))})},t))}),oe=({items:e=p,preset:t=`liquid`,intro:s=`rise`,cardHeight:f=.5,gap:g=12,radius:oe=0,fit:C=`natural`,lensWidth:se,lensHeight:w,tilt:T,roundness:E,bend:D,reach:O,curl:k,dispersion:A,liquid:ce,followCursor:j,squeeze:le=.2,focusOnClick:M=!0,autoplay:N=!1,interval:P=4,captions:F=!0,captureWheel:I=!0,onChange:ue,onSelect:L,className:R=``,style:de})=>{let fe=(0,u.useRef)(null),z=(0,u.useRef)(null),B=(0,u.useRef)(e),V=(0,u.useRef)(null),pe=(0,u.useRef)({onChange:ue,onSelect:L}),[H,me]=(0,u.useState)(0),[he,ge]=(0,u.useState)(!1),[_e,ve]=(0,u.useState)(!1),[ye,be]=(0,u.useState)(0),U=m[t]||m.liquid,W=(e,t)=>e??U[t],G=e&&e.length?e:p,K=G.map(e=>e.src).join(`|`);(0,u.useEffect)(()=>{B.current=G,pe.current={onChange:ue,onSelect:L},z.current={intro:s,cardHeight:f,gap:g,radius:oe,fit:C,lensWidth:W(se,`lensWidth`),lensHeight:W(w,`lensHeight`),tilt:W(T,`tilt`),roundness:W(E,`roundness`),bend:W(D,`bend`),reach:W(O,`reach`),curl:W(k,`curl`),dispersion:W(A,`dispersion`),liquid:W(ce,`liquid`),followCursor:W(j,`followCursor`),squeeze:le,focusOnClick:M,autoplay:N,interval:P,captureWheel:I},V.current?.wake()}),(0,u.useEffect)(()=>{V.current?.setItems(B.current)},[K]),(0,u.useEffect)(()=>{let e=fe.current;if(!e)return;let t=new n({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),s=t.gl;if(!t.isWebgl2){s.getExtension(`WEBGL_lose_context`)?.loseContext();return}s.clearColor(0,0,0,0);let u=s.canvas;u.style.display=`block`,u.style.width=`100%`,u.style.height=`100%`,u.setAttribute(`aria-hidden`,`true`),e.prepend(u);let d=e=>e.preventDefault(),f=()=>be(e=>e+1);u.addEventListener(`webglcontextlost`,d),u.addEventListener(`webglcontextrestored`,f);let p=new a(s,{vertex:ne,fragment:re,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{tMap:{value:new o(s)},uRect:{value:[0,0,1,1]},uResolution:{value:[1,1]},uSize:{value:[1,1]},uImage:{value:[1,1]},uRadius:{value:16},uAlpha:{value:1},uReady:{value:0},uShift:{value:0},uDpr:{value:1},uPlaceholder:{value:[.5,.5,.5]}}});p.setBlendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA);let m=new r(s,{geometry:new l(s),program:p}),g=new i(s,{width:2,height:2,depth:!1,minFilter:s.LINEAR_MIPMAP_LINEAR,magFilter:s.LINEAR}),S={tScene:{value:g.texture},uResolution:{value:[1,1]},uDpr:{value:1},uCenter:{value:[0,0]},uHalf:{value:[1,1]},uAngle:{value:0},uExponent:{value:2},uInner:{value:60},uOuter:{value:80},uFlow:{value:0},uCurl:{value:0},uDispersion:{value:0},uStrength:{value:0},uSceneAlpha:{value:0}},oe=new r(s,{geometry:new c(s),program:new a(s,{vertex:ie,fragment:ae,uniforms:S,depthTest:!1,depthWrite:!1})}),C=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,se=t.getExtension(`EXT_texture_filter_anisotropic`)?8:0,w=[],T=1,E=1,D=0,O=0,k=0,A=`spring`,ce=0,j=0,le=performance.now(),M=!0,N=!0,P=!0,F=-1,I=-1/0,ue=performance.now(),L=!1,R=0,de=0,H=null,he=!1,_e=``,ye=1,U=0,W=0,G={x:0,y:0,vx:0,vy:0,ready:!1},K={x:0,y:0,over:!1,down:!1,id:-1,startX:0,startY:0,startPos:0,dragging:!1,touch:!1,samples:[]},q={kind:`none`,t:0,running:!1,done:!1,readyAt:0},J={index:-1,pending:-1,t:0,v:0,target:0},xe=[],Se=(e,t)=>{let n=new o(s,{generateMipmaps:!0,minFilter:s.LINEAR_MIPMAP_LINEAR,magFilter:s.LINEAR,anisotropy:se}),r={item:e,index:t,texture:n,aspect:.8,loaded:!1,failed:!1,ready:0,color:[.5,.5,.5],image:[1,1],dispose:()=>{}},i=new Image;return i.crossOrigin=`anonymous`,i.decoding=`async`,i.onload=()=>{if(N&&w.includes(r)){n.image=i,n.update(),r.image=[i.naturalWidth||1,i.naturalHeight||1],r.aspect=r.image[0]/r.image[1];try{let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`,{willReadFrequently:!0});if(t){t.drawImage(i,0,0,8,8);let e=t.getImageData(0,0,8,8).data,n=[0,0,0];for(let t=0;t<e.length;t+=4)n[0]+=e[t],n[1]+=e[t+1],n[2]+=e[t+2];r.color=n.map(e=>e/64/255)}}catch{r.color=[.5,.5,.5]}r.loaded=!0,P=!0,Q()}},i.onerror=()=>{N&&(r.failed=!0,P=!0,Q())},i.src=e.src,r.dispose=()=>{i.onload=null,i.onerror=null,s.deleteTexture(n.texture)},r},Ce=e=>{w.forEach(e=>e.dispose()),w=e.map(Se),F=-1,H=null,he=!0,J.target=0,J.t=0,J.v=0,J.pending=-1,ve(!1),q.readyAt=performance.now(),P=!0,Q()},we=e=>{let t=Math.max(24,e.cardHeight*E),n=h[e.fit],r=w.map(e=>(n||e.aspect)*t),i=[],a=0;for(let t=0;t<r.length;t++)i.push(a+r[t]/2),a+=r[t]+e.gap;return{cardH:t,widths:r,centers:i,gap:e.gap,loop:Math.max(a,1)}},Te=(e,t)=>{let n=0,r=1/0;for(let i=0;i<e.centers.length;i++){let a=Math.abs(_(e.centers[i]-t,e.loop));a<r&&(r=a,n=i)}return n},Y=(e,t)=>{let n=Te(e,t);return t+_(e.centers[n]-t,e.loop)},Ee=(e,t,n)=>{let r=Te(e,n),i=_(n-e.centers[r],e.loop);return Math.round((n-i-e.centers[r])/e.loop)*t.loop+t.centers[r]+i*(t.widths[r]/e.widths[r])},De=(e,t)=>{let n=Y(e,k),r=Te(e,n),i=e.centers.length;for(let a=0;a<Math.abs(t);a++){let a=(r+(t>0?1:i-1))%i,o=t>0?e.widths[r]/2+e.gap+e.widths[a]/2:-(e.widths[a]/2+e.gap+e.widths[r]/2);n+=o,r=a}k=n,A=`spring`,P=!0,Q()},Oe=(e,t)=>{let n=(t%e.centers.length+e.centers.length)%e.centers.length;k+=_(e.centers[n]-k,e.loop),A=`spring`,P=!0,Q()},ke=e=>{J.index=e,J.pending=-1,J.target=1,ve(!0),P=!0,Q()},X=()=>(J.pending=-1,J.target!==0&&(J.target=0,ve(!1),P=!0,Q(),!0)),Z=()=>{q.running&&(q.t=1)},Ae=()=>{let e=q.running?q.t:+!!q.done,t={sceneAlpha:1,strength:1,card:null};if(!q.done&&!q.running)return t.sceneAlpha=0,t.strength=0,t;if(e>=1)return t;let n=q.kind;return n===`rise`?(t.strength=x((e-.3)/.65),t.card=t=>{let n=Math.min(Math.abs(t)/(T*.6),1)*.34,r=v((e-n)/.6);return{alpha:v(r*4),x:0,y:(1-b(r))*E*.62,scale:.5+.5*x((r-.18)/.82)}}):n===`bloom`?(t.strength=x((e-.2)/.8),t.card=t=>{let n=Math.min(Math.abs(t)/(T*.6),1)*.25,r=y((e-n)/.55);return{alpha:r,x:0,y:0,scale:.92+.08*r}}):n===`spin`?(t.sceneAlpha=y(e/.25),t.strength=y((e-.55)/.45)):n===`deal`?(t.strength=y((e-.45)/.5),t.card=t=>{let n=Math.min(Math.abs(t)/(T*.6),1)*.3,r=y((e-.12-n)/.5);return{alpha:y((e-n)/.12),x:-t*(1-r),y:0,scale:1}}):(t.sceneAlpha=y(e),t.strength=y(e)),t},je=(e,t)=>{let n=C&&e.intro!==`none`?`fade`:e.intro;if(q.kind=te[n]?n:`none`,q.running=q.kind!==`none`,q.done=!q.running,q.t=0,q.done&&ge(!0),q.kind===`spin`){let e=t.loop*1.6+T;D=k+e,O=-e*3,A=`spring`}},Me=()=>{T=Math.max(1,e.clientWidth),E=Math.max(1,e.clientHeight),t.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(ee/(T*E))),t.setSize(T,E),g.setSize(Math.max(2,Math.round(T*t.dpr)),Math.max(2,Math.round(E*t.dpr))),S.tScene.value=g.texture,P=!0,Q()},Ne=n=>{if(j=0,!N)return;let r=z.current,i=Math.min(.05,Math.max(.001,(n-le)/1e3));if(le=n,!r||!w.length){M&&(j=requestAnimationFrame(Ne));return}let a=we(r),o=w.length,c=!1;if(he?(k=Y(a,k),D=k,O=0,he=!1):H&&H.loop!==a.loop&&(D=Ee(H,a,D),k=Ee(H,a,k),K.startPos=D+(K.x-K.startX),c=!0),H=a,!q.running&&!q.done&&(w.every(e=>e.loaded||e.failed)||n-q.readyAt>3500)&&(k=Y(a,k),D=k,je(r,a)),q.running&&(q.t=Math.min(1,q.t+i/(te[q.kind]||1)),q.t>=1&&(q.running=!1,q.done=!0,ge(!0)),c=!0),A===`wheel`&&n-ce>150&&(k=Y(a,k),A=`spring`),K.dragging)c=!0;else{let e=q.running&&q.kind===`spin`?9:A===`wheel`?80:55,t=2*Math.sqrt(e),n=Math.ceil(i/(1/240)),r=i/n;for(let i=0;i<n;i++){let n=e*(k-D)-t*O;O+=n*r,D+=O*r}Math.abs(k-D)<.05&&Math.abs(O)<.5?(D=k,O=0):c=!0}if(Math.abs(D)>a.loop*8){let e=Math.round(D/a.loop)*a.loop;D-=e,k-=e,K.startPos-=e}let l=Te(a,D);l!==F&&(F=l,me(l),pe.current.onChange?.(l,B.current[l])),J.pending>=0&&A===`spring`&&Math.abs(k-D)<1.5&&Math.abs(O)<30&&(l===J.pending?ke(l):J.pending=-1),r.autoplay&&!C&&q.done&&J.target===0&&J.t<.01&&!K.over&&!K.down&&!L&&A===`spring`&&Math.abs(k-D)<1&&n-I>3e3&&n-ue>r.interval*1e3&&(ue=n,De(a,1)),r.autoplay&&!C&&(c=!0);let u=Math.abs(D-W)/i;W=D;let d=C?0:Math.min(u/2600,1);U+=(d-U)*(1-Math.exp(-i/(d>U?.07:.35))),U>.001&&(c=!0);let f=C?0:r.liquid,h=Math.max(-1,Math.min(1,O/2200)),ee=2*Math.sqrt(120)*.32;de+=(120*(h-R)-ee*de)*i,R+=de*i,(Math.abs(R)>5e-4||Math.abs(de)>.005)&&(c=!0),J.v+=(64*(J.target-J.t)-16*J.v)*i,J.t+=J.v*i,Math.abs(J.target-J.t)<5e-4&&Math.abs(J.v)<.001?(J.t=J.target,J.v=0):c=!0;let y=v(J.t),b=x(y),ne=J.index>=0&&J.index<o?a.widths[J.index]:a.cardH,re=Math.max(1,Math.min(1.3,E*.84/a.cardH,T*.92/ne)),ie=1+(re-1)*b;Math.abs(ie-ye)>5e-4&&(ye=ie,e.style.setProperty(`--flex-carousel-lift`,ye.toFixed(4)));let ae=Ae(),se=T/2,fe=E/2,V=r.followCursor&&K.over&&!K.dragging&&!K.touch&&J.target===0,ve=V?K.x:se,be=V?K.y:fe;G.ready||=(G.x=se,G.y=fe,!0);let Se=2*Math.sqrt(110)*.8;G.vx+=(110*(ve-G.x)-Se*G.vx)*i,G.vy+=(110*(be-G.y)-Se*G.vy)*i,G.x+=G.vx*i,G.y+=G.vy*i,(Math.abs(ve-G.x)+Math.abs(be-G.y)>.2||Math.abs(G.vx)+Math.abs(G.vy)>.5)&&(c=!0);let Ce=a.cardH,Oe=r.lensWidth*T/2,X=r.lensHeight*T/2,Z=Math.abs(R)*f;Oe*=1+Z*.16,X*=1-Z*.08;let Me=G.x-R*14*f;for(let e=0;e<o;e++){let t=w[e];t.loaded&&t.ready<1&&(t.ready=Math.min(1,t.ready+i/.45),c=!0)}let Q=!q.done;if(P||c||K.dragging){P=!1,xe=[];let e=t.dpr;p.uniforms.uResolution.value=[T,E],p.uniforms.uDpr.value=e,p.uniforms.uRadius.value=r.radius;let n=1-v(r.squeeze)*U,i=[];for(let e=0;e<o;e++){let t=a.widths[e],r=_(a.centers[e]-D,a.loop);for(let o=-3;o<=3;o++){let s=r+o*a.loop;if(Math.abs(s)-t/2>T+40)continue;let c=ae.card?ae.card(s):null,l=se+s+(c?c.x:0),u=n*(c?c.scale:1),d=c?c.alpha:1;if(y>0){if(e===J.index&&Math.abs(s)<t)u*=1+(re-1)*b;else{let e=Math.min(Math.abs(s)/T,1)*.25,t=x(y*1.25-e);l+=Math.sign(s)*t*T*.7,d*=1-t}}let f=t*u;d<=.001||l+f/2<-40||l-f/2>T+40||i.push({i:e,rel:s,x:l,y:fe+(c?c.y:0),cw:f,ch:Ce*u,alpha:d})}}i.sort((e,t)=>Math.abs(t.rel)-Math.abs(e.rel));let c=!0;for(let e of i){let n=w[e.i];p.uniforms.tMap.value=n.texture,p.uniforms.uRect.value=[e.x,e.y,e.cw+2,e.ch+2],p.uniforms.uSize.value=[e.cw,e.ch],p.uniforms.uImage.value=n.image,p.uniforms.uAlpha.value=e.alpha,p.uniforms.uReady.value=n.ready,p.uniforms.uShift.value=C?0:Math.max(-1,Math.min(1,e.rel/(T*.75))),p.uniforms.uPlaceholder.value=n.color,t.render({scene:m,target:g,clear:c}),c=!1,xe.push({index:e.i,x0:e.x-e.cw/2,x1:e.x+e.cw/2,y0:e.y-e.ch/2,y1:e.y+e.ch/2})}c&&(t.bindFramebuffer(g),s.viewport(0,0,g.width,g.height),s.clear(s.COLOR_BUFFER_BIT)),t.bindFramebuffer(),g.texture.bind(),s.generateMipmap(s.TEXTURE_2D),S.uResolution.value=[T,E],S.uDpr.value=e,S.uCenter.value=[Me,G.y],S.uHalf.value=[Math.max(Oe,1),Math.max(X,1)],S.uAngle.value=r.tilt*Math.PI/180,S.uExponent.value=2+(1-v(r.roundness))**1.5*10;let l=Math.max(Oe,1),u=Math.max(X,1),d=Math.max(4,r.reach*(l+u)*.5);S.uInner.value=d,S.uOuter.value=d*1.6,S.uFlow.value=r.bend*(l+u)*.45,S.uCurl.value=r.curl===`rise`?1:r.curl===`fall`?-1:0,S.uDispersion.value=r.dispersion*.12*(1+Math.abs(R)*f*1.2),S.uStrength.value=ae.strength*(1-b),S.uSceneAlpha.value=ae.sceneAlpha,t.render({scene:oe})}let $=``;if(K.over&&!K.dragging&&q.done&&r.focusOnClick){let e=xe.find(e=>K.x>=e.x0&&K.x<=e.x1&&K.y>=e.y0&&K.y<=e.y1);J.target>0?$=`close`:e&&($=`open`)}$!==_e&&(_e=$,_e?e.setAttribute(`data-hover`,_e):e.removeAttribute(`data-hover`)),M&&(c||Q||P||K.down)&&(j=requestAnimationFrame(Ne))},Q=()=>{!j&&M&&N&&(le=performance.now(),j=requestAnimationFrame(Ne))},$=t=>{let n=e.getBoundingClientRect();return[t.clientX-n.left,t.clientY-n.top]},Pe=e=>{if(e.button!==void 0&&e.button>0)return;Z();let[t,n]=$(e);K.down=!0,K.id=e.pointerId,K.touch=e.pointerType===`touch`,K.startX=t,K.startY=n,K.x=t,K.y=n,K.startPos=D,K.dragging=!1,K.samples=[{x:t,t:performance.now()}],I=performance.now(),Math.abs(O)>40&&(k=D,O=0),P=!0,Q()},Fe=t=>{let[n,r]=$(t);if(K.x=n,K.y=r,K.over=!0,K.down&&t.pointerId===K.id){let i=n-K.startX,a=r-K.startY,o=K.touch?10:5;if(!K.dragging){if(K.touch&&Math.abs(a)>o&&Math.abs(a)>Math.abs(i)){K.down=!1;return}if(Math.abs(i)>o){K.dragging=!0,K.startX=n,K.startPos=D,X();try{e.setPointerCapture(t.pointerId)}catch{K.dragging=!0}e.setAttribute(`data-dragging`,``)}}if(K.dragging){D=K.startPos-(n-K.startX),k=D,O=0;let e=performance.now();for(K.samples.push({x:n,t:e});K.samples.length>2&&e-K.samples[0].t>100;)K.samples.shift()}}P=!0,Q()},Ie=t=>{if(!K.down||t.pointerId!==K.id)return;K.down=!1,e.removeAttribute(`data-dragging`);let n=z.current;if(!n)return;let r=we(n);if(I=performance.now(),K.dragging){K.dragging=!1;let e=performance.now(),t=K.samples[0],n=K.samples[K.samples.length-1],i=0;t&&n&&n.t>t.t&&e-n.t<70&&(i=-((n.x-t.x)/(n.t-t.t))*1e3),O=i;let a=Y(r,D+i*.32);k=a,Math.abs(i)>400&&Math.abs(a-D)<1&&De(r,i>0?1:-1),A=`spring`,Q();return}if(X())return;let[i,a]=$(t),o=xe.find(e=>i>=e.x0&&i<=e.x1&&a>=e.y0&&a<=e.y1);if(o){if(o.index===F&&Math.abs(k-D)<2)pe.current.onSelect?.(o.index,B.current[o.index]),n.focusOnClick&&ke(o.index);else{let e=(o.x0+o.x1)/2-T/2;k=Y(r,D+e),A=`spring`,n.focusOnClick&&(J.pending=o.index),Q()}}},Le=()=>{K.over=!1,P=!0,Q()},Re=()=>{K.down=!1,K.dragging=!1,e.removeAttribute(`data-dragging`);let t=z.current;t&&(k=Y(we(t),D),A=`spring`,Q())},ze=e=>{let t=z.current;if(!t||e.ctrlKey)return;let n=e.deltaX,r=e.deltaY;e.shiftKey&&Math.abs(n)<Math.abs(r)&&(n=r,r=0);let i=e.deltaMode===1?16:e.deltaMode===2?E:1,a=Math.abs(n)>Math.abs(r);if(!a&&!t.captureWheel||(e.preventDefault(),Z(),I=performance.now(),X()))return;let o=Math.max(-120,Math.min(120,(a?n:r)*i));k+=o*1.25,A=`wheel`,ce=performance.now(),Q()},Be=e=>{let t=z.current;if(!t)return;let n=we(t);if(e.key===`ArrowRight`||e.key===`ArrowDown`)e.preventDefault(),Z(),X(),I=performance.now(),De(n,1);else if(e.key===`ArrowLeft`||e.key===`ArrowUp`)e.preventDefault(),Z(),X(),I=performance.now(),De(n,-1);else if(e.key===`Home`)e.preventDefault(),X(),Oe(n,0);else if(e.key===`End`)e.preventDefault(),X(),Oe(n,w.length-1);else if(e.key===`Escape`)X()&&e.preventDefault();else if(e.key===`Enter`||e.key===` `){if(e.preventDefault(),X()||F<0)return;pe.current.onSelect?.(F,B.current[F]),t.focusOnClick&&ke(F)}},Ve=()=>{L=!0},He=()=>{L=!1},Ue=()=>{document.hidden||Q()};e.addEventListener(`pointerdown`,Pe),e.addEventListener(`pointermove`,Fe),e.addEventListener(`pointerup`,Ie),e.addEventListener(`pointerleave`,Le),e.addEventListener(`pointercancel`,Re),e.addEventListener(`wheel`,ze,{passive:!1}),e.addEventListener(`keydown`,Be),e.addEventListener(`focus`,Ve),e.addEventListener(`blur`,He),document.addEventListener(`visibilitychange`,Ue);let We=new ResizeObserver(Me);We.observe(e);let Ge=new IntersectionObserver(([e])=>{M=e.isIntersecting,Q()});return Ge.observe(e),V.current={wake:()=>{P=!0,Q()},setItems:Ce},Me(),Ce(B.current),()=>{N=!1,M=!1,V.current=null,cancelAnimationFrame(j),We.disconnect(),Ge.disconnect(),e.removeEventListener(`pointerdown`,Pe),e.removeEventListener(`pointermove`,Fe),e.removeEventListener(`pointerup`,Ie),e.removeEventListener(`pointerleave`,Le),e.removeEventListener(`pointercancel`,Re),e.removeEventListener(`wheel`,ze),e.removeEventListener(`keydown`,Be),e.removeEventListener(`focus`,Ve),e.removeEventListener(`blur`,He),document.removeEventListener(`visibilitychange`,Ue),u.removeEventListener(`webglcontextlost`,d),u.removeEventListener(`webglcontextrestored`,f),w.forEach(e=>e.dispose()),w=[],s.getExtension(`WEBGL_lose_context`)?.loseContext(),u.parentNode&&u.parentNode.removeChild(u)}},[ye]);let q=G[H]||G[0],J=q?q.title||q.alt||`Image ${H+1}`:``;return(0,d.jsxs)(`div`,{ref:fe,className:`flex-carousel ${R}`.trim(),style:{...de,"--flex-carousel-half":`${Math.min(Math.max(f,.05),1)*50}%`},role:`region`,"aria-roledescription":`carousel`,"aria-label":`Image carousel`,tabIndex:0,children:[F&&q&&he&&(0,d.jsxs)(`div`,{className:`flex-carousel__caption`,"aria-hidden":`true`,children:[(0,d.jsxs)(`span`,{className:`flex-carousel__title`,children:[q.title||q.alt,q.subtitle&&(0,d.jsx)(`span`,{className:`flex-carousel__subtitle`,children:q.subtitle})]},H),(0,d.jsxs)(`span`,{className:`flex-carousel__count`,"data-hidden":_e?``:void 0,children:[(0,d.jsx)(S,{value:H+1}),(0,d.jsx)(`span`,{className:`flex-carousel__slash`,children:`/`}),(0,d.jsx)(`span`,{children:String(G.length).padStart(2,`0`)})]})]}),(0,d.jsx)(`div`,{className:`flex-carousel__live`,"aria-live":`polite`,"aria-atomic":`true`,children:`${J}, ${H+1} of ${G.length}`})]})};export{oe as default};