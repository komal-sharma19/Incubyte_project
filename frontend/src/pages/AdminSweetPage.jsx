import { useState, useEffect } from 'react'
import api from '../api/axios'

const AdminSweetsPage = () => {
  const [sweets, setSweets] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    category: '',
    price: '',
    quantity: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  // --- Fetch sweets on mount ---
  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      const res = await api.get('/sweets')
      setSweets(res.data)
    } catch (err) {
    }
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    const processedValue =
      (name === 'price' || name === 'quantity') && value !== ''
        ? value.replace(/[^0-9.]/g, '')
        : value
    setForm((prev) => ({ ...prev, [name]: processedValue }))
  }

  // --- Add new sweet ---
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.price || !form.quantity) {
      return
    }
    try {
      const res = await api.post('/sweets', {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      })
      setSweets([...sweets, res.data]) // append new sweet
      setForm({ id: null, name: '', category: '', price: '', quantity: '' })
    } catch (err) {
    }
  }

  // --- Edit sweet ---
  const handleEdit = (sweet) => {
    setForm({
      ...sweet,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    })
    setIsEditing(true)
  }

  // --- Update sweet ---
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.price || !form.quantity) {
      return
    }

    try {
      const res = await api.put(`/sweets/${form._id || form.id}`, {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      })

      setSweets(
        sweets.map((s) =>
          s._id === res.data._id || s.id === res.data.id ? res.data : s
        )
      )

      setForm({ id: null, name: '', category: '', price: '', quantity: '' })
      setIsEditing(false)
    } catch (err) {
    }
  }

  // --- Delete sweet ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.delete(`sweets/${id}`)
        setSweets(sweets.filter((s) => s._id !== id && s.id !== id))
      } catch (err) {
      }
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setForm({ id: null, name: '', category: '', price: '', quantity: '' })
    setIsEditing(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6 md:p-10 font-sans'>
      <h1 className='text-4xl md:text-5xl font-extrabold text-pink-700 mb-12 text-center drop-shadow-lg'>
        Admin Panel
      </h1>

      {/* Form */}
      <form
        onSubmit={isEditing ? handleUpdate : handleAdd}
        className='bg-white shadow-2xl rounded-3xl p-6 md:p-10 mb-12 max-w-5xl mx-auto border-t-8 border-pink-400'
      >
        <h2 className='text-3xl font-extrabold mb-8 text-gray-700 border-b pb-3'>
          {isEditing ? 'Edit Inventory' : 'Add New Sweet'}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <input
            type='text'
            name='name'
            placeholder='Sweet Name'
            value={form.name}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
          />
          <input
            type='text'
            name='category'
            placeholder='Category'
            value={form.category}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
          />
          <input
            type='number'
            name='price'
            placeholder='Price'
            value={form.price}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
          />
          <input
            type='number'
            name='quantity'
            placeholder='Quantity'
            value={form.quantity}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 transition duration-300'
          />
        </div>

        <div className='mt-8 flex justify-end space-x-3'>
          {isEditing && (
            <button
              type='button'
              onClick={handleCancelEdit}
              className='px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition'
            >
              Cancel
            </button>
          )}
          <button
            type='submit'
            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition ${
              isEditing
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Add Sweet to Stock'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className='bg-white shadow-2xl rounded-3xl p-6 md:p-10 max-w-5xl mx-auto border-b-8 border-pink-400'>
        <h2 className='text-3xl font-extrabold mb-6 text-gray-700'>
          Current Inventory
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse'>
            <thead>
              <tr className='bg-pink-100 text-left text-pink-700 uppercase text-xs sm:text-sm shadow-md'>
                <th className='p-4'>Name</th>
                <th className='p-4 hidden sm:table-cell'>Category</th>
                <th className='p-4'>Price</th>
                <th className='p-4 text-center'>Quantity</th>
                <th className='p-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet, idx) => (
                <tr
                  key={sweet._id || sweet.id}
                  className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
                  } hover:bg-pink-200`}
                >
                  <td className='p-4'>{sweet.name}</td>
                  <td className='p-4 hidden sm:table-cell'>{sweet.category}</td>
                  <td className='p-4'>${sweet.price.toFixed(2)}</td>
                  <td
                    className={`p-4 text-center ${
                      sweet.quantity === 0 ? 'text-red-500' : 'text-pink-600'
                    }`}
                  >
                    {sweet.quantity}
                  </td>
                  <td className='p-4 flex gap-2'>
                    <button
                      onClick={() => handleEdit(sweet)}
                      className='px-3 py-1 bg-rose-400 text-white rounded-lg'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id || sweet.id)}
                      className='px-3 py-1 bg-red-500 text-white rounded-lg'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sweets.length === 0 && (
                <tr>
                  <td
                    colSpan='5'
                    className='text-center py-6 text-gray-500 italic'
                  >
                    No sweets available 🍩
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminSweetsPage
