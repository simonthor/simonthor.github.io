(this["webpackJsonpsimonthor.github.io"]=this["webpackJsonpsimonthor.github.io"]||[]).push([[0],{41:function(e,t,r){"use strict";function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var r=[],n=!0,a=!1,i=void 0;try{for(var s,u=e[Symbol.iterator]();!(n=(s=u.next()).done)&&(r.push(s.value),!t||r.length!==t);n=!0);}catch(l){a=!0,i=l}finally{try{n||null==u.return||u.return()}finally{if(a)throw i}}return r}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}r.r(t);var a=r(6),i=r(7),s=r(9),u=r(8),l=r(10),c=r(0),o=r.n(c),h=r(27),d=r.n(h);r(63);function m(e){return o.a.createElement("button",{className:"square",onClick:e.onClick},e.value)}var v=function(e){function t(e){var r;return Object(a.a)(this,t),(r=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={squares:Array(9).fill(null),xNext:!0,winner:null},r}return Object(l.a)(t,e),Object(i.a)(t,[{key:"renderSquare",value:function(e){var t=this;return o.a.createElement(m,{value:this.state.squares[e],onClick:function(){t.handleClick(e)}})}},{key:"handleClick",value:function(e){if(!this.state.squares[e]&&!this.state.winner){var t=this.state.squares.slice();t[e]=this.state.xNext?"X":"O",this.setState({squares:t,xNext:!this.state.xNext})}var r=this.calculateWinner(this.state.squares);console.log(r),this.setState({winner:r})}},{key:"calculateWinner",value:function(e){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],r=0;r<t.length;r++){var a=n(t[r],3),i=a[0],s=a[1],u=a[2];if(e[i]&&e[i]===e[s]&&e[i]===e[u])return e[i]}return null}},{key:"render",value:function(){var e;return e=this.state.winner?"Winner: "+this.state.winner:"Next player: "+(this.state.xNext?"X":"O"),o.a.createElement("div",null,o.a.createElement("div",{className:"status"},e),o.a.createElement("div",{className:"board-row"},this.renderSquare(0),this.renderSquare(1),this.renderSquare(2)),o.a.createElement("div",{className:"board-row"},this.renderSquare(3),this.renderSquare(4),this.renderSquare(5)),o.a.createElement("div",{className:"board-row"},this.renderSquare(6),this.renderSquare(7),this.renderSquare(8)))}}]),t}(o.a.Component),f=function(e){function t(){return Object(a.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"game"},o.a.createElement("div",{className:"game-board"},o.a.createElement(v,null)))}}]),t}(o.a.Component);d.a.render(o.a.createElement(f,null),document.getElementById("root"))},63:function(e,t,r){}}]);
//# sourceMappingURL=0.ecdbd3e5.chunk.js.map