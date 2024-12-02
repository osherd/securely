import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Signup';
import Home from './pages/home/Home';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
