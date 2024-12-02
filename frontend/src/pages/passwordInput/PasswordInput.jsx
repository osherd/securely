import { useState } from 'react';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineEye } from 'react-icons/ai';

import './PasswordInput.scss';

// eslint-disable-next-line react/prop-types
const PasswordInput = ({ placeholder, value, name, onChange, onPaste }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className='password'>
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        name={name}
        required
        value={value}
        onChange={onChange}
        onPaste={onPaste}
      />
      <div className='icon' onClick={togglePassword}>
        {showPassword ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
