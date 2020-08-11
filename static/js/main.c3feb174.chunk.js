(this["webpackJsonpsimonthor.github.io"]=this["webpackJsonpsimonthor.github.io"]||[]).push([[7],{16:function(n){n.exports=JSON.parse('[{"text":"About","href":"/about","radius":0,"height":7,"image":"sun"},{"text":"Programming","href":"/programming","radius":30,"height":4,"image":"earth"},{"text":"Research","href":"/research","radius":45,"height":3,"image":"mars"},{"text":"Tips","href":"/tips","radius":65,"height":6,"image":"jupiter"},{"text":"games","href":"/games","radius":90,"height":4.5,"width-rel":2.08,"image":"saturn"}]')},17:function(n,e,t){"use strict";t.d(e,"a",(function(){return x}));var a=t(30),r=t(2),i=t(6),o=t(7),s=t(9),c=t(8),l=t(10),u=t(0),d=t.n(u),m=t(3),h=t(14),p=t(31);function g(){var n=Object(r.a)(["\n                position: fixed;\n                margin-top: ","rem; margin-left: ","rem;\n                top: 50%; left: 50%;\n                animation: "," ","s linear infinite;\n                \n                &:hover {\n                    animation-play-state: paused;\n                }\n            }\n\n            "]);return g=function(){return n},n}function f(){var n=Object(r.a)(["\n                from {\n                    transform: rotate(0deg) translateX(","px) rotate(0deg)\n                }\n                to {\n                    transform: rotate(360deg) translateX(","px) rotate(-360deg);\n                }\n            "]);return f=function(){return n},n}function b(){var n=Object(r.a)(["\n            display: inline-block;\n            text-align: center;\n            color: white;\n            height: ","rem; width: ","rem; line-height: ",'rem;\n            background-image: url("','");\n            background-size: cover;\n        ']);return b=function(){return n},n}var x=function(n){function e(n){var r;Object(i.a)(this,e),r=Object(s.a)(this,Object(c.a)(e).call(this,n));var o=n["width-rel"]?n["width-rel"]*n.height:n.height,l=Object(m.a)(h.b)(b(),n.height,o,n.height,t(28)("./"+n.image+".svg"));if(n.hasOwnProperty("radius")){var u=Math.floor(n.radius/100*Math.min(window.innerWidth,window.innerHeight)/2),d=Math.floor(Math.sqrt(.05*Math.pow(n.radius,3))),p=Object(m.b)(f(),u,u);l=Object(m.a)(l)(g(),-n.height/2,-o/2,p,d)}return r.state=Object(a.a)({content:l},n),r}return Object(l.a)(e,n),Object(o.a)(e,[{key:"render",value:function(){var n=this.state.content;return d.a.createElement(d.a.Fragment,null,d.a.createElement(p.a,{id:this.state.text+"-p",place:"bottom",type:"dark",effect:"float"}),d.a.createElement(n,{to:this.state.href,image:this.image,"data-for":this.state.text+"-p","data-tip":this.state.text}))}}]),e}(d.a.Component)},19:function(n,e,t){"use strict";t.r(e),t.d(e,"default",(function(){return f}));var a=t(20),r=t(2),i=t(6),o=t(7),s=t(9),c=t(8),l=t(10),u=t(16),d=t(0),m=t.n(d),h=t(3),p=t(17);function g(){var n=Object(r.a)(["\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n        "]);return g=function(){return n},n}var f=function(n){function e(n){var t;return Object(i.a)(this,e),(t=Object(s.a)(this,Object(c.a)(e).call(this,n))).handleWindowSizeChange=function(){t.setState({screenWidth:window.innerWidth,screenHeight:window.innerHeight})},t.MobileContainer=h.a.div(g()),t.state={screenWidth:window.innerWidth,screenHeight:window.innerHeight},t}return Object(l.a)(e,n),Object(o.a)(e,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.handleWindowSizeChange)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.handleWindowSizeChange)}},{key:"render",value:function(){var n;return n=Math.min(this.state.screenWidth,this.state.screenHeight)<500?m.a.createElement(this.MobileContainer,null,u.map((function(n){n.radius;var e=Object(a.a)(n,["radius"]);return m.a.createElement(m.a.Fragment,null,m.a.createElement(p.a,Object.assign({key:n.text},e)),m.a.createElement("p",null,n.text))}))):m.a.createElement("div",null,u.map((function(n){return m.a.createElement(p.a,Object.assign({key:n.text},n))}))),m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{style:{textAlign:"center"}},m.a.createElement("h1",{style:{marginTop:0}},"Simon Thor"),m.a.createElement("p",null,"Click on one of the planets to find out more")),n)}}]),e}(m.a.Component)},28:function(n,e,t){var a={"./earth.svg":54,"./favicon.svg":55,"./jupiter.svg":56,"./mars.svg":57,"./mars_surface.svg":58,"./saturn.svg":59,"./sun.svg":60};function r(n){var e=i(n);return t(e)}function i(n){if(!t.o(a,n)){var e=new Error("Cannot find module '"+n+"'");throw e.code="MODULE_NOT_FOUND",e}return a[n]}r.keys=function(){return Object.keys(a)},r.resolve=i,n.exports=r,r.id=28},45:function(n,e,t){n.exports=t(65)},47:function(n,e,t){},54:function(n,e,t){n.exports=t.p+"static/media/earth.a61bde29.svg"},55:function(n,e,t){n.exports=t.p+"static/media/favicon.0d641bee.svg"},56:function(n,e,t){n.exports=t.p+"static/media/jupiter.be7e0851.svg"},57:function(n,e,t){n.exports=t.p+"static/media/mars.c26dcf45.svg"},58:function(n,e,t){n.exports=t.p+"static/media/mars_surface.9460e81a.svg"},59:function(n,e,t){n.exports=t.p+"static/media/saturn.610e4d28.svg"},60:function(n,e,t){n.exports=t.p+"static/media/sun.fec77f65.svg"},61:function(n,e,t){var a={"./about":[38,2],"./about.jsx":[38,2],"./error":[39,3],"./error.jsx":[39,3],"./games":[40,4],"./games.jsx":[40,4],"./games/tictactoe":[43,0],"./games/tictactoe.jsx":[43,0],"./programming":[41,5],"./programming.jsx":[41,5],"./research":[42,6],"./research.jsx":[42,6],"./solar-system":[19],"./solar-system.jsx":[19],"./tips":[44,1],"./tips.jsx":[44,1]};function r(n){if(!t.o(a,n))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+n+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=a[n],r=e[0];return Promise.all(e.slice(1).map(t.e)).then((function(){return t(r)}))}r.keys=function(){return Object.keys(a)},r.id=61,n.exports=r},65:function(n,e,t){"use strict";t.r(e);var a=t(6),r=t(7),i=t(9),o=t(8),s=t(10),c=t(0),l=t.n(c),u=(t(47),t(14)),d=t(13),m=t(19),h=t(20),p=t(36),g=t(17),f=t(16),b=function(n){function e(n){var t;Object(a.a)(this,e);return(t=Object(i.a)(this,Object(o.a)(e).call(this,n))).state={planets:[{text:"Home",href:"/",image:"favicon"}].concat(Object(p.a)(f))},t}return Object(s.a)(e,n),Object(r.a)(e,[{key:"customizeProps",value:function(n){n.radius;var e=Object(h.a)(n,["radius"]);return e.height=2.5,e}},{key:"render",value:function(){var n=this,e=this.state.planets;return l.a.createElement("nav",{style:{margin:"1rem"}},e.map((function(e){return l.a.createElement(l.a.Fragment,{key:e.text+"-f"},l.a.createElement(g.a,Object.assign({key:e.text},n.customizeProps(e))),l.a.createElement("span",{key:e.text+"-m",style:{marginRight:"1rem"}}))})))}}]),e}(l.a.Component),x=t(2),v=t(3);function j(){var n=Object(x.a)(["\n            position: fixed;\n            bottom: 0;\n            right: 0;\n            font-size: 0.8rem;\n            color: #fff;\n            background-color: #2b2b2b;\n            border-radius: 2px;\n            -moz-border-radius: 2px;\n            -webkit-border-radius: 2px;\n            padding: 3px;\n            margin: 3px;\n            box-shadow: 0 0 10px rgba(0,0,0,.1);\n        "]);return j=function(){return n},n}function w(){var n=v.a.p(j());return l.a.createElement(n,null,"\xa9 Simon Thor 2020")}function O(){var n=Object(x.a)(["\n            background-image: url(",");\n            position: absolute;\n            bottom: 0;\n            height: 10rem;\n            width: 100%;\n            background-size: cover;\n            background-repeat: no-repeat;\n        "]);return O=function(){return n},n}function E(){var n=Object(x.a)(["\n            flex: 1;\n            background-image: linear-gradient(#000115, #1f1844, lightblue);\n            max-width: 100%;\n            min-height: 100%;\n            padding-right: 1rem; padding-left: 1rem;\n            \n            /*\n             * The CSS below is a modified version of the Slate theme.\n             * Reference: https://github.com/pages-themes/slate\n             */\n            & h1, h2, h3, h4, h5, h6 {\n                margin: 10px 0;\n                font-weight: 700;\n                color: white;\n                font-family: inherit;\n                letter-spacing: -1px;\n            }\n            \n            & h1 {\n              font-size: 36px;\n              font-weight: 700;\n            }\n            \n            & h2 {\n              padding-bottom: 10px;\n              font-size: 32px;\n            }\n            \n            & h3 {\n              font-size: 24px;\n            }\n            \n            & h4 {\n              font-size: 21px;\n            }\n            \n            & h5 {\n              font-size: 18px;\n            }\n            \n            & h6 {\n              font-size: 16px;\n            }\n            \n            & p {\n              margin: 10px 0 15px 0;\n            }\n            \n            & footer p {\n              color: #f2f2f2;\n            }\n            \n            & a {\n              text-decoration: none;\n              color: #0F79D0;\n              text-shadow: none;\n            }\n            \n            & a:hover, a:focus {\n              text-decoration: underline;\n            }\n            \n            & footer a {\n              color: #F2F2F2;\n              text-decoration: underline;\n            }\n            \n            & em, cite {\n              font-style: italic;\n            }\n            \n            & strong {\n              font-weight: bold;\n            }\n            \n            & img {\n              position: relative;\n              max-width: 739px;\n              padding: 5px;\n              margin: 10px 0 10px 0;\n              border: 1px solid #ebebeb;\n            \n              box-shadow: 0 0 5px #ebebeb;\n              -webkit-box-shadow: 0 0 5px #ebebeb;\n              -moz-box-shadow: 0 0 5px #ebebeb;\n              -o-box-shadow: 0 0 5px #ebebeb;\n            }\n            \n            & p img {\n              display: inline;\n              margin: 0;\n              padding: 0;\n              vertical-align: middle;\n              text-align: center;\n              border: none;\n            }\n            \n            & pre, code {\n              color: #fff;\n              background-color: #2b2b2b;\n            \n              font-family: Monaco, \"Bitstream Vera Sans Mono\", \"Lucida Console\", Terminal, monospace;\n              font-size: 0.875em;\n            \n              border-radius: 2px;\n              -moz-border-radius: 2px;\n              -webkit-border-radius: 2px;\n            }\n            \n            & pre {\n              padding: 10px;\n              box-shadow: 0 0 10px rgba(0,0,0,.1);\n              overflow: auto;\n            }\n            \n            & code {\n              padding: 3px;\n              margin: 0 3px;\n              box-shadow: 0 0 10px rgba(0,0,0,.1);\n            }\n            \n            & pre code {\n              display: block;\n              box-shadow: none;\n            }\n            \n            & blockquote {\n              color: #666;\n              margin-bottom: 20px;\n              padding: 0 0 0 20px;\n              border-left: 3px solid #bbb;\n            }\n            \n            \n            & ul, ol, dl {\n              margin-bottom: 15px\n            }\n            \n            & ul {\n              list-style: disc inside;\n              padding-left: 20px;\n            }\n            \n            & ol {\n              list-style: decimal inside;\n              padding-left: 20px;\n            }\n            \n            & dl dt {\n              font-weight: bold;\n            }\n            \n            & dl dd {\n              padding-left: 20px;\n              font-style: italic;\n            }\n            \n            & dl p {\n              padding-left: 20px;\n              font-style: italic;\n            }\n            \n            & hr {\n              height: 1px;\n              margin-bottom: 5px;\n              border: none;\n            }\n            \n            & table {\n              border: 1px solid #373737;\n              margin-bottom: 20px;\n              text-align: left;\n             }\n            \n            & th {\n              font-family: 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n              padding: 10px;\n              background: #373737;\n              color: #fff;\n             }\n            \n            & td {\n              padding: 10px;\n              border: 1px solid #373737;\n             }\n            \n            & form {\n              background: #f2f2f2;\n              padding: 20px;\n            }\n        "]);return E=function(){return n},n}var y=function(n){function e(n){var r;Object(a.a)(this,e),r=Object(i.a)(this,Object(o.a)(e).call(this,n));var s=l.a.lazy((function(){return t(61)("./"+r.state.props.src)})),c=v.a.div(E()),u=v.a.div(O(),t(28)("./"+n.image+".svg"));return r.state={content:s,background:c,planet:u,props:n},r}return Object(s.a)(e,n),Object(r.a)(e,[{key:"render",value:function(){return l.a.createElement(this.state.background,null,l.a.createElement(l.a.Suspense,{fallback:"loading..."},l.a.createElement(this.state.content,null)),l.a.createElement("span",{style:{height:"1rem",display:"block"}}))}}]),e}(l.a.Component);function k(){var n=Object(x.a)(["\n        border: red;\n    "]);return k=function(){return n},n}function z(n){var e=Object(v.a)("div")(k());return l.a.createElement(e,null,l.a.createElement("p",null,"hi"))}var C=function(n){function e(n){var t;Object(a.a)(this,e);return(t=Object(i.a)(this,Object(o.a)(e).call(this,n))).state={pagePaths:[{path:"/about",image:"sun"},{path:"/tips",image:"jupiter"},{path:"/programming",image:"earth"},{path:"/research",image:"mars"},{path:"/games",image:"saturn"}]},t}return Object(s.a)(e,n),Object(r.a)(e,[{key:"render",value:function(){return l.a.createElement(l.a.Fragment,null,l.a.createElement(u.a,null,l.a.createElement(d.a,{path:"/",render:function(n){return"/"!==n.location.pathname&&l.a.createElement(b,{key:"header"})}}),l.a.createElement(d.c,null,this.state.pagePaths.map((function(n){return l.a.createElement(d.a,{path:n.path,key:n.path+"-r"},l.a.createElement(y,{key:n.path,src:n.path.substring(1),image:n.image}))})),l.a.createElement(d.a,{path:"/test"},l.a.createElement(z,null)),l.a.createElement(d.a,{exact:!0,path:"/"},l.a.createElement(m.default,null)),l.a.createElement(d.a,null,l.a.createElement(y,{src:"error"})))),l.a.createElement(w,null))}}]),e}(l.a.Component),M=t(29);t.n(M).a.render(l.a.createElement(C,null),document.getElementById("root"))}},[[45,8,9]]]);
//# sourceMappingURL=main.c3feb174.chunk.js.map