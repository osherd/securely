import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = 'http://localhost:5000'; //process.env.REACT_APP_BACKEND_URL;
export const API_URL = `${ BACKEND_URL }/register`;

// Validate email
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const signup = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);

    if (response.statusText === "OK") {
      toast.success("User Registered successfully");
    }

    return response.data;

  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Login User
export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Function to generate an RSA public/private key pair
export const generateKeyPair = () => {
  // Generate an RSA key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // The length of the key in bits
    publicKeyEncoding: {
      type: 'spki', // Subject Public Key Info format
      format: 'pem', // PEM encoded
    },
    privateKeyEncoding: {
      type: 'pkcs8', // Private key format
      format: 'pem', // PEM encoded
      cipher: 'aes-256-cbc', // Encrypt the private key (optional)
      passphrase: 'your-passphrase-here', // Passphrase for encryption (optional)
    },
  });

  return { publicKey, privateKey };
};


// AES Encryption
export const encryptMessage = (secretKey, message) => {
  const iv = crypto.randomBytes(16);
  // eslint-disable-next-line no-undef
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');
  return iv.toString('hex') + ':' + encryptedMessage;
};




