import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-pink-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 w-full max-w-lg text-center">
        
        {/* Emoji and 404 */}
        <div className="text-8xl mb-4 animate-bounce">🍬</div>
        <h1 className="text-6xl font-extrabold text-[#A0522D] mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-1">Oops! This page is all out of stock.</p>
        <p className="text-gray-500 mb-6">Let's find our way back to the sweet shop.</p>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-block mt-4 bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white py-3 px-8 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
        >
          Back to the Sweet Shop
        </Link>

        {/* Fun bouncing candies */}
        <div className="mt-6 flex justify-center gap-3">
          <span className="w-4 h-4 bg-[#FF69B4] rounded-full animate-bounce"></span>
          <span className="w-4 h-4 bg-[#FFD700] rounded-full animate-bounce delay-100"></span>
          <span className="w-4 h-4 bg-[#FF69B4] rounded-full animate-bounce delay-200"></span>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
