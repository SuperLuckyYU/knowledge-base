import CryptoJS from 'crypto-js';

/**
 * 加密方法
 * @param content
 * @param salt 32位盐值 盐值规则具体参见文档
 * @returns {string}
 */
export const encrypt = (content: any, salt: string) => {
  const SECRET_KEY = CryptoJS.enc.Utf8.parse(salt);
  const IV = salt.substring(13, 26) + 123; //时间戳加123组合16位偏移量
  const SECRET_IV = CryptoJS.enc.Utf8.parse(IV);
  if (typeof content === 'object') {
    try {
      // eslint-disable-next-line no-param-reassign
      content = JSON.stringify(content);
    } catch (error) {
      console.log('encrypt error:', error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(content);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};

/**
 * 解密方法
 * @param content 需要解密的内容   thirdUserId
 * @param salt 32位盐值 盐值规则具体参见文档  应用salt（13位） + timeStamp + randomCode
 * @returns {string}
 */
export const decrypt = (content: any, salt: string) => {
  const SECRET_KEY = CryptoJS.enc.Utf8.parse(salt);
  const IV = salt.substring(13, 26) + 123; //时间戳加123组合16位偏移量
  const SECRET_IV = CryptoJS.enc.Utf8.parse(IV);
  const encryptedHexStr = CryptoJS.enc.Hex.parse(content);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};
