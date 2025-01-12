import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../api/axios';
import { setUser } from '../redux/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const { user } = await loginUser(credentials);
      dispatch(setUser(user));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', {
        description: 'Please check your credentials and try again.',
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  //if (loading) return <LoadingSpinner />;

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;