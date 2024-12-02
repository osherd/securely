import { useState } from 'react';
import './Home.scss';
import { io } from 'socket.io-client';
import { encryptMessage, generateKeyPair } from '../../services/authService';

const socket = io('http://localhost:8080');

const Home = () => {
  const [token] = useState('');

  const [message, setMessage] = useState('');

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = (recipient) => {
    // Generate keys
    const { publicKey } = generateKeyPair();

    const encryptedMessage = encryptMessage(publicKey, message);
    socket.emit('message', {
      token,
      content: encryptedMessage.toString('base64'),
      recipient,
    });
  };

  return (
    <>
      <section className='container home'>
        <div className='home-text'>
          <h1> Secure app</h1>
          <div className='home-buttons --flex-center'>
            <div>
              <input placeholder='Message' onChange={handleMessage} />
              <button onClick={() => sendMessage('recipientUsername')}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
