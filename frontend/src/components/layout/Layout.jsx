import Header from '../header/Header';
import Footer from '../footer/Footer';
// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='--pad' style={{ minHeight: '80vh' }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
