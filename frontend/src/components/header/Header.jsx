import { BiLogIn } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import './Header.scss';

const activeLink = ({ isActive }) => (isActive ? 'active' : '');
const Header = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };
  const logout = async () => {
    navigate('/logout');
  };

  return (
    <header className='header'>
      <nav>
        <div className='logo' onClick={goHome}>
          <span>Securely</span>
        </div>
        <ul className='home-links'>
          <li className='--flex-center'>
            <FaUserCircle size={20} />
            <p className='--color-white'>Hi {name} |</p>
          </li>
          <li>
            <button className='--btn --btn-primary'>
              <Link to='/login'>Login</Link>
            </button>
          </li>
          <li>
            <button onClick={logout} className='--btn --btn-secondary'>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
