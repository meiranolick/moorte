/*
---
description: Rich Text Editor (WYSIWYG / NAWTE / Editor Framework) that can be applied directly to any collection of DOM elements.

copyright:
- November 2008, 2010 Sam Goody

license: OSL v3.0 (http://www.opensource.org/licenses/osl-3.0.php)

authors:
- Sam Goody <siteroller - |at| - gmail>

requires:
- core

provides: [MooRTE, MooRTE.Elements, MooRTE.Utilities, MooRTE.Range, MooRTE.Path, MooRTE.ranges, MooRTE.activeField, MooRTE.activeBar ]

credits:
- Based on the tutorial at - http://dev.opera.com/articles/view/rich-html-editing-in-the-browser-part-1.  Bravo, Olav!!
- Ideas and inspiration - Guillerr, CheeAun, HugoBuriel
- Some icons from OpenWysiwyg - http://www.openwebware.com
- Cleanup regexs from CheeAun and Ryan's work on MooEditable (methodology is our own!)
- MooRTE needs YOU!!

Join our group at: http://groups.google.com/group/moorte

...
*/
function obj(a,b){var c={};c[a]=b;return c}Browser.webkit=Browser.safari||Browser.chrome; var MooRTE=new Class({Implements:[Options],options:{floating:true,where:"before",padFloat:true,stretch:false,location:"elements",buttons:"div.Menu:[Main,File,Insert]",skin:"Word03",elements:"textarea, .rte"},initialize:function(a){this.setOptions(a);var b,c=this,d=$$(this.options.elements),f=this.options.location.substr(4,1).toLowerCase();MooRTE.activeField||MooRTE.extend({ranges:{},btnVals:[],activeField:"",activeBar:""});Browser.ie||MooRTE.btnVals.push("unselectable");d.each(function(g,j){if(g.get("tag")== "textarea"||g.get("tag")=="input")d[j]=g=c.textArea(g);if(f=="e"||!b)b=c.insertToolbar(f);if(f=="b"||f=="t"||!f)g.set("contentEditable",true);else f=="e"?c.positionToolbar(g,b):g.set("contentEditable",true).addEvents({focus:function(){c.positionToolbar(g,b)},blur:function(){this.setStyle("padding-top",this.getStyle("padding-top").slice(0,-2)-b.getFirst().getSize().y).removeClass("rteShow");b.addClass("rteHide")}});g.store("bar",b).addEvents({keydown:MooRTE.Utilities.shortcuts,keyup:MooRTE.Utilities.updateBtns, mouseup:MooRTE.Utilities.updateBtns,focus:function(){MooRTE.activeField=this;MooRTE.activeBar=b}});b.addEvent("mouseup",MooRTE.Utilities.updateBtns)});b.store("fields",d);MooRTE.activeBar=(MooRTE.activeField=d[0]).retrieve("bar");if(f=="t")b.addClass("rtePageTop").getFirst().addClass("rteTopDown");else f=="b"&&b.addClass("rtePageBottom");Browser.firefox&&MooRTE.Utilities.exec("styleWithCSS")},insertToolbar:function(a){a=(new Element("div",{"class":"rteRemove MooRTE "+(!a||a=="n"?"rteHide":""),contentEditable:false})).adopt(new Element("div", {"class":"RTE "+this.options.skin})).inject(document.body);MooRTE.activeBar=a;MooRTE.Utilities.addElements(this.options.buttons,a.getFirst(),"bottom","rteGroup_Auto");return a},positionToolbar:function(a,b){a.set("contentEditable",true).addClass("rteShow");var c=this.options,d=a.getCoordinates(),f=a.addClass("rte"+(c.stretch?"":"No")+"Stretch").getStyle("border-width").match(/(\d)/g);f=b.removeClass("rteHide").setStyle("width",d.width-(c.floating?0:f[1]*1+f[3]*1)).getFirst().getCoordinates().height; if(c.floating){if(c.padFloat){c={before:"margin-top",after:"margin-after",top:"padding-top",bottom:"padding-bottom"}[c.where];a.setStyle(c,parseInt(a.getStyle(c))+f)}b.setStyles({left:d.left,top:d.top-f>0?d.top:d.bottom}).addClass("rteFloat").getFirst().addClass("rteFloat")}else a.setStyle("padding-top",a.getStyle("padding-top").slice(0,-2)*1+f).grab(b,"top")},textArea:function(a){var b,c=(new Element("div",{text:a.get("value"),"class":"rteTextArea "+a.get("class"),styles:{width:a.getSize().x}})).setStyle(Browser.ie? "height":"min-height",a.getSize().y).inject(a,"before");if(b=a.addClass("rteHide").getParent("form"))b.addEvent("submit",function(){a.set("value",MooRTE.Utilities.clean(c))});return c}});if(!MooRTE.Path)MooRTE.Path="js/sources.json"; MooRTE.Range={create:function(a){var b=window.document.selection||window.getSelection();if(!b)return null;return MooRTE.ranges[a||"a1"]=b.rangeCount>0?b.getRangeAt(0):b.createRange?b.createRange():null},set:function(a){a=MooRTE.ranges[a||"a1"];if(a.select)a.select();else{var b=window.getSelection();b.removeAllRanges();b.addRange(a)}return MooRTE.Range},get:function(a,b){b||(b=MooRTE.Range.create());return!Browser.ie?b.toString():a.toLowerCase()=="html"?b.htmlText:b.text},insert:function(a,b){if(Browser.ie){b|| (b=MooRTE.Range.create());b.pasteHTML(a)}else MooRTE.Utilities.exec("insertHTML",a);return MooRTE.Range},wrap:function(a,b,c){c||(c=MooRTE.Range.create());a=new Element(a,b);try{Browser.ie?c.pasteHTML(a.set("html",c.htmlText).outerHTML):c.surroundContents(a)}catch(d){if(d.code==1)return false}return a},wrapText:function(a,b){var c=b.getParent(".RTE").getElement("textarea");if(a.substr(0,1)!="<")a='<span style="'+a+'">';if(Browser.ie){g=new Element(a||"span",{html:range.get()});range.pasteHTML(g)}else{var d= c.selectionStart,f=RegExp("(.{"+d+"})(.{"+(c.selectionEnd-d)+"})(.*)","m").exec(c.get("value")),g=a+f[2]+"</"+a.match(/^<(\w+)/)[1]+">";c.set("value",f[1]+g+f[3]).selectionEnd=d+g.length}return MooRTE.Range},replace:function(a,b){b||(b=MooRTE.Range.create());if(Browser.ie){var c=document.uniqueID;b.pasteHTML("<span id='"+c+"'></span>");a.replaces($(c))}else MooRTE.Utilities.exec("inserthtml",a)},parent:function(a){a||(a=MooRTE.Range.create());return Browser.ie?typeOf(a)=="object"?a.parentElement(): a:a.commonAncestorContainer}}; MooRTE.Utilities={exec:function(a){a=Array.from(arguments).flatten();var b=Browser.firefox&&"ju,in,ou".contains(a[0].substr(0,2).toLowerCase());if(b)document.designMode="on";document.execCommand(a[0],a[2]||null,a[1]||false);if(b)document.designMode="off"},shortcuts:function(a){if(a.key=="enter"){if(!Browser.ie)return;a.stop();return MooRTE.Range.insert("<br/>")}var b=MooRTE.activeBar.retrieve("shortcuts");if(a&&a.control&&b.has(a.key)){a.stop();a=MooRTE.activeBar.getElement(".rte"+b[a.key]);a.fireEvent("mousedown", a)}},updateBtns:function(){var a,b=MooRTE.activeBar.retrieve("update");b.state.each(function(c){if(c[2])c[2].bind(c[1])(c[0]);else window.document.queryCommandState(c[0])?c[1].addClass("rteSelected"):c[1].removeClass("rteSelected")});b.value.each(function(c){if(a=window.document.queryCommandValue(c[0]))c[2].bind(c[1])(c[0],a)});b.custom.each(function(){vals[2].bind(vals[1])(vals[0])})},addElements:function(a,b,c,d){b||(b=MooRTE.activeBar.getFirst());MooRTE.btnVals.args||MooRTE.btnVals.combine(["args", "shortcut","element","onClick","img","onLoad","source"]);var f=b.hasClass("MooRTE")?b:b.getParent(".MooRTE"),g=[];if(typeOf(a)=="string"){a=a.replace(/'([^']*)'|"([^"]*)"|([^{}:,\][\s]+)/gm,"'$1$2$3'");a=a.replace(/((?:[,[:]|^)\s*)('[^']+'\s*:\s*'[^']+'\s*(?=[\],}]))/gm,"$1{$2}");for(a=a.replace(/((?:[,[:]|^)\s*)('[^']+'\s*:\s*{[^{}]+})/gm,"$1{$2}");a!=(a=a.replace(/((?:[,[]|^)\s*)('[^']+'\s*:\s*\[(?:(?=([^\],\[]+))\3|\]}|[,[](?!\s*'[^']+'\s*:\s*\[([^\]]|\]})+\]))*\](?!}))/gm,"$1{$2}")););a=JSON.decode("["+ a+"]")}var j=loop=0;do{if(g[0]){a=g;g=[]}Array.from(a).each(function(e){switch(typeOf(e)){case "string":g.push(e);break;case "array":e.each(function(k){g.push(k)});loop=e.length==1;break;case "object":Object.each(e,function(k,n){g.push(obj(n,k))})}})}while(loop&&++j<5);g.each(function(e){var k,n;if(typeOf(e)=="object"){k=Object.values(e)[0];e=Object.keys(e)[0]}n=e.split(".");e=n.shift();var m=f.getElement("[class~="+d+"]"||".rte"+e);if(!m||d=="rteGroup_Auto"){var i=MooRTE.Elements[e],p="text,password,submit,button,checkbox,file,hidden,image,radio,reset".contains(i.type), q=i.element&&i.element.toLowerCase()=="textarea",r="bold,italic,underline,strikethrough,subscript,superscript,unlink,".contains(e.toLowerCase()+","),t=Object.append({href:"javascript:void(0)",unselectable:p||q?"off":"on",title:e+(i.shortcut?" (Ctrl+"+i.shortcut.capitalize()+")":""),styles:i.img?isNaN(i.img)?{"background-image":"url("+i.img+")"}:{"background-position":"0 "+-20*i.img+"px"}:{},events:{mousedown:function(o){var l=MooRTE.activeBar=this.getParent(".MooRTE"),s=l.retrieve("source");l=l.retrieve("fields"); if(!l.contains(MooRTE.activeField))MooRTE.activeField=l[0];l=MooRTE.Range.parent();if(Browser.webkit&&l.nodeType==3)l=l.parentElement;if(MooRTE.activeField.contains(l)){!i.onClick&&!s&&(!i.element||i.element=="a")?MooRTE.Utilities.exec(i.args||e):MooRTE.Utilities.eventHandler(s||"onClick",this,e);if(o&&o.stop)p||q?o.stopPropagation():o.stop()}}}},i);MooRTE.btnVals[i.element?"include":"erase"]("href").each(function(o){delete t[o]});m=(new Element(p&&!i.element?"input":i.element||"a",t)).addClass((d|| "")+" rte"+e+(n?" rte"+n:"")).inject(b,c);if(i.onUpdate||r)f.retrieve("update",{value:[],state:[],custom:[]})["fontname,fontsize,backcolor,forecolor,hilitecolor,justifyleft,justifyright,justifycenter,".contains(e.toLowerCase()+",")?"value":r?"state":"custom"].push([e,m,i.onUpdate]);if(i.shortcut)f.retrieve("shortcuts",{})[i.shortcut]=e;MooRTE.Utilities.eventHandler("onLoad",m,e);if(k)MooRTE.Utilities.addElements(k,m);else i.contains&&MooRTE.Utilities.addElements(i.contains,m)}m.removeClass("rteHide")})}, eventHandler:function(a,b,c){var d=MooRTE.Elements[c][a];switch(typeOf(d)){case "function":d.bind(b)(c,a);break;case "array":d=Array.clone(d);d.push(c,a);MooRTE.Utilities[d.shift()].run(d,b);break;case "string":a=="source"&&a.substr(0,2)!="on"?MooRTE.Range.wrapText(d,b):MooRTE.Utilities.eventHandler(d,b,c)}},group:function(a,b){var c=this,d=this.getParent(".RTE");MooRTE.btnVals.combine(["onExpand","onHide","onShow","onUpdate"]);Object.each(MooRTE.Elements[b].hides||c.getSiblings("*[class*=rteAdd]"), function(f){f.removeClass("rteSelected");d.getFirst(".rteGroup_"+f.get("class").match(/rteAdd([^ ]+?)\b/)[1]).addClass("rteHide");MooRTE.Utilities.eventHandler("onHide",c,b)});this.addClass("rteSelected rteAdd"+b);MooRTE.Utilities.addElements(a,this.getParent("[class*=rteGroup_]"),"after","rteGroup_"+b);MooRTE.Utilities.eventHandler("onShow",this,b)},assetLoader:function(){if(!this.assetsLoaded){Depender.setOptions({loadedSources:["core"],onRequire:function(a){a=a.self;var b=a.getSize();a.getStyle("position")== "static"&&a.setStyle("position","relative");a.grabTop(new Element("img",{"class":"spinWait",styles:{width:b.x,height:b.y},src:"http://github.com/mootools/mootools-more/raw/master/Styles/Interface/Spinner/spinner.gif"}))},onRequirementLoaded:function(a,b){b.self.getElement(".spinWait").destroy()}}).include(MooRTE.Path);this.assetsLoaded=true}return function(a){Depender.require({self:a.self,scripts:a.scripts,callback:a.onComplete});$$("head")[0].getElements("link").map(function(b){return b.get("href")}); a.styles&&$splat(a.styles).each(function(){})}}(),clipStickyWin:function(a){if(Browser.firefox||Browser.webkit&&a=="paste")MooRTE.Utilities.assetLoader({self:this,scripts:"StickyWinModalUI",onComplete:function(){MooRTE.Elements.clipPop=new StickyWin.Modal({content:StickyWin.ui("Security Restriction","For your protection, "+(Browser.webkit?"Webkit":"Firefox")+" does not allow access to the clipboard.<br/> <b>Please use Ctrl+C to copy, Ctrl+X to cut, and Ctrl+V to paste.</b><br/>(Those lucky enough to be on a Mac use Cmd instead of Ctrl.)<br/><br/>If this functionality is important, consider switching to a browser such as IE,<br/> which will allow us to easily access [and modify] your system.", {buttons:[{text:"close"}]})});MooRTE.Elements.clipPop.hide()}})},clean:function(a,b){b=Object.append({xhtml:false,semantic:true,remove:""},b);var c=[[/(<(?:img|input)[^\/>]*)>/g,"$1 />"]],d=[[/<li>\s*<div>(.+?)<\/div><\/li>/g,"<li>$1</li>"],[/<span style="font-weight: bold;">(.*)<\/span>/gi,"<strong>$1</strong>"],[/<span style="font-style: italic;">(.*)<\/span>/gi,"<em>$1</em>"],[/<b\b[^>]*>(.*?)<\/b[^>]*>/gi,"<strong>$1</strong>"],[/<i\b[^>]*>(.*?)<\/i[^>]*>/gi,"<em>$1</em>"],[/<u\b[^>]*>(.*?)<\/u[^>]*>/gi, '<span style="text-decoration: underline;">$1</span>'],[/<p>[\s\n]*(<(?:ul|ol)>.*?<\/(?:ul|ol)>)(.*?)<\/p>/ig,"$1<p>$2</p>"],[/<\/(ol|ul)>\s*(?!<(?:p|ol|ul|img).*?>)((?:<[^>]*>)?\w.*)$/g,"</$1><p>$2</p>"],[/<br[^>]*><\/p>/g,"</p>"],[/<p>\s*(<img[^>]+>)\s*<\/p>/ig,"$1\n"],[/<p([^>]*)>(.*?)<\/p>(?!\n)/g,"<p$1>$2</p>\n"],[/<\/(ul|ol|p)>(?!\n)/g,"</$1>\n"],[/><li>/g,">\n\t<li>"],[/([^\n])<\/(ol|ul)>/g,"$1\n</$2>"],[/([^\n])<img/ig,"$1\n<img"],[/^\s*$/g,""]],f=[[/<br class\="webkit-block-placeholder">/gi, "<br />"],[/<span class="Apple-style-span">(.*)<\/span>/gi,"$1"],[/ class="Apple-style-span"/gi,""],[/<span style="">/gi,""],[/^([\w\s]+.*?)<div>/i,"<p>$1</p><div>"],[/<div>(.+?)<\/div>/ig,"<p>$1</p>"]],g=[[/<br\s*\/?>/gi,"<br"+(c?"/":"")+">"],[/><br\/?>/g,">"],[/^<br\/?>/g,""],[/<br\/?>$/g,""],[/<br\/?>\s*<\/(h1|h2|h3|h4|h5|h6|li|p)/gi,"</$1"],[/<p>\s*<br\/?>\s*<\/p>/gi,"<p>\u00a0</p>"],[/<p>(&nbsp;|\s)*<\/p>/gi,"<p>\u00a0</p>"],[/<p>\W*<\/p>/g,""],[/<\/p>\s*<\/p>/g,"</p>"],[/<[^>  ]*/g,function(e){return e.toLowerCase()}], [/<[^>]*>/g,function(e){return e=e.replace(/ [^=]+=/g,function(k){return k.toLowerCase()})}],[/<[^>]*>/g,function(e){return e=e.replace(/( [^=]+=)([^"][^ >]*)/g,'$1"$2"')}]],j;if(typeOf(a)=="element"){j=a;j.hasChild(j.retrieve("bar"))&&j.moorte("remove")}else j=$("washer")||(new Element("div",{id:"washer"})).inject(document.body);j.getElements("p:empty"+(b.remove?","+b.remove:"")).destroy();Browser.firefox||j.getElements("p>p:only-child").each(function(e){var k=e.getParent();k.childNodes.length== 1&&e.replaces(k)});a=j.get("html");j!=$("washer")&&j.moorte();c&&g.append(c);d&&g.append(d);Browser.webkit&&g.append(f);do{c=a;g.each(function(e){a=a.replace(e[0],e[1])})}while(c!=a);return a.trim()},fontsize:function(a,b){if(b==undefined)b=window.document.queryCommandValue("fontsize")||MooRTE.Range.parent().getStyle("font-size");if(b==+b)b=+b+a;else{b=b.split(/([^\d]+)/)[0];[0,10,13,16,18,24,32,48].every(function(c,d){if(c-b<0)return true;b=!(c-b)||a<0?d+a:d})}MooRTE.Utilities.exec("fontsize",b)}}; Element.implement({moorte:function(){var a=Array.link(arguments,{options:Type.isObject,cmd:Type.isString}),b=a.cmd,c=this.hasClass("MooRTE")?this:this.retrieve("bar")||"";if(!b||b=="create"){if(b=this.retrieve("removed")){c.inject(b[0],b[1]);this.eliminate("removed")}return c?this.removeClass("rteHide"):new MooRTE(Object.append(a.options||{},{elements:this}))}else{if(!c)return false;switch(b.toLowerCase()){case "remove":this.store("removed",c.getPrevious()?[c.getPrevious(),"after"]:[c.getParent(), "top"]);(new Element("span")).replaces(c).destroy();break;case "destroy":c.retrieve("fields").each(function(d){d.removeEvents().eliminate("bar").set("contentEditable",false);d.hasClass("rteTextArea")&&d.getNext("textarea").removeClass("rteHide");d.destroy()});c.destroy();break;case "hide":c.addClass("rteHide")}}}});Elements.implement({moorte:function(){var a=Array.link(arguments,{options:Object.type}).options;return new MooRTE(Object.append(a||{},{elements:this}))}}); MooRTE.Elements={Main:{text:"Main","class":"rteText",onClick:"onLoad",onLoad:["group",{Toolbar:["start","bold","italic","underline","strikethrough","Justify","Lists","Indents","subscript","superscript"]}]},File:{text:"File","class":"rteText",onClick:["group",{Toolbar:["start","save","cut","copy","paste","redo","undo","selectall","removeformat","viewSource"]}]},Font:{text:"Font","class":"rteText",onClick:["group",{Toolbar:["start","fontsize","decreasefontsize","increasefontsize","backcolor","forecolor"]}]}, Insert:{text:"Insert","class":"rteText",onClick:["group",{Toolbar:["start","inserthorizontalrule","blockquote","hyperlink"]}]},View:{text:"Views","class":"rteText",onClick:["group",{Toolbar:["start","Html/Text"]}]},Justify:{img:6,"class":"Flyout rteSelected",contains:"div.Flyout:[justifyleft,justifycenter,justifyright,justifyfull]"},Lists:{img:14,"class":"Flyout",contains:"div.Flyout:[insertorderedlist,insertunorderedlist]"},Indents:{img:11,"class":"Flyout",contains:"div.Flyout:[indent,outdent]"}, div:{element:"div"},bold:{img:1,shortcut:"b",source:"<b>"},italic:{img:2,shortcut:"i",source:"<i>"},underline:{img:3,shortcut:"u",source:"<u>"},strikethrough:{img:4},justifyleft:{img:6,title:"Justify Left",onUpdate:function(a,b){var c=MooRTE.activeField.retrieve("bar").getElement(".rtejustify"+(b=="justify"?"full":b));c.getParent().getParent().setStyle("background-position",c.addClass("rteSelected").getStyle("background-position"))}},justifyfull:{img:7,title:"Justify Full"},justifycenter:{img:8,title:"Justify Center"}, justifyright:{img:9,title:"Justify Right"},subscript:{img:18},superscript:{img:17},outdent:{img:11},indent:{img:12},insertorderedlist:{img:14,title:"Numbered List"},insertunorderedlist:{img:15,title:"Bulleted List"},selectall:{img:25,title:"Select All (Ctrl + A)"},removeformat:{img:26,title:"Clear Formatting"},undo:{img:31,title:"Undo (Ctrl + Z)"},redo:{img:32,title:"Redo (Ctrl+Y)"},inserthorizontalrule:{img:56,title:"Insert Horizontal Line"},cut:{img:20,title:"Cut (Ctrl+X)",onLoad:MooRTE.Utilities.clipStickyWin, onClick:function(a){Browser.firefox?MooRTE.Elements.clipPop.show():MooRTE.Utilities.exec(a)}},copy:{img:21,title:"Copy (Ctrl+C)",onLoad:MooRTE.Utilities.clipStickyWin,onClick:function(a){Browser.firefox?MooRTE.Elements.clipPop.show():MooRTE.Utilities.exec(a)}},paste:{img:22,title:"Paste (Ctrl+V)",onLoad:MooRTE.Utilities.clipStickyWin,onClick:function(a){Browser.firefox||Browser.webkit?MooRTE.Elements.clipPop.show():MooRTE.Utilities.exec(a)}},save:{img:27,src:"http://siteroller.net/test/save.php", onClick:function(){var a=$H({page:window.location.pathname}),b=0;a.content=[];this.getParent(".MooRTE").retrieve("fields").each(function(c){a.content[b++]=MooRTE.Utilities.clean(c)});(new Request({url:MooRTE.Elements.save.src,onComplete:function(c){alert("Your submission has been received:\n\n"+c)}})).send(a.toQueryString())}},"Html/Text":{img:"26",onClick:["DisplayHTML"]},DisplayHTML:{element:"textarea","class":"displayHtml",unselectable:"off",init:function(){var a=this.getParent(".MooRTE").retrieve("fields"), b=a.getParent();b=(b.hasClass("rteTextArea")?b:a).getSize();this.set({styles:{width:b.x,height:b.y},text:a.innerHTML.trim()})}},colorpicker:{element:"img",src:"images/colorPicker.jpg","class":"colorPicker",onClick:function(){var a=this.getSize().x/2,b=mouse.x-a,c=mouse.y-a,d=f.y/f.getSize().y,f=Math.atan2(b,c)/Math.PI*3+1;a=Math.sqrt(b*b+c*c)/a;for(b=0;b<3;b++)(void 0)[b]=(((Math.abs((f+=2)%6-3)<1?1:h>2?0:-(h-2))-d)*a+d)*255;[(void 0)[0],(void 0)[2],(void 0)[1]].rgbToHex()}},hyperlink:{img:46,title:"Create hyperlink", onClick:function(){MooRTE.Range.create();$("popTXT").set("value",MooRTE.Range.get("text",MooRTE.ranges.a1));MooRTE.Elements.linkPop.show()},onLoad:function(){MooRTE.Utilities.assetLoader({self:this,scripts:"StickyWinModalUI",onComplete:function(){MooRTE.Elements.linkPop=new StickyWin.Modal({content:StickyWin.ui("Edit Link","<span style='display:inline-block; width:100px'>Text of Link:</span><input id='popTXT'/><br/><span style='display:inline-block; width:100px'>Link To Location:</span><input id='popURL'/><br/><input type='radio' name='pURL' value='web' checked/>Web<input type='radio' name='pURL' id='pURL1' value='email'/>Email", {buttons:[{text:"cancel"},{text:"OK",onClick:function(){MooRTE.Range.set();var a=$("popURL").get("value");if($("pURL1").get("checked"))a="mailto:"+a;MooRTE.Utilities.exec(a?"createlink":"unlink",a)}}]})});MooRTE.Elements.linkPop.hide()}})}},"Upload Photo":{img:15,onLoad:function(){MooRTE.Utilities.assetLoader({scripts:["/siteroller/classes/fancyupload/fancyupload/source/Swiff.Uploader.js"],styles:["/siteroller/classes/fancyupload/fancyupload/source/Swiff.Uploader.css"],onComplete:function(){var a= new Swiff.Uploader({verbose:true,target:this,queued:false,multiple:false,instantStart:true,fieldName:"photoupload",typeFilter:{"Images (*.jpg, *.jpeg, *.gif, *.png)":"*.jpg; *.jpeg; *.gif; *.png"},path:"/siteroller/classes/fancyupload/fancyupload/source/Swiff.Uploader.swf",url:"/siteroller/classes/moorte/source/plugins/fancyUpload/uploadHandler.php",onButtonDown:function(){MooRTE.Range.set()},onButtonEnter:function(){MooRTE.Range.create()},onFileProgress:function(){},onFileComplete:function(b){MooRTE.Range.set().exec("insertimage", JSON.decode(b.response.text).file)}});this.addEvent("mouseenter",function(){a.target=this;a.reposition()})}})}},blockquote:{img:59,onClick:function(){MooRTE.Range.wrap("blockquote")}},start:{element:"span"},viewSource:{img:35,onClick:"source",source:function(a){var b=MooRTE.activeBar,c=b.retrieve("fields")[0],d=b.getElement("textarea.rtesource");if(this.hasClass("rteSelected")){b.eliminate("source");this.removeClass("rteSelected");c.hasChild(c.retrieve("bar"))&&c.moorte("remove");c.set("html",d.addClass("rteHide").get("value")).moorte()}else{b.store("source", "source");if(d){this.addClass("rteSelected");d.removeClass("rteHide").set("text",MooRTE.Utilities.clean(b.retrieve("fields")[0]))}else MooRTE.Utilities.group.run(["source",a],this)}}},source:{element:"textarea","class":"displayHtml",unselectable:"off",onLoad:function(){var a=this.getParent(".MooRTE"),b=a.retrieve("fields")[0],c=b.getSize();a=a.getSize().y;this.set({styles:{width:c.x,height:c.y-a,top:a},text:MooRTE.Utilities.clean(b)})}},input:{img:59,onClick:function(){MooRTE.Range.insert("<input>")}}, submit:{img:59,onClick:function(){MooRTE.Range.insert('<input type="submit" value="Submit">')}},cleanWord:{onClick:function(){var a=this.replace(/\r/g,"\n").replace(/\n/g," ");[/<!--.+?--\>/g,/<title>.+?<\/title>/g,/<(meta|link|.?o:|.?style|.?div|.?head|.?html|body|.?body|.?span|!\[)[^>]*?>/g,/ v:.*?=".*?"/g,/ style=".*?"/g,/ class=".*?"/g,/(&nbsp;){2,}/g,/<p>(\s|&nbsp;)*?<\/p>/g].each(function(b){a=a.replace(b,"")});return a.replace(/\s+/g," ")}},decreasefontsize:{img:42,onClick:function(){if(!Browser.firefox)return MooRTE.Utilities.fontsize.pass(-1)}()}, increasefontsize:{img:41,onClick:function(){if(!Browser.firefox)return MooRTE.Utilities.fontsize.pass(1)}()},fontsize:{},insertimage:{},backcolor:{img:43,onLoad:function(){MooRTE.Utilities.assetLoader({scripts:["/siteroller/classes/colorpicker/Source/ColorRoller.js"],styles:["/siteroller/classes/colorpicker/Source/ColorRoller.js"],onComplete:function(){}})},onClick:function(){}},forecolor:{},formatblock:{},Toolbar:{element:"div"}};