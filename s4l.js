/*
 * Sort the CSS properties for LESS
 * 2013/12/19
 */
var properties = require("./properties.js");

module.exports = (function(){
  var s4l = function(str){
    return restore(blocks(str));
  };

  var styles = s4l.styles = [];
  var stack = s4l.stack = function(str, semicolon){
    styles.push(str);
    return "<" + (styles.length - 1) + ">" + (semicolon ? ";" : "");
  };

  var rblock = /\{([^\}]+)\}/;
  var findBlock = s4l.findBlock = function(str){
    return str.replace(rblock, function(a, b){
      if(~b.indexOf("{")){
        return "{" + findBlock(b + "}");
      }
      // @{hoge}
      else if(/\S/.test(b) && !~b.indexOf(":")){
        return stack(b);
      }
      else{
        return stack(sort(b), true);
      }
    });
  };
  var blocks = s4l.blocks = function(str){
    var re = findBlock(str);
    if(rblock.test(re)){
      return s4l(re);
    }
    return re;
  };

  var rstyle = /<(\d+)>;?/g;
  var restore = s4l.restore = function(str){
    var re = str.replace(rstyle, function(a, i){
      return "{" + styles[i] + "}";
    });
    if(rstyle.test(re)){
      return restore(re);
    }
    return re;
  };

  var sort = s4l.sort = function(str){
    var line = str.split(";");
    var count = 1;
    var len = properties.length;
    var end = line.pop();
    var getPos = function(prop){
      var index = properties.indexOf(prop);
      return ~index ? index : (len + count++);
    };
    return line.map(function(style){
      var pos;
      var prop = style.split(":")[0].trim();
      // Variable
      if(prop[0] === "@"){
        pos = -1;
      }
      // IE7
      else if(prop[0] === "*"){
        pos = getPos(prop.slice(1)) + 0.1;
      }
      else {
        pos = getPos(prop);
      }
      return [
        style, pos
      ];
    })
    .sort(function(a, b){
      return a[1] > b[1] ? 1 : -1;
    }).map(function(a){
      return a[0] + ";";
    }).join("") + end;
  };

  return s4l;
})();

