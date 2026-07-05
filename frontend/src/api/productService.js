import api from './axios'

export const getProducts = () => api.get('/products')

export const getProduct = (id) => api.get(`/products/${id}`)

export const getCriticalProducts = () => api.get('/products/critical')

export const createProduct = (data) => api.post('/products', data)

export const updateProduct = (id, data) => api.put(`/products/${id}`, data)

export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const exportProducts = async () => {
  const res = await api.get('/products/export', { responseType: 'blob' })

  const fileName = parseFileName(res.headers['content-disposition'])
  const url = URL.createObjectURL(res.data)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

const parseFileName = (contentDisposition) => {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/)
  return match ? match[1] : `Urunler_${new Date().toISOString().slice(0, 10)}.xlsx`
}
