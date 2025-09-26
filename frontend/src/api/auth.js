import api from './axios'

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    console.log(response.data)
    return response.data
  } catch (error) {
    const msg = error.response?.data?.message || 'Login failed. Please try again.'
    throw new Error(msg)
  }
}

export const signupUser = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password })
    return response.data
  } catch (error) {
    console.log(error)
    const msg =
      error.response?.data?.message || 'Registration failed. Please try again.'
    throw new Error(msg)
  }
}
