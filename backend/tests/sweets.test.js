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
  /**
   * @description Connect to test DB and create admin & user accounts before tests
   */
  await mongoose.connect(process.env.MONGO_URI)

  const admin = await User.create({
    email: 'admin@test.com',
    password: await bcrypt.hash('password', 10),
    role: 'admin',
  })

  const user = await User.create({
    email: 'user@test.com',
    password: await bcrypt.hash('password', 10),
    role: 'user',
  })

  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
})

afterAll(async () => {
  /**
   * @description Clean up test data and close DB connection
   */
  await User.deleteMany({})
  await Sweet.deleteMany({})
  await mongoose.connection.close()
})

afterEach(async () => {
  /**
   * @description Clean up sweets collection after each test
   */
  await Sweet.deleteMany({})
})

describe('Sweet Controller Endpoints', () => {
  describe('Admin-only routes', () => {
    it('should allow admin to create a sweet', async () => {
      /**
       * @test
       * @description Test that admin can create a sweet.
       * Expects status 201 and sweet data returned.
       */
      const res = await request(app)
        .post('/api/sweets')
        .set('Cookie', [`token=${adminToken}`])
        .send({ name: 'Chocolate', category: 'Candy', price: 10, quantity: 5 })

      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('Chocolate')
    })

    it('should prevent non-admin user from creating a sweet', async () => {
      /**
       * @test
       * @description Test that non-admin cannot create a sweet.
       * Expects status 403 and admin error message.
       */
      const res = await request(app)
        .post('/api/sweets')
        .set('Cookie', [`token=${userToken}`])
        .send({ name: 'Chocolate', category: 'Candy', price: 10, quantity: 5 })

      expect(res.statusCode).toBe(403)
      expect(res.body.error).toMatch(/admin/i)
    })

    it('should allow admin to delete a sweet', async () => {
      /**
       * @test
       * @description Test that admin can delete a sweet.
       * Expects status 200 and success message.
       */
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
      /**
       * @test
       * @description Test that non-admin cannot delete a sweet.
       * Expects status 403 and admin error message.
       */
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
      /**
       * @test
       * @description Test fetching all sweets as a logged-in user.
       * Expects status 200 and array of sweets.
       */
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
      /**
       * @test
       * @description Test searching sweets by name query parameter.
       * Expects status 200 and filtered sweets array.
       */
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
      /**
       * @test
       * @description Test that user can purchase a sweet when quantity > 0.
       * Expects status 200 and remaining quantity decreased by 1.
       */
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
      /**
       * @test
       * @description Test that purchase fails when sweet quantity is 0.
       * Expects status 400 and out-of-stock error message.
       */
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

describe('Restock Sweet (Admin only)', () => {
  it('should allow admin to restock a sweet', async () => {
    /**
     * @test
     * @description Test restock endpoint for admin.
     * Expects status 200, success message, and new quantity updated correctly.
     */
    const sweet = await Sweet.create({
      name: 'Jelly',
      category: 'Candy',
      price: 5,
      quantity: 2,
    })

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ quantity: 5 })

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/restocked/i)
    expect(res.body.newQuantity).toBe(7) // 2 + 5
  })

  it('should not allow non-admin user to restock', async () => {
    /**
     * @test
     * @description Test that non-admin cannot restock a sweet.
     * Expects status 403 and admin error message.
     */
    const sweet = await Sweet.create({
      name: 'Marshmallow',
      category: 'Candy',
      price: 3,
      quantity: 4,
    })

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Cookie', [`token=${userToken}`])
      .send({ quantity: 3 })

    expect(res.statusCode).toBe(403)
    expect(res.body.error).toMatch(/admin/i)
  })

  it('should return 400 if quantity is missing or invalid', async () => {
    /**
     * @test
     * @description Test that restock fails when quantity is invalid or <= 0.
     * Expects status 400 and validation error message.
     */
    const sweet = await Sweet.create({
      name: 'Fudge',
      category: 'Candy',
      price: 8,
      quantity: 6,
    })

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ quantity: 0 })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toMatch(/greater than zero/i)
  })

  it('should return 404 if sweet is not found', async () => {
    /**
     * @test
     * @description Test that restock fails when sweet ID does not exist.
     * Expects status 404 and not-found error message.
     */
    const fakeId = new mongoose.Types.ObjectId()

    const res = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ quantity: 5 })

    expect(res.statusCode).toBe(404)
    expect(res.body.error).toMatch(/not found/i)
  })
})
