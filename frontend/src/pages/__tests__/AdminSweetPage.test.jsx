// src/pages/__tests__/AdminSweetsPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminSweetsPage from '../AdminSweetPage'
import api from '../../api/axios'
import { vi } from 'vitest'

// Mock the API layer
vi.mock('../../api/axios')
// Mock window.confirm used in the delete handler
global.window.confirm = vi.fn(() => true) 

describe('AdminSweetsPage', () => {
  // Use _id to match the component's state update logic (s._id === res.data._id)
  const mockSweets = [
    { _id: '1', name: 'Ladoo', category: 'Indian', price: 10, quantity: 5 },
    { _id: '2', name: 'Chocolate', category: 'Western', price: 15, quantity: 0 },
  ]

  beforeEach(() => {
    // Mock the initial fetch call
    api.get.mockResolvedValue({ data: mockSweets })
    vi.clearAllMocks()
    global.window.confirm = vi.fn(() => true) // Reset mock after each test
  })

  // ------------------------------------------------------------------
  // TEST 1: Initial Render
  // ------------------------------------------------------------------
  test('renders page title and initial sweets', async () => {
    render(<AdminSweetsPage />)
    
    // Check form inputs are present (using the simple placeholder)
    expect(screen.getByPlaceholderText('Sweet Name')).toBeInTheDocument()

    // Wait for sweets to appear after fetching
    expect(await screen.findByText('Ladoo')).toBeInTheDocument()
    expect(await screen.findByText('Chocolate')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/sweets')
  })

  // ------------------------------------------------------------------
  // TEST 2: Input Changes
  // ------------------------------------------------------------------
  test('handles input changes', () => {
    render(<AdminSweetsPage />)
    // Using the simple placeholder: 'Sweet Name'
    const nameInput = screen.getByPlaceholderText('Sweet Name') 
    fireEvent.change(nameInput, { target: { value: 'Barfi' } })
    expect(nameInput.value).toBe('Barfi')
  })

  // ------------------------------------------------------------------
  // TEST 3: Add New Sweet
  // ------------------------------------------------------------------
  test('adds a new sweet', async () => {
    const newSweetData = { _id: '3', name: 'Barfi', category: 'Indian', price: 20, quantity: 3 };
    api.post.mockResolvedValue({ data: newSweetData })

    render(<AdminSweetsPage />)

    // Using the simple placeholders from the latest component file
    fireEvent.change(screen.getByPlaceholderText('Sweet Name'), { target: { value: newSweetData.name } })
    fireEvent.change(screen.getByPlaceholderText('Category'), { target: { value: newSweetData.category } })
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: newSweetData.price.toString() } })
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: newSweetData.quantity.toString() } })

    fireEvent.click(screen.getByText(/Add Sweet to Stock/i))

    // Wait for the POST call to resolve and the new sweet to be rendered
    expect(await screen.findByText('Barfi')).toBeInTheDocument()
    expect(api.post).toHaveBeenCalledWith('/sweets', {
        name: 'Barfi',
        category: 'Indian',
        price: 20,
        quantity: 3,
    });
  })

  // ------------------------------------------------------------------
  // TEST 4: Delete Sweet
  // ------------------------------------------------------------------
  test('deletes a sweet', async () => {
    api.delete.mockResolvedValue({})

    render(<AdminSweetsPage />)
    
    // Wait for initial data load
    const deleteButton = await screen.findAllByText('Delete')

    fireEvent.click(deleteButton[0])

    // Use waitFor to ensure the sweet is removed from the DOM
    await waitFor(() => {
        expect(screen.queryByText('Ladoo')).not.toBeInTheDocument()
    })
    
    expect(api.delete).toHaveBeenCalledWith('sweets/1')
  })

  // ------------------------------------------------------------------
  // TEST 5: Empty List
  // ------------------------------------------------------------------
  test('shows "No sweets available" when list is empty', async () => {
    api.get.mockResolvedValue({ data: [] })
    render(<AdminSweetsPage />)
    
    // Check for the empty state message
    expect(await screen.findByText(/No sweets available/i)).toBeInTheDocument()
    expect(screen.queryByText('Ladoo')).not.toBeInTheDocument()
  })
})