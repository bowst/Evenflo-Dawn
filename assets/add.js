window.bl = function() {
  
  // Gives us common iframe setup shared by this and add_reg_item.js.erb
  var NO_JQUERY={};!function(e,t,a){if(!("console"in e)){var r=e.console={};r.log=r.warn=r.error=r.debug=function(){}}t===NO_JQUERY&&(t={fn:{},extend:function(){for(var e=arguments[0],t=1,a=arguments.length;t<a;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}}),t.fn.pm=function(){return console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])"),this},t.pm=e.bufferpm=function(e){n.send(e)},t.pm.bind=e.bufferpm.bind=function(e,t,a,r){n.bind(e,t,a,r)},t.pm.unbind=e.bufferpm.unbind=function(e,t){n.unbind(e,t)},t.pm.origin=e.bufferpm.origin=null,t.pm.poll=e.bufferpm.poll=200;var n={send:function(e){var a=t.extend({},n.defaults,e),r=a.target;if(a.target)if(a.type){var s={data:a.data,type:a.type};a.success&&(s.callback=n._callback(a.success)),a.error&&(s.errback=n._callback(a.error)),"postMessage"in r&&!a.hash?(n._bind(),r.postMessage(JSON.stringify(s),a.origin||"*")):(n.hash._bind(),n.hash.send(a,s))}else console.warn("postmessage type required");else console.warn("postmessage target window required")},bind:function(a,r,s,o){"postMessage"in e&&!o?n._bind():n.hash._bind();var i=n.data("listeners.postmessage");i||(i={},n.data("listeners.postmessage",i));var u=i[a];u||(u=[],i[a]=u),u.push({fn:r,origin:s||t.pm.origin})},unbind:function(e,t){var a=n.data("listeners.postmessage");if(a)if(e)if(t){var r=a[e];if(r){for(var s=[],o=0,i=r.length;o<i;o++){var u=r[o];u.fn!==t&&s.push(u)}a[e]=s}}else delete a[e];else for(var o in a)delete a[o]},data:function(e,t){return t===a?n._data[e]:(n._data[e]=t,t)},_data:{},_CHARS:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),_random:function(){for(var e=[],t=0;t<32;t++)e[t]=n._CHARS[0|32*Math.random()];return e.join("")},_callback:function(e){var t=n.data("callbacks.postmessage");t||(t={},n.data("callbacks.postmessage",t));var a=n._random();return t[a]=e,a},_bind:function(){n.data("listening.postmessage")||(e.addEventListener?e.addEventListener("message",n._dispatch,!1):e.attachEvent&&e.attachEvent("onmessage",n._dispatch),n.data("listening.postmessage",1))},_dispatch:function(e){try{var t={};if("object"==typeof e.data&&null!==e.data)return;t=JSON.parse(e.data)}catch(e){return void console.warn("postmessage data invalid json: ",e)}if(t.type){var a=(n.data("callbacks.postmessage")||{})[t.type];if(a)a(t.data);else for(var r=(n.data("listeners.postmessage")||{})[t.type]||[],s=0,o=r.length;s<o;s++){var i=r[s];if(i.origin&&e.origin!==i.origin){if(console.warn("postmessage message origin mismatch",e.origin,i.origin),t.errback){var u={message:"postmessage origin mismatch",origin:[e.origin,i.origin]};n.send({target:e.source,data:u,type:t.errback})}}else try{var c=i.fn(t.data);t.callback&&n.send({target:e.source,data:c,type:t.callback})}catch(a){t.errback&&n.send({target:e.source,data:a,type:t.errback})}}}else console.warn("postmessage message type required")}};n.hash={send:function(t,a){var r=t.target,s=t.url;if(s){s=n.hash._url(s);var o,i=n.hash._url(e.location.href);if(e==r.parent)o="parent";else try{for(var u=0,c=parent.frames.length;u<c;u++){if(parent.frames[u]==e){o=u;break}}}catch(t){o=e.name}if(null!=o){var l={"x-requested-with":"postmessage",source:{name:o,url:i},postmessage:a},f="#x-postmessage-id="+n._random();r.location=s+f+encodeURIComponent(JSON.stringify(l))}else console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list")}else console.warn("postmessage target window url is required")},_regex:/^\#x\-postmessage\-id\=(\w{32})/,_regex_len:50,_bind:function(){n.data("polling.postmessage")||(setInterval((function(){var t=""+e.location.hash,a=n.hash._regex.exec(t);if(a){var r=a[1];n.hash._last!==r&&(n.hash._last=r,n.hash._dispatch(t.substring(n.hash._regex_len)))}}),t.pm.poll||200),n.data("polling.postmessage",1))},_dispatch:function(t){if(t){try{if(!("postmessage"===(t=JSON.parse(decodeURIComponent(t)))["x-requested-with"]&&t.source&&null!=t.source.name&&t.source.url&&t.postmessage))return}catch(e){return}var a=t.postmessage,r=(n.data("callbacks.postmessage")||{})[a.type];if(r)r(a.data);else{var s;s="parent"===t.source.name?e.parent:e.frames[t.source.name];for(var o=(n.data("listeners.postmessage")||{})[a.type]||[],i=0,u=o.length;i<u;i++){var c=o[i];if(c.origin){var l=/https?\:\/\/[^\/]*/.exec(t.source.url)[0];if(l!==c.origin){if(console.warn("postmessage message origin mismatch",l,c.origin),a.errback){var f={message:"postmessage origin mismatch",origin:[l,c.origin]};n.send({target:s,data:f,type:a.errback,hash:!0,url:t.source.url})}continue}}try{var p=c.fn(a.data);a.callback&&n.send({target:s,data:p,type:a.callback,hash:!0,url:t.source.url})}catch(e){a.errback&&n.send({target:s,data:e,type:a.errback,hash:!0,url:t.source.url})}}}}},_url:function(e){return(""+e).replace(/#.*$/,"")}},t.extend(n,{defaults:{target:null,url:null,type:null,data:null,success:null,error:null,origin:"*",hash:!1}})}(this,"undefined"==typeof jQuery?NO_JQUERY:jQuery),"JSON"in window&&window.JSON||(JSON={}),function(){function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,(function(e){var t=meta[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(e,t){var a,r,n,s,o,i=gap,u=t[e];switch(u&&"object"==typeof u&&"function"==typeof u.toJSON&&(u=u.toJSON(e)),"function"==typeof rep&&(u=rep.call(t,e,u)),typeof u){case"string":return quote(u);case"number":return isFinite(u)?String(u):"null";case"boolean":case"null":return String(u);case"object":if(!u)return"null";if(gap+=indent,o=[],"[object Array]"===Object.prototype.toString.apply(u)){for(s=u.length,a=0;a<s;a+=1)o[a]=str(a,u)||"null";return n=0===o.length?"[]":gap?"[\n"+gap+o.join(",\n"+gap)+"\n"+i+"]":"["+o.join(",")+"]",gap=i,n}if(rep&&"object"==typeof rep)for(s=rep.length,a=0;a<s;a+=1)"string"==typeof(r=rep[a])&&(n=str(r,u))&&o.push(quote(r)+(gap?": ":":")+n);else for(r in u)Object.hasOwnProperty.call(u,r)&&(n=str(r,u))&&o.push(quote(r)+(gap?": ":":")+n);return n=0===o.length?"{}":gap?"{\n"+gap+o.join(",\n"+gap)+"\n"+i+"}":"{"+o.join(",")+"}",gap=i,n}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(e,t,a){var r;if(gap="",indent="","number"==typeof a)for(r=0;r<a;r+=1)indent+=" ";else"string"==typeof a&&(indent=a);if(rep=t,t&&"function"!=typeof t&&("object"!=typeof t||"number"!=typeof t.length))throw new Error("JSON.stringify");return str("",{"":e})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(e,t){var a,r,n=e[t];if(n&&"object"==typeof n)for(a in n)Object.hasOwnProperty.call(n,a)&&(void 0!==(r=walk(n,a))?n[a]=r:delete n[a]);return reviver.call(e,t,n)}var j;if(cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

var _presentBabylistFrame = function(queryString) {
  var _hostname = 'https://www.babylist.com';
  var iframe = document.createElement('iframe')
  iframe.setAttribute('allowtransparency', 'true')
  iframe.setAttribute('src', _hostname + '/bookmarklet/?' + queryString)
  iframe.setAttribute('name', 'babylist_iframe')
  iframe.setAttribute('id', 'babylist_iframe')
  iframe.setAttribute('scrolling', 'no')
  iframe.style.border = 'none';
  iframe.style.height = '100%';
  iframe.style.width  = '100%';
  iframe.style.position = (document.doctype == null && navigator.appName.match('Microsoft')) ? 'absolute' : 'fixed';
  iframe.style.zIndex = '99999999999';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style['background-color'] = 'transparent';
  iframe.style.clip = 'auto';
  iframe.style.overflow = 'hidden';
  iframe.style.opacity = 1;
  iframe.style.setProperty ('display', 'block', 'important');
  iframe.style.visibility = 'visible';

  // add it to the page
  document.body.appendChild(iframe)

  // bind a listener to remove iframe
  bufferpm.bind("buffermessage", function(data) {
    window.babylist_iframe_was_open = true;
    var iframe = document.getElementById("babylist_iframe");
    iframe.parentNode.removeChild(iframe);
    return false;
  });
}


  return {
    addToRegistry: function(productDetails) {
      // if this exists, we are trying to open the native add item experience on iOS.
      if (window?.webkit?.messageHandlers?.iosAddRegItem) {
        window.webkit.messageHandlers.iosAddRegItem.postMessage(productDetails)
        return
      }

      // convert any String instances to normal strings
      if (productDetails.images instanceof String) {
        productDetails.images = productDetails.images.toString()
      }

      // Allow images to be passed as a string or array
      if (typeof productDetails.images === 'string') {
        productDetails.images = [productDetails.images];
      }

      var queryProps = [];
      for (prop in productDetails) {
        if (!productDetails.hasOwnProperty(prop)) continue;
        if (prop == 'images') {
          for (var i=0; i < productDetails[prop].length; i++) {
            var img = encodeURIComponent(productDetails[prop][i]);
queryProps.push('imgs[]=' + img);
          }
        } else {
          queryProps.push(prop + '=' + encodeURIComponent(productDetails[prop]));
        }
      }

      if (typeof window._bl == 'object' && window._bl.partner) {
        queryProps.push('partner=' + window._bl.partner)
      }

      _presentBabylistFrame(queryProps.join('&'));
    }
  }
}()
