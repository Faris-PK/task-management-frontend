import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../api/axios';
import { setUser } from '../redux/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const { user } = await registerUser(userData);
      dispatch(setUser(user));
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed', {
        description: 'Please check your information and try again.',
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

 // if (loading) return <LoadingSpinner />;

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;