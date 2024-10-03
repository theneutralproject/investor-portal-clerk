import crypto from 'crypto'

const {ENCRYPTION_SECRET, ENCRYPTION_SECRET_IV, ENCRYPTION_METHOD} = process.env;
if(!ENCRYPTION_METHOD || !ENCRYPTION_SECRET || !ENCRYPTION_SECRET_IV) {
    throw new Error("encrytion secrets are missing!");
}

const key = crypto
.createHash('sha512')
.update(ENCRYPTION_SECRET)
.digest('hex')
.substring(0,32);

const encryptionIv = crypto
.createHash('sha512')
.update(ENCRYPTION_SECRET_IV)
.digest('hex')
.substring(0,16);

export function encryptString(data: string) {
    const cipher = crypto.createCipheriv(ENCRYPTION_METHOD!, key, encryptionIv);
    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
      ).toString('base64') // Encrypts data and converts to hex and base64
}

export function decryptData(encryptedData: string) {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(ENCRYPTION_METHOD!, key, encryptionIv)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ) // Decrypts data and converts to utf8
  }