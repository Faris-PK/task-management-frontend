import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <><Toaster richColors />
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route
          path="/"
          element={<ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
      </Routes>
    </Router></>
  );
};

export default App;