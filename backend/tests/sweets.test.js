/**
 * @file sweetController.test.js
 * @description Test suite for sweet-related endpoints in the Sweet Shop Management System.
 *              Tests CRUD, search, purchase, restock functionality, and access control (admin vs user).
 */

const request = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../server') // Express app
const Sweet = require('../models/Sweet')
const User = require('../models/User')

let adminToken, userToken

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI)

  // Create admin user
  const admin = await User.create({
    email: 'admin@test.com',
    password: await bcrypt.hash('password', 10),
    role: 'admin',
  })

  // Create regular user
  const user = await User.create({
    email: 'user@test.com',
    password: await bcrypt.hash('password', 10),
    role: 'user',
  })

  // Generate JWT tokens
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  })
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await Sweet.deleteMany({})
  await mongoose.connection.close()
})

afterEach(async () => {
  await Sweet.deleteMany({})
})

describe('Sweet Controller Endpoints', () => {
  describe('Admin-only routes', () => {
    it('should allow admin to create a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Cookie', [`token=${adminToken}`])
        .send({ name: 'Chocolate', category: 'Candy', price: 10, quantity: 5 })

      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('Chocolate')
    })

    it('should prevent non-admin user from creating a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Cookie', [`token=${userToken}`])
        .send({ name: 'Chocolate', category: 'Candy', price: 10, quantity: 5 })

      expect(res.statusCode).toBe(403)
      expect(res.body.error).toMatch(/admin/i)
    })

    it('should allow admin to delete a sweet', async () => {
      const sweet = await Sweet.create({
        name: 'Candy',
        category: 'Candy',
        price: 5,
        quantity: 10,
      })

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Cookie', [`token=${adminToken}`])

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toMatch(/deleted/i)
    })

    it('should prevent non-admin user from deleting a sweet', async () => {
      const sweet = await Sweet.create({
        name: 'Candy',
        category: 'Candy',
        price: 5,
        quantity: 10,
      })

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Cookie', [`token=${userToken}`])

      expect(res.statusCode).toBe(403)
      expect(res.body.error).toMatch(/admin/i)
    })
  })

  describe('Any logged-in user', () => {
    it('should get all sweets', async () => {
      await Sweet.create({
        name: 'Lollipop',
        category: 'Candy',
        price: 2,
        quantity: 5,
      })

      const res = await request(app)
        .get('/api/sweets')
        .set('Cookie', [`token=${userToken}`])

      expect(res.statusCode).toBe(200)
      expect(res.body.length).toBe(1)
    })

    it('should search sweets by name', async () => {
      await Sweet.create({
        name: 'Lollipop',
        category: 'Candy',
        price: 2,
        quantity: 5,
      })

      const res = await request(app)
        .get('/api/sweets/search?name=pop')
        .set('Cookie', [`token=${userToken}`])

      expect(res.statusCode).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body[0].name).toBe('Lollipop')
    })

    it('should allow user to purchase a sweet if in stock', async () => {
      const sweet = await Sweet.create({
        name: 'Gum',
        category: 'Candy',
        price: 1,
        quantity: 3,
      })

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Cookie', [`token=${userToken}`])

      expect(res.statusCode).toBe(200)
      expect(res.body.sweet.remainingQuantity).toBe(2)
    })

    it('should not allow purchase if quantity is zero', async () => {
      const sweet = await Sweet.create({
        name: 'Gum',
        category: 'Candy',
        price: 1,
        quantity: 0,
      })

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Cookie', [`token=${userToken}`])

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toMatch(/out of stock/i)
    })
  })
})
