var s4l = require("../s4l.js");
var fs = require("fs");

var test = function(t, n){
  for(;n--;){
    t = s4l.findBlock(t);
  }
  return t;
}
var t = fs.readFileSync("./7.less", "utf8");
console.log(s4l(t));
console.log(s4l.styles);
