import{r as l,j as o}from"./index-DThgZ-3i.js";function ot(){const p=l.useRef(null),[U,I]=l.useState(!0),[v,T]=l.useState("#62A0EA"),[b,Y]=l.useState(32),[M,X]=l.useState(500),[n,R]=l.useState({xMin:-2,xMax:1,yMin:-1.5,yMax:1.5}),[F,w]=l.useState(!1),[A,P]=l.useState({x:0,y:0}),[S,B]=l.useState("zr*zr - zi*zi + cr"),[C,j]=l.useState(""),[z,G]=l.useState("abs(2*zr*zi) + ci"),O=()=>{const e=p.current;if(!e)return;const i=e.width,m=e.height,{xMin:c,xMax:s,yMin:u,yMax:h}=n;I(!0);const t=e.getContext("webgl")||e.getContext("experimental-webgl"),d=a=>{const x=parseInt(a.slice(1,3),16)/255,f=parseInt(a.slice(3,5),16)/255,y=parseInt(a.slice(5,7),16)/255;return[x,f,y]};if(!t){j("WebGL not supported :(");return}const g=a=>{if(!a)return"0.0";let x=a.replace(/(\b\d+)(?!\.)\b/g,"$1.0");return x=x.replace(/([0-9A-Za-z_\)\.\]\}]+)\s*\^\s*([0-9A-Za-z_\(\.\[\{]+)/g,"pow($1,$2)"),x},_=g(S),W=g(z),$=`
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            // map from [-1,1] -> [0,1], then flip Y to match canvas coord system
            v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
        `,q=`
        // Use high precision for better zoom levels
        precision highp float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_xMin;
        uniform float u_xMax;
        uniform float u_yMin;
        uniform float u_yMax;
        uniform int u_maxIter;
        uniform vec3 u_color;

        // user-provided expressions will use zr, zi, cr, ci
        float sqr(float x){ return x*x; }

        void main() {
            vec2 frag = v_uv * u_resolution;
            float x = frag.x;
            float y = frag.y;
            float cr = u_xMin + (x / u_resolution.x) * (u_xMax - u_xMin);
            float ci = u_yMin + (y / u_resolution.y) * (u_yMax - u_yMin);

            float zr = 0.0;
            float zi = 0.0;
            int iter = 0;
            // GLSL requires constant loop bound; set safely above typical max
            const int MAX_LOOP = 512;
            for (int i = 0; i < MAX_LOOP; i++) {
            if (i >= u_maxIter) break;

            // Injected user expressions (must use zr,zi,cr,ci and GLSL functions)
            float newZr = ${_};
            float newZi = ${W};

            zr = newZr;
            zi = newZi;

            if (sqr(zr) + sqr(zi) > 4.0) {
                iter = i + 1;
                break;
            }
            // if we reach the max provided iter without escape, mark as inside
            if (i == u_maxIter - 1) {
                iter = u_maxIter;
            }
            }

            if (iter == u_maxIter) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
            float t = float(iter) / float(u_maxIter);
            vec3 col = u_color * t;
            gl_FragColor = vec4(col, 1.0);
            }
        }
        `,E=(a,x)=>{const f=t.createShader(x);if(t.shaderSource(f,a),t.compileShader(f),!t.getShaderParameter(f,t.COMPILE_STATUS)){const y=t.getShaderInfoLog(f);throw t.deleteShader(f),new Error(y)}return f};let r;try{const a=E($,t.VERTEX_SHADER),x=E(q,t.FRAGMENT_SHADER);if(r=t.createProgram(),t.attachShader(r,a),t.attachShader(r,x),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(r))}catch(a){console.warn("WebGL shader failed, falling back to CPU:",a.message)}if(r){t.viewport(0,0,i,m),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const a=t.getAttribLocation(r,"a_position"),x=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,x);const f=new Float32Array([-1,-1,1,-1,-1,1,1,1]);t.bufferData(t.ARRAY_BUFFER,f,t.STATIC_DRAW),t.useProgram(r),t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);const y=t.getUniformLocation(r,"u_resolution"),H=t.getUniformLocation(r,"u_xMin"),K=t.getUniformLocation(r,"u_xMax"),J=t.getUniformLocation(r,"u_yMin"),Q=t.getUniformLocation(r,"u_yMax"),tt=t.getUniformLocation(r,"u_maxIter"),et=t.getUniformLocation(r,"u_color");t.uniform2f(y,i,m),t.uniform1f(H,c),t.uniform1f(K,s),t.uniform1f(J,u),t.uniform1f(Q,h),t.uniform1i(tt,Math.min(b,512));const L=d(v);t.uniform3f(et,L[0],L[1],L[2]),t.drawArrays(t.TRIANGLE_STRIP,0,4),I(!1);return}};l.useEffect(()=>{O()},[n,b,M,S,z,v]);const N=e=>{w(!0),P({x:e.clientX,y:e.clientY})},D=e=>{if(!F)return;const i=p.current;if(!i)return;const m=i.width,c=i.height,s=e.clientX-A.x,u=e.clientY-A.y,h=n.xMax-n.xMin,t=n.yMax-n.yMin,d=s/m*h,g=u/c*t;R({xMin:n.xMin-d,xMax:n.xMax-d,yMin:n.yMin-g,yMax:n.yMax-g}),P({x:e.clientX,y:e.clientY})},k=()=>{w(!1)},V=()=>{w(!1)},Z=e=>{e.preventDefault();const i=p.current;if(!i)return;const m=i.getBoundingClientRect(),c=e.clientX-m.left,s=e.clientY-m.top,u=i.width,h=i.height,t={x:n.xMin+c/u*(n.xMax-n.xMin),y:n.yMin+s/h*(n.yMax-n.yMin)},d=e.deltaY>0?1.2:.8,g=(n.xMax-n.xMin)*d,_=(n.yMax-n.yMin)*d;R({xMin:t.x-c/u*g,xMax:t.x+(1-c/u)*g,yMin:t.y-s/h*_,yMax:t.y+(1-s/h)*_})};return o.jsxs("div",{className:"fractal-container",children:[o.jsx("h1",{children:"Fractal explorer"}),o.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[o.jsxs("div",{className:"fractal-controls",style:{flex:"0 0 40%",marginRight:"20px",fontSize:"1.5em"},children:[o.jsx("h2",{children:"Controls"}),o.jsxs("label",{htmlFor:"resolution",children:["Resolution: ",M,"x",M]}),o.jsx("br",{}),o.jsx("input",{type:"range",id:"resolution",name:"resolution",min:"100",max:"1000",step:"10",style:{width:"100%"},defaultValue:"500",onChange:e=>X(parseInt(e.target.value))}),o.jsx("br",{}),o.jsxs("label",{htmlFor:"iterations",children:["Number of colors: ",b]}),o.jsx("br",{}),o.jsx("input",{type:"range",id:"iterations",name:"iterations",min:"1",max:"256",style:{width:"100%"},defaultValue:"32",onChange:e=>Y(parseInt(e.target.value))}),o.jsx("br",{}),o.jsxs("label",{htmlFor:"customRealFunction",children:["z",o.jsx("sub",{children:"i+1"}),"= "]}),o.jsx("input",{type:"text",id:"customRealFunction",value:S,onChange:e=>{B(e.target.value),j("")},placeholder:"e.g., zr^2 - zi^2 + cr",style:{width:"40%",marginBottom:"10px",fontSize:"1em"}}),o.jsx("label",{htmlFor:"customImagFunction",children:" + i"}),o.jsx("input",{type:"text",id:"customImagFunction",value:z,onChange:e=>{G(e.target.value),j("")},placeholder:"e.g., abs(2*zr*zi) + ci",style:{width:"40%",marginBottom:"10px",fontSize:"1em"}}),o.jsx("br",{}),C&&o.jsx("p",{style:{color:"red"},children:C}),o.jsx("label",{htmlFor:"color",children:"Color:"}),o.jsx("input",{type:"color",id:"color",name:"color",value:v,onChange:e=>{T(e.target.value)}}),o.jsx("p",{children:"Click and drag to pan, scroll to zoom"}),(()=>{const e=n.xMax-n.xMin,i=n.yMax-n.yMin,m=s=>{const u=Math.abs(s)>0?Math.abs(s):1;return Math.max(4,Math.ceil(-Math.log10(u))+1)},c=(s,u)=>{const h=m(u);try{return Number(s).toPrecision(h)}catch{return String(s)}};return o.jsxs("p",{children:["Showing ",c(n.xMin,e)," + ",c(n.yMin,i),"i"," ","to"," ",c(n.xMax,e)," + ",c(n.yMax,i),"i"]})})()]}),o.jsxs("div",{className:"fractal-section",style:{flex:1},children:[o.jsx("h2",{children:"Viewer"}),U&&o.jsx("p",{children:"Invalid recusive function. Only zr, zi, cr, ci, GLSL syntax and ^ are allowed"}),o.jsx("canvas",{ref:p,width:M,height:M,onMouseDown:N,onMouseMove:D,onMouseUp:k,onMouseLeave:V,onWheel:Z,style:{cursor:F?"grabbing":"grab"}})]})]})]})}export{ot as default};
