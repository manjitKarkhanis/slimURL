var base62 = require("base62/lib/ascii");

function encode(num){
    return base62.encode(num);
}

function decode(str){
    return base62.decode(str);
}

module.exports.encode = encode;
module.exports.decode = decode;
