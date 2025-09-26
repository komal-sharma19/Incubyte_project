import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SweetCard = ({ sweet }) => {
  const [stock, setStock] = useState(sweet.quantity); // Start with initial stock

  const handlePurchase = () => {
    if (stock > 0) {
      setStock((prev) => prev - 1);
      toast.success(`Purchased 1 ${sweet.name}! 🎉`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const isSoldOut = stock <= 0;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-lg transform transition duration-300 
                  hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between`}
    >
      {/* Image */}
      <div className="h-44 w-full bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100 flex items-center justify-center border-b-4 border-pink-200">
        <span className="text-5xl animate-bounce">{isSoldOut ? "💀" : "🍬"}</span>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-grow">
        <h3 className="text-xl md:text-2xl font-extrabold text-[#A0522D] truncate">
          {sweet.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{sweet.category}</p>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-2xl font-extrabold text-pink-600">
            ${sweet.price.toFixed(2)}
          </p>
          <p
            className={`text-xs font-semibold px-3 py-1 rounded-full transition 
                        ${isSoldOut ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
          >
            {isSoldOut ? "Out of Stock" : `Stock: ${stock}`}
          </p>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={isSoldOut}
        className={`w-full py-3 text-lg font-bold transition duration-200 rounded-b-2xl 
          ${isSoldOut 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-[#FF69B4] text-white hover:bg-pink-600 hover:scale-[1.02]"}`}
      >
        {isSoldOut ? "Sold Out" : "Purchase"}
      </button>
    </div>
  );
};

export default SweetCard;
