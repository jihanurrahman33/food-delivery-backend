import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../../src/app';
import { DependencyContainer } from '../../src/container';
import { Express } from 'express';

describe('Food Delivery Backend API Integration Tests', () => {
  let app: Express;
  let container: DependencyContainer;
  let customerToken: string;
  let chefToken: string;
  let riderToken: string;

  before(async () => {
    container = DependencyContainer.getInstance();
    app = createApp(container);
  });

  describe('Health Endpoint', () => {
    it('GET /api/v1/health should return 200 OK', async () => {
      const res = await request(app).get('/api/v1/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.status, 'healthy');
    });
  });

  describe('Authentication & RBAC', () => {
    it('POST /api/v1/auth/login should authenticate default customer', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'jihanurrahman33@gmail.com', password: 'password123' });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.tokens.accessToken);
      assert.equal(res.body.data.user.email, 'jihanurrahman33@gmail.com');
      assert.equal(res.body.data.user.role, 'customer');
      customerToken = res.body.data.tokens.accessToken;
    });

    it('POST /api/v1/auth/login should authenticate chef', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'chef@fooddelivery.com', password: 'password123' });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      chefToken = res.body.data.tokens.accessToken;
    });

    it('POST /api/v1/auth/login should authenticate rider', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'rider@fooddelivery.com', password: 'password123' });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      riderToken = res.body.data.tokens.accessToken;
    });

    it('GET /api/v1/profile should fail without auth token', async () => {
      const res = await request(app).get('/api/v1/profile');
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });

    it('GET /api/v1/profile should succeed with customer token', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.email, 'jihanurrahman33@gmail.com');
    });

    it('GET /api/v1/chef/dashboard should forbid customer (403 RBAC)', async () => {
      const res = await request(app)
        .get('/api/v1/chef/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    it('GET /api/v1/chef/dashboard should allow chef (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/chef/dashboard')
        .set('Authorization', `Bearer ${chefToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.activeOrders));
    });

    it('GET /api/v1/rider/dashboard should forbid customer (403 RBAC)', async () => {
      const res = await request(app)
        .get('/api/v1/rider/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    it('GET /api/v1/rider/dashboard should allow rider (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/rider/dashboard')
        .set('Authorization', `Bearer ${riderToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.todayEarnings !== undefined);
    });
  });

  describe('Restaurants and Foods', () => {
    let restaurantId: string;

    it('GET /api/v1/restaurants should list all restaurants', async () => {
      const res = await request(app).get('/api/v1/restaurants');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.length > 0);
      restaurantId = res.body.data[0].id;
    });

    it('GET /api/v1/restaurants/:id should return restaurant detail', async () => {
      const res = await request(app).get(`/api/v1/restaurants/${restaurantId}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, restaurantId);
    });

    it('GET /api/v1/restaurants/:id/foods should return menu items', async () => {
      const res = await request(app).get(`/api/v1/restaurants/${restaurantId}/foods`);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });

    it('GET /api/v1/home/categories should return category list', async () => {
      const res = await request(app).get('/api/v1/home/categories');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.length > 0);
    });

    it('GET /api/v1/home/banners should return banners', async () => {
      const res = await request(app).get('/api/v1/home/banners');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.length > 0);
    });
  });

  describe('Order & Payment Lifecycle', () => {
    let createdOrderId: string;
    let paymentTransactionId: string;

    it('POST /api/v1/orders should create a new order with valid items and calculations', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          restaurantId: 'rest_1',
          deliveryAddress: '4517 Washington Ave., New York, NY 10011',
          paymentMethod: 'card',
          items: [
            {
              foodItemId: 'food_1',
              quantity: 2,
            },
          ],
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.subtotal, 19.98);
      createdOrderId = res.body.data.id;
    });

    it('POST /api/v1/payments/initiate should generate verified transaction intent', async () => {
      const res = await request(app)
        .post('/api/v1/payments/initiate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: createdOrderId,
          paymentMethod: 'card',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.transactionReference);
      assert.ok(res.body.data.clientSecret);
      paymentTransactionId = res.body.data.transactionReference;
    });

    it('POST /api/v1/payments/verify should cryptographically verify payment and confirm order', async () => {
      const res = await request(app)
        .post('/api/v1/payments/verify')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          transactionReference: paymentTransactionId,
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.success, true);
      assert.equal(res.body.data.status, 'succeeded');
    });

    it('GET /api/v1/orders/:id should retrieve order details and status', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, createdOrderId);
      assert.equal(res.body.data.paymentStatus, 'paid');
    });
  });
});
