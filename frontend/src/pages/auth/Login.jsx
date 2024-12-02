import Card from '../../components/card/Card';
import { BiLogIn } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';

import styles from './auth.module.scss';
import { useState } from 'react';
import PasswordInput from '../../components/passwordInput/PasswordInput';

import { toast } from 'react-toastify';
import { login, validateEmail } from '../../services/authService.js';
import Loader from '../../components/loader/Loader.jsx';

const initialState = {
  email: '',
  password: '',
  loggedIn: false,
};

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const { email, password } = formData;

  const userData = {
    email: email,
    password: password,
    loggedIn: true,
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('All fields are required');
    }

    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }
    setIsLoading(true);
    try {
      const data = await login(userData);
      console.log(data);

      navigate('/');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <BiLogIn size={35} color='#999' />
          </div>
          <h2>Login</h2>
          <br />
          <form onSubmit={loginUser}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              required
              value={email}
              onChange={handleInputChange}
            />
            <PasswordInput
              name='password'
              value={password}
              placeholder='Password'
              onChange={handleInputChange}
            />
            <button type='submit' className='--btn --btn-primary --btn-block'>
              Login
            </button>
            <Link to='/forgot'>Forgot Password</Link>
            <span className={styles.register}>
              <Link to='/'>Home</Link>
              <p>&nbsp; Don&apos;t have an acount ? &nbsp;</p>
              <Link to='/signup'>Register</Link>
            </span>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
