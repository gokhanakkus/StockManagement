import api from './axios'

export const getAllMovements = () => api.get('/stockmovements')

export const getMovementsByProduct = (productId) =>
  api.get(`/stockmovements/product/${productId}`)

export const createMovement = (payload) => api.post('/stockmovements', payload)
