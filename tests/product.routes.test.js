const request = require('supertest');

jest.mock('../src/services/product.service', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn()
}));

const app = require('../src/app');
const productService = require('../src/services/product.service');
const { AppError } = require('../src/errors');

describe('Product routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/products devuelve 200', async () => {
    productService.getProducts.mockResolvedValue([{ id: 1, name: 'Producto demo' }]);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
  });

  it('GET /api/products/:id devuelve producto existente', async () => {
    productService.getProductById.mockResolvedValue({ id: 1, name: 'Producto 1' });

    const response = await request(app).get('/api/products/1');

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  it('GET /api/products/:id devuelve 404 para inexistente', async () => {
    productService.getProductById.mockRejectedValue(new AppError('Producto no encontrado', 404));

    const response = await request(app).get('/api/products/99999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
