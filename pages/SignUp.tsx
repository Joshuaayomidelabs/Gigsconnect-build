import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Musician',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            GigsConnect
          </h1>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-10 shadow-xl sm:rounded-2xl sm:px-12 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.fullName ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Stage Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  name="stageName"
                  type="text"
                  value={formData.stageName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="DJ Apollo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.phoneNumber ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phoneNumber && <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all bg-white"
                >
                  <option value="Musician">Musician</option>
                  <option value="Organizer">Organizer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.confirmPassword ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
