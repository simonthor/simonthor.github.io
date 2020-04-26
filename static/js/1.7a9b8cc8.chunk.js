(this["webpackJsonpsimonthor.github.io"]=this["webpackJsonpsimonthor.github.io"]||[]).push([[1],{42:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a(6),s=a(7),i=a(9),o=a(8),l=a(10),c=a(0),m=a.n(c),u=a(64),h=a(3);function p(){var e=Object(n.a)(["\n            cursor: pointer;\n            border: solid 1px #f2f2f2;\n            padding: 15px;\n            background-color: #000f29;\n            color: #FFF;\n        "]);return p=function(){return e},e}var g=function(e){function t(e){var a;Object(r.a)(this,t),a=Object(i.a)(this,Object(o.a)(t).call(this,e));var n=h.a.div(p());return a.state={open:!1,header:n},a}return Object(l.a)(t,e),Object(s.a)(t,[{key:"togglePanel",value:function(e){this.setState({open:!this.state.open})}},{key:"render",value:function(){var e=this;return m.a.createElement("div",null,m.a.createElement(this.state.header,{onClick:function(t){return e.togglePanel(t)}},this.props.title),this.state.open?m.a.createElement("div",{className:"content"},this.props.children):null)}}]),t}(m.a.Component);function v(){var e=Object(n.a)(["grid-area: ",""]);return v=function(){return e},e}function d(){var e=Object(n.a)(['\n            display: grid;\n            width: 100%;\n            height: 3rem;\n            margin-bottom: 1rem;\n            grid-template-areas: \n            "search search search search searchButton"\n            "season subject type age archive"; {/*include separate academic and age bars?*/}\n        ']);return d=function(){return e},e}a.d(t,"default",(function(){return f}));var f=function(e){function t(e){var a;Object(r.a)(this,t),a=Object(i.a)(this,Object(o.a)(t).call(this,e));var n=h.a.div(d()),s={search:"input",searchButton:"button",season:"select",subject:"select",type:"select",age:"div",archive:"div"},l={},c={};for(var p in s)c[p]=Object(h.a)(s[p])(v(),p),l[p]=m.a.createRef();return a.state={Navigator:n,navWidgets:c,sortedTips:u,refs:l},a}return Object(l.a)(t,e),Object(s.a)(t,[{key:"conditionsFullFilled",value:function(e,t){return!(e.season!==t.season&&"all"!==t.season||!e.type.includes(t.type)&&"all"!==t.type||e.subject!==t.subject&&"all"!==t.subject||t.age&&e["academic level"].hasOwnProperty("age")&&!e["academic level"].age.includes(parseInt(t.age,10)))&&(!e.hasOwnProperty("archive")||e.archive&&t.archive)}},{key:"getTips",value:function(){var e=this,t={};for(var a in this.state.refs){var n=this.state.refs[a];null===n.current?t[a]=n.value:"checkbox"===n.current.type?t[a]=n.current.checked:t[a]=n.current.value}var r=[];u.forEach((function(a){e.conditionsFullFilled(a,t)&&r.push(a)})),this.setState({sortedTips:r})}},{key:"render",value:function(){var e=this,t=this.state.navWidgets;return m.a.createElement(m.a.Fragment,null,m.a.createElement("h1",null,"Tips and Links to STEM-related Activities"),m.a.createElement(this.state.Navigator,null,m.a.createElement(t.search,{type:"text",placeholder:"Enter some text...",ref:this.state.refs.searchBar}),m.a.createElement(t.searchButton,{onClick:function(){e.getTips()}},"Search"),m.a.createElement(t.season,{ref:this.state.refs.season},m.a.createElement("option",{value:"all"},"all"),m.a.createElement("option",{value:"spring"},"spring"),m.a.createElement("option",{value:"summer"},"summer"),m.a.createElement("option",{value:"autumn"},"autumn"),m.a.createElement("option",{value:"winter"},"winter")),m.a.createElement(t.subject,{ref:this.state.refs.subject},m.a.createElement("option",{value:"all"},"all"),m.a.createElement("option",{value:"physics"},"physics"),m.a.createElement("option",{value:"programming"},"programming"),m.a.createElement("option",{value:"astronomy"},"astronomy"),m.a.createElement("option",{value:"mathematics"},"mathematics"),m.a.createElement("option",{value:"biology"},"biology"),m.a.createElement("option",{value:"biology"},"biology")),m.a.createElement(t.type,{ref:this.state.refs.type},m.a.createElement("option",{value:"all"},"all"),m.a.createElement("option",{value:"camp"},"camp"),m.a.createElement("option",{value:"association"},"association"),m.a.createElement("option",{value:"competition"},"competition"),m.a.createElement("option",{value:"research"},"research")),m.a.createElement(t.age,null,m.a.createElement("label",{htmlFor:"age"},"Age:"),m.a.createElement("input",{type:"number",name:"age",min:"5",max:"30",ref:this.state.refs.age})),m.a.createElement(t.archive,null,m.a.createElement("input",{type:"checkbox",name:"archive",ref:this.state.refs.archive}),m.a.createElement("label",{htmlFor:"archive"},"Include archive"))),this.state.sortedTips.map((function(e){return m.a.createElement(g,{title:e.name,key:e.name},e.links.map((function(e){return m.a.createElement("a",{style:{marginRight:"1rem"},href:e,key:e},"Link")})),m.a.createElement("p",null,e.info))})))}}]),t}(m.a.Component)},64:function(e){e.exports=JSON.parse('[{"name":"Research Science Institute","links":["https://ungaforskare.se/stipendier-gymnasiet","https://www.cee.org/research-science-institute"],"info":null,"type":["research","camp"],"subject":"STEM","academic level":{"high school":[2]},"season":"summer","months":[6,7,8]},{"name":"ESO Astronomy Camp","links":["https://au.se/astronomistipendium"],"info":null,"type":["camp"],"subject":"astronomy","academic level":{"high school":[1,2,3]},"season":"winter","months":[12]},{"name":"Forskarm\xf6ten","links":["https://www.sverigesungaakademi.se/1252.html"],"info":null,"type":["camp"],"subject":"STEM","academic level":{"high school":[2]},"season":"summer","months":[8]},{"name":"Lise Meitner-dagarna","links":["https://lisemeitnerdagarna.se"],"info":null,"type":["camp"],"subject":"physics","academic level":{"high school":[1,2,3]},"season":"autumn","months":[11]},{"name":"Knut Lundmark-dagarna","links":["http://au.se/kld"],"info":null,"type":["camp"],"subject":"astronomy","academic level":{"high school":[1,2,3]},"season":"spring","months":[4]},{"name":"Berzelius-dagarna","links":["https://berzeliusdagarna.se"],"info":null,"type":["camp"],"subject":"chemistry","academic level":{"high school":[1,2,3]},"season":"winter","months":[1]},{"name":"Sonja Kovalevsky-dagarna","links":["https://www.miun.se/mot-mittuniversitetet/samverkan/run/sonja-kovalevsky-dagarna-2019"],"info":null,"type":["camp"],"subject":"mathematics","academic level":{"high school":[1,2,3]},"season":"autumn"},{"name":"Linn\xe9dagarna","links":["https://biologilararna.se/linnedagarna"],"info":null,"type":["camp"],"subject":"biology","academic level":{"high school":[1,2,3]},"season":"autumn"},{"name":"Beamline for Schools","links":["https://beamlineforschools.cern"],"info":"Beamline for schools \xe4r en t\xe4vling f\xf6r d\xe4r gymnasieelever bildar lag och f\xf6resl\xe5r ett forskningsprojekt som involverar en partikelaccelerator. Om man vinner t\xe4vlingen f\xe5r man \xe5ka till CERN f\xf6r att genomf\xf6ra sitt f\xf6rslagna forskningsprojekt.","type":["competition"],"subject":"physics","academic level":{"high school":[1,2,3]},"season":"autumn"},{"name":"Breakthrough Junior Challenge","links":["https://breakthroughjuniorchallenge.org"],"info":"I denna t\xe4vling skickar man in en video d\xe4r man f\xf6rklarar ett naturvetenskapligt fenomen/koncept p\xe5 ett l\xe4ttf\xf6rst\xe5eligt s\xe4tt. Alla ungdomar fr\xe5n hela v\xe4rlden mellan 13 och 18 \xe5r kan delta och om man vinner s\xe5 f\xe5r man ett efter-gymnasialt stipendium p\xe5 $250,000, l\xe4raren f\xe5r $50 000 och $100 000 till Breakthrough Science Lab [vet ej vad detta \xe4r], samt en resa till prisceremonin. Detta pris \xe4r extremt prestigefullt och mycket sv\xe5rt att vinna.","type":["competition"],"subject":"STEM","academic level":{"age":[13,14,15,16,17,18]},"season":"spring"},{"name":"Unga Astropartikelfysikf\xf6reningen","links":["https://au.se/astropartikelfysik","https://www.facebook.com/groups/350454222046546/"],"info":"En f\xf6rening med fokus p\xe5 astropartikelfysik. Anordnar bland annat onlinediskussionsseminarium och en mininobelmiddag.","type":["association"],"subject":"physics","academic level":{"age":[13,14,15,16,17,18,19,20,21,22,23,24,25]},"season":"all"},{"name":"Digital Ungdom","links":["https://digitalungdom.se"],"info":"Ett f\xf6rbund med fokus p\xe5 programmering och datorer.","type":["association"],"subject":"computer science","academic level":{"high school":[1,2,3],"university":[1,2,3,4,5]},"season":"all"},{"name":"Unga Forskare","links":["https://ungaforskare.se"],"info":"Ett f\xf6rbund med fokus p\xe5 all naturvetenskap. Anordnar t\xe4vlingar, sommarforskarskolor, m.m.","type":["association"],"subject":"STEM","academic level":{"age":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]},"season":"all"},{"name":"Summer STEM Institute","links":["https://www.summersteminstitute.org"],"info":"Kostar pengar","type":["camp"],"subject":"STEM","academic level":{"high school":[1,2,3]},"season":"summer"},{"name":"S\'Cool LAB Summer Camp","links":["https://scoollab.web.cern.ch/"],"info":"Detta \xe4r ett tolv dagar l\xe5ngt sommarl\xe4ger som anordnas vid CERN i Schweiz. 30 gymnasieelever fr\xe5n hela v\xe4rlden samlas under slutet av juli och b\xf6rjan av augusti f\xf6r att l\xe4ra sig om partikelfysik genom f\xf6rel\xe4sningar, studiebes\xf6k och andra aktiviteter. L\xe4gret och resan dit \xe4r helt gratis, men konkurrensen \xe4r mycket h\xf6g.","type":"camp","subject":"physics","academic level":{"high school":[2,3]},"season":"summer","archive":true}]')}}]);
//# sourceMappingURL=1.7a9b8cc8.chunk.js.map