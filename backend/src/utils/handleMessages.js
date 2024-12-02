import crypto from 'crypto';


// AES Encryption
export const encryptMessage = (message, secretKey) => {
  const iv = crypto.randomBytes(16);  // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');
  return iv.toString('hex') + ':' + encryptedMessage;
};

// AES Decryption
export const decryptMessage = (encryptedMessage, secretKey) => {
  const [ iv, message ] = encryptedMessage.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
  let decryptedMessage = decipher.update(message, 'hex', 'utf8');
  decryptedMessage += decipher.final('utf8');
  return decryptedMessage;
};
