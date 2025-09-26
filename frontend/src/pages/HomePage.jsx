import { useState, useMemo } from 'react';
import SweetCard from '../components/SweetCard';
import { ToastContainer } from 'react-toastify';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  const sampleSweets = [
    { id: 1, name: 'Chocolate Swirl Bar', category: 'Bar', price: 10.5, quantity: 5 },
    { id: 2, name: 'Rainbow Pop', category: 'Lollipop', price: 2.0, quantity: 10 },
    { id: 3, name: 'Sour Jelly Worms', category: 'Gummy', price: 5.75, quantity: 7 },
    { id: 4, name: 'Peanut Brittle Fudge', category: 'Fudge', price: 15.0, quantity: 0 },
    { id: 5, name: 'Sparkle Gum Drops', category: 'Gummy', price: 3.25, quantity: 22 },
    { id: 6, name: 'Classic Mint Stick', category: 'Candy Cane', price: 1.5, quantity: 15 },
    { id: 7, name: 'Strawberry Licorice Rope', category: 'Gummy', price: 4.5, quantity: 12 },
    { id: 8, name: 'Mega Milk Chocolate Bar', category: 'Bar', price: 18.0, quantity: 3 },
  ];

  const categories = ['All', 'Bar', 'Lollipop', 'Gummy', 'Fudge', 'Candy Cane'];

  const filteredSweets = useMemo(() => {
    let tempSweets = sampleSweets;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempSweets = tempSweets.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(lowerSearchTerm) ||
          sweet.category.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedCategory !== 'All') {
      tempSweets = tempSweets.filter((sweet) => sweet.category === selectedCategory);
    }

    if (sortOrder !== 'none') {
      tempSweets = [...tempSweets].sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        if (sortOrder === 'desc') return b.price - a.price;
        return 0;
      });
    }

    return tempSweets;
  }, [searchTerm, selectedCategory, sortOrder]);

  const handleSortClick = () => {
    if (sortOrder === 'none') setSortOrder('asc');
    else if (sortOrder === 'asc') setSortOrder('desc');
    else setSortOrder('none');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return '⬆️';
    if (sortOrder === 'desc') return '⬇️';
    return '💰';
  };

  return (
    <div className="min-h-screen bg-[#F0FFF0] font-sans">
      {/* Header */}
      <header className="bg-[#FF69B4] text-white p-8 text-center shadow-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider">
          The <span className="text-[#A0522D] drop-shadow-md">Sweet Shop</span>
        </h1>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-12 max-w-7xl mx-auto">

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-6 sm:p-8 bg-gradient-to-r from-pink-50 via-yellow-50 to-pink-100 rounded-3xl shadow-xl border-t-4 border-[#FF69B4]">

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#A0522D] flex items-center gap-3 mb-4 md:mb-0">
            Our Sweet Collection
            <span className="animate-pulse text-yellow-400 text-3xl">✨</span>
          </h2>

          <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              placeholder="Search sweets or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory('All'); // Reset category on search
              }}
              className="w-full md:w-64 px-5 py-3 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 placeholder-gray-400 transition duration-300 ease-in-out"
            />

            <button
              onClick={handleSortClick}
              className={`px-4 py-3 mt-2 md:mt-0 min-w-[120px] text-center font-semibold rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 
                ${sortOrder !== 'none' ? 'bg-[#A0522D] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Price {getSortIcon()}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto px-4 md:px-0 py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm('');
              }}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 
                ${selectedCategory === category
                  ? 'bg-[#A0522D] text-white shadow-xl'
                  : 'bg-[#FF69B4] text-white hover:bg-pink-600'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sweets Grid */}
        {filteredSweets.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg">
            <p className="text-2xl font-bold text-[#A0522D]">
              Sorry! 😢 No sweets match your criteria.
            </p>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} />
            ))}
          </div>
        )}
        {/* <ToastContainer /> */}
      </main>
    </div>
  );
};

export default HomePage;
