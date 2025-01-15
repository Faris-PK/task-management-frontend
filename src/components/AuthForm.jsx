import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (type === 'register') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {type === 'login' ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p className="mt-2 text-gray-600">
              {type === 'login'
                ? 'Sign in to access your account'
                : 'Create your account to get started'}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {type === 'register' && (
                <div className="relative">
                  <label 
                    htmlFor="username"
                    className={`absolute left-3 transition-all duration-200 ${
                      focused === 'username' || formData.username
                        ? '-top-2 text-xs text-blue-600 bg-white px-1'
                        : 'top-3 text-gray-500'
                    }`}
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="block w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-blue-500 transition-colors duration-200"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused('')}
                  />
                </div>
              )}
              
              <div className="relative">
                <label 
                  htmlFor="email"
                  className={`absolute left-3 transition-all duration-200 ${
                    focused === 'email' || formData.email
                      ? '-top-2 text-xs text-blue-600 bg-white px-1'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-blue-500 transition-colors duration-200"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                />
              </div>
              
              <div className="relative">
                <label 
                  htmlFor="password"
                  className={`absolute left-3 transition-all duration-200 ${
                    focused === 'password' || formData.password
                      ? '-top-2 text-xs text-blue-600 bg-white px-1'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-blue-500 transition-colors duration-200"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {type === 'register' && (
                <div className="relative">
                  <label 
                    htmlFor="confirmPassword"
                    className={`absolute left-3 transition-all duration-200 ${
                      focused === 'confirmPassword' || formData.confirmPassword
                        ? '-top-2 text-xs text-blue-600 bg-white px-1'
                        : 'top-3 text-gray-500'
                    }`}
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="block w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-blue-500 transition-colors duration-200"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused('')}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
              >
                {type === 'login' ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate(type === 'login' ? '/register' : '/login')}
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              {type === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;