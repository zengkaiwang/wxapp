var fun_aes = require('./aes.js')

//十六位十六进制数作为秘钥
var key = fun_aes.CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
//十六位十六进制数作为秘钥偏移量
var iv = fun_aes.CryptoJS.enc.Utf8.parse('1234567890123456');

function Encrypt (word) {
  var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
  var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { mode: fun_aes.CryptoJS.mode.ECB, padding: fun_aes.CryptoJS.pad.Pkcs7 })
  //返回大写十六进制加密结果
  return encrypted.toString()
}

module.exports = {
  Encrypt
}