import Card from '../../components/card/Card';
import { FaTimes } from 'react-icons/fa';
import { BsCheck2All } from 'react-icons/bs';

import { Link } from 'react-router-dom';

import styles from './auth.module.scss';
import { useEffect, useState } from 'react';
import PasswordInput from '../../components/passwordInput/PasswordInput';
import { signup, validateEmail } from '../../services/authService';
import { toast } from 'react-toastify';

import Loader from '../../components/loader/Loader';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(initialState);

  const { name, email, password, confirmPassword } = formData;

  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);

  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  const timesIcon = <FaTimes color='red' size={15} />;

  const checkIcon = <BsCheck2All color='green' size={15} />;

  const switchIcon = (condition) => {
    return condition ? checkIcon : timesIcon;
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Check Lower and Uppercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUCase(true);
    } else {
      setUCase(false);
    }
    // Check for numbers
    if (password.match(/([0-9])/)) {
      setNum(true);
    } else {
      setNum(false);
    }
    // Check for special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSChar(true);
    } else {
      setSChar(false);
    }
    // Check for PASSWORD LENGTH
    if (password.length > 5) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [password]);

  const signupUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('All fields are required');
    }
    if (password.length < 6) {
      return toast.error('Passwords must be up to 6 characters');
    }
    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsLoading(true);

    try {
      const data = await signup(formData);
      console.log(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const message = error.message || error.toString();
      toast.error(message);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <h2>Register</h2>
          <form onSubmit={signupUser}>
            <input
              type='text'
              placeholder='Name'
              name='name'
              required
              value={name}
              onChange={handleInputChange}
            />
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
            <PasswordInput
              name='confirmPassword'
              value={confirmPassword}
              placeholder='Confirm Password'
              onChange={handleInputChange}
            />
            {/* Password Strength */}
            <Card cardClass={styles.group}>
              <ul className='form-list'>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(uCase)}
                    &nbsp; LowerCase & UpperCase
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)}
                    &nbsp; Number (0-9)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(sChar)}
                    &nbsp; Special Character (!@#$%^&*)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)}
                    &nbsp; At least 6 Character
                  </span>
                </li>
              </ul>
            </Card>
            <button type='submit' className='--btn --btn-primary --btn-block'>
              Register
            </button>
            <span className={styles.register}>
              <Link to='/'>Home</Link>
              <p>&nbsp; Already have an acount ? &nbsp;</p>
              <Link to='/login'>Login</Link>
            </span>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
