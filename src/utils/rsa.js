export default {
  rsaData (data) {
    const PUBLIC_KEY = 'your rsa public key'
    // eslint-disable-next-line no-undef
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    const result = jsencrypt.encrypt(data)
    return result
  }
}
