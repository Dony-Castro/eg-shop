const request = require('supertest');

jest.mock('../src/services/order.service', () => ({
  createOrder: jest.fn(),
  getOrderById: jest.fn()
}));

const app = require('../src/app');
const orderService = require('../src/services/order.service');
const { AppError } = require('../src/errors');

const validPayload = {
  customer: {
    fullName: 'Juan Pérez García',
    email: 'juan@email.com',
    phone: '8095551234',
    address: 'Calle Principal número 10',
    city: 'San Cristóbal',
    locationReference: 'Próximo al parque'
  },
  items: [
    { productId: 1, quantity: 2 }
  ]
};

describe('Order routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/orders rechaza carrito vacío', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ customer: validPayload.customer, items: [] });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('POST /api/orders rechaza cliente incompleto', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ customer: { email: 'x@mail.com' }, items: [{ productId: 1, quantity: 1 }] });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('POST /api/orders rechaza cantidades inválidas', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, items: [{ productId: 1, quantity: 0 }] });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('POST /api/orders crea pedido válido', async () => {
    orderService.createOrder.mockResolvedValue({
      orderId: 123,
      status: 'Pendiente',
      total: 5900,
      message: 'Pedido creado exitosamente'
    });

    const response = await request(app)
      .post('/api/orders')
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.orderId).toBe(123);
  });

  it('POST /api/orders rechaza stock insuficiente', async () => {
    orderService.createOrder.mockRejectedValue(new AppError('Stock insuficiente para producto', 409));

    const response = await request(app)
      .post('/api/orders')
      .send(validPayload);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('GET /api/orders/:id devuelve pedido existente', async () => {
    orderService.getOrderById.mockResolvedValue({
      id: 1,
      status: 'Pendiente',
      total: 1000,
      customer: { fullName: 'Cliente' },
      items: []
    });

    const response = await request(app).get('/api/orders/1');

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });
});
