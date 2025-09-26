import { useState, useMemo, useEffect } from 'react'
import SweetCard from '../components/SweetCard'
import api from '../api/axios' // your axios instance
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoIosSearch } from 'react-icons/io'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('none') // 'none', 'asc', 'desc'
  const [sweets, setSweets] = useState([])

  const categories = ['All', 'Bar', 'Lollipop', 'Gummy', 'Fudge', 'Candy Cane']

  // --- Fetch sweets from backend ---
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await api.get('/sweets')
        setSweets(res.data)
      } catch (err) {
        toast.error('Failed to fetch sweets')
      }
    }
    fetchSweets()
  }, [])

  const filteredSweets = useMemo(() => {
    let tempSweets = sweets

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      tempSweets = tempSweets.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(lowerSearchTerm) ||
          sweet.category.toLowerCase().includes(lowerSearchTerm)
      )
    }

    if (selectedCategory !== 'All') {
      tempSweets = tempSweets.filter(
        (sweet) => sweet.category === selectedCategory
      )
    }

    if (sortOrder !== 'none') {
      tempSweets = [...tempSweets].sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price
        if (sortOrder === 'desc') return b.price - a.price
        return 0
      })
    }

    return tempSweets
  }, [searchTerm, selectedCategory, sortOrder, sweets])

  const handleSortClick = () => {
    if (sortOrder === 'none') setSortOrder('asc')
    else if (sortOrder === 'asc') setSortOrder('desc')
    else setSortOrder('none')
  }

  const getSortIcon = () => {
    if (sortOrder === 'asc') return '⬆️'
    if (sortOrder === 'desc') return '⬇️'
    return '💰'
  }

  return (
    <div className='min-h-screen bg-[#F0FFF0] font-sans'>
      {/* Header */}
      <header className='bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 text-white p-8 text-center shadow-2xl rounded-b-3xl relative overflow-hidden'>
        {/* Decorative circles */}
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-10 w-56 h-56 bg-yellow-200 opacity-20 rounded-full blur-2xl'></div>

        <h1 className='text-4xl sm:text-5xl font-extrabold tracking-wider relative z-10'>
          The <span className='text-yellow-200 drop-shadow-lg'>Sweet Shop</span>
        </h1>
        <p className='mt-2 text-pink-100 text-lg sm:text-xl font-semibold relative z-10'>
          🍬 Treat Yourself to Something Sweet! 🍭
        </p>
      </header>

      <main className='p-4 md:p-12 max-w-7xl mx-auto'>
        {/* Search + Sort */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-6 sm:p-8 bg-gradient-to-r from-pink-50 via-yellow-50 to-pink-100 rounded-3xl shadow-xl border-t-4 border-[#FF69B4]'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-[#A0522D] flex items-center gap-3 mb-4 md:mb-0'>
            Our Sweet Collection
            <span className='animate-pulse text-yellow-400 text-3xl'>✨</span>
          </h2>

          <div className='w-full md:w-auto flex flex-col md:flex-row md:items-center gap-4'>
            <div className='relative w-full md:w-64'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none text-xl'>
                <IoIosSearch />
              </span>
              <input
                type='text'
                placeholder='Search sweets or category...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSelectedCategory('All') // reset category
                }}
                className='w-full pl-10 pr-4 py-3 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 placeholder-gray-400 transition duration-300 ease-in-out bg-white text-gray-800'
              />
            </div>

            <button
              onClick={handleSortClick}
              className={`px-4 py-3 mt-2 md:mt-0 min-w-[120px] text-center font-semibold rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 
                bg-white text-gray-700 border-none`}
            >
              Price {getSortIcon()}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className='mb-8 flex gap-3 overflow-x-auto px-4 md:px-0 py-2'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setSearchTerm('')
              }}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 
                ${
                  selectedCategory === category
                    ? 'bg-[#A0522D] text-white shadow-xl'
                    : 'bg-[#FF69B4] text-white hover:bg-pink-600'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sweets Grid */}
        {filteredSweets.length === 0 ? (
          <div className='text-center p-10 bg-white rounded-xl shadow-lg'>
            <p className='text-2xl font-bold text-[#A0522D]'>
              Sorry! 😢 No sweets match your criteria.
            </p>
            <p className='text-gray-500 mt-2'>
              Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet._id || sweet.id} sweet={sweet} />
            ))}
          </div>
        )}

        <ToastContainer position='top-right' autoClose={2500} hideProgressBar />
      </main>
    </div>
  )
}

export default HomePage
