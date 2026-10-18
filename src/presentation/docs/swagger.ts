export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Food Delivery Production API',
    version: '1.0.0',
    description:
      'Production-grade RESTful API backend for Food Delivery application with JWT Authentication, Role-Based Access Control (RBAC), Server-Side Order Calculations, and Cryptographically Verified Payments.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Default Base URL',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
          timestamp: { type: 'string' },
          correlationId: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'System health check',
        responses: { '200': { description: 'Healthy' } },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register new user account',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['customer', 'chef', 'rider'] },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate and receive access + refresh JWT tokens',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'OK' } },
      },
    },
    '/home/discovery': {
      get: {
        summary: 'Home screen discovery payload (banners, categories, featured restaurants, popular foods)',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/restaurants': {
      get: {
        summary: 'List restaurants with optional category and search filters',
        parameters: [
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/orders': {
      post: {
        summary: 'Place new verified food order',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Created' } },
      },
      get: {
        summary: 'Get active orders for authenticated user',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/payments/create-intent': {
      post: {
        summary: 'Create payment intent with transaction reference and client secret',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/payments/verify': {
      post: {
        summary: 'Verify payment with provider and settle order',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } },
      },
    },
  },
};
