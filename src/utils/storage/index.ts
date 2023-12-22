import EasyStorage from './Storage';
// import Utf8 from 'crypto-js/enc-utf8';
// import Base64 from 'crypto-js/enc-base64';

const storage = new EasyStorage({
  driver: localStorage,
  prefix: ''
  // 需要加密的时候可以使用
  // encryptFn(val) {
  //   return Base64.stringify(Utf8.parse(val));
  // },
  // decryptFn(val) {
  //   return Base64.parse(val).toString(Utf8);
  // }
});
export const getStorage = storage.get.bind(storage);
export const setStorage = storage.set.bind(storage);
export const removeStorage = storage.remove.bind(storage);
export const clearStorage = storage.clear.bind(storage);
