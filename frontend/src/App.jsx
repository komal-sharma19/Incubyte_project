import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage' // Create this page
import AdminSweetsPage from './pages/AdminSweetPage'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  console.log(user)
  if (!user) return <Navigate to='/login' replace />
  return children
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/sweet/:id'
            element={
              <ProtectedRoute>
                <AdminSweetsPage />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for 404 */}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
