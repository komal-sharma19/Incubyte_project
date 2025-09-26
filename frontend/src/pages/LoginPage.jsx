import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/auth'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const { login } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const { email, password } = formData

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      const data = await loginUser(formData.email, formData.password)

      login(data.user)

      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F0FFF0] p-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-[#FF69B4]'>
        <div className='p-8 text-center bg-gradient-to-r from-pink-100 via-yellow-50 to-pink-50 rounded-t-xl shadow-lg border-b-4 border-[#FF69B4] transform hover:scale-[1.02] transition duration-300'>
          <h2 className='text-4xl font-extrabold text-[#A0522D] flex items-center justify-center gap-2'>
            🍬 Welcome Back!
          </h2>
          <p className='text-gray-600 mt-3 text-lg'>
            Sign in to{' '}
            <span className='font-semibold text-[#FF69B4]'>
              KATA Sweet Shop
            </span>
          </p>
          <div className='mt-4 flex justify-center gap-2'>
            <span className='w-3 h-3 bg-[#FF69B4] rounded-full animate-bounce'></span>
            <span className='w-3 h-3 bg-[#FFD700] rounded-full animate-bounce delay-100'></span>
            <span className='w-3 h-3 bg-[#FF69B4] rounded-full animate-bounce delay-200'></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-8 space-y-6'>
          {error && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative'
              role='alert'
            >
              <span className='block sm:inline'>{error}</span>
            </div>
          )}

          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              name='email'
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
              placeholder='Your email'
            />
          </div>

          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              name='password'
              autoComplete='current-password'
              value={formData.password}
              onChange={handleChange}
              required
              placeholder='Secure password'
              className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 text-lg font-bold text-white bg-[#FF69B4] rounded-lg shadow-md hover:bg-pink-600 transition duration-200 transform hover:scale-[1.01]'
          >
            Log In
          </button>
        </form>

        <div className='p-6 bg-gray-50 text-center border-t border-gray-100'>
          <p className='text-sm text-gray-600'>
            Need an account?{' '}
            <Link
              to='/signup'
              className='font-semibold text-[#A0522D] hover:text-pink-600'
            >
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
