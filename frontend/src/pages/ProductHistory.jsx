import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Button, Alert, Spinner, Container, Badge } from 'react-bootstrap'
import { getProduct } from '../api/productService'
import { getMovementsByProduct } from '../api/stockMovementService'

function ProductHistory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [productRes, movementsRes] = await Promise.all([
          getProduct(id),
          getMovementsByProduct(id),
        ])
        setProduct(productRes.data)
        const sorted = [...movementsRes.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
        setMovements(sorted)
      } catch (err) {
        setError(getErrorMessage(err, 'Hareket geçmişi yüklenirken bir hata oluştu.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const totalIn = movements
    .filter((m) => m.movementType === 'In')
    .reduce((sum, m) => sum + m.quantity, 0)

  const totalOut = movements
    .filter((m) => m.movementType === 'Out')
    .reduce((sum, m) => sum + m.quantity, 0)

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">
          {product
            ? `${product.productCode} - ${product.productName} hareket geçmişi`
            : 'Hareket Geçmişi'}
        </h2>
        <Button variant="secondary" onClick={() => navigate('/products')}>
          Geri
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <div className="mt-2">Yükleniyor...</div>
        </div>
      ) : (
        <>
          {product && (
            <div className="d-flex gap-4 mb-3">
              <div>
                Toplam Giriş: <strong className="text-success">{totalIn}</strong>
              </div>
              <div>
                Toplam Çıkış: <strong className="text-danger">{totalOut}</strong>
              </div>
              <div>
                Mevcut Stok: <strong>{product.stockQuantity}</strong>
              </div>
            </div>
          )}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tarih</th>
                <th className="text-center">Hareket Tipi</th>
                <th className="text-end">Miktar</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    Bu ürün için hareket kaydı bulunmuyor
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id}>
                    <td>{formatDate(m.date)}</td>
                    <td className="text-center">
                      {m.movementType === 'In' ? (
                        <Badge bg="success">Giriş</Badge>
                      ) : (
                        <Badge bg="danger">Çıkış</Badge>
                      )}
                    </td>
                    <td className="text-end">{m.quantity}</td>
                    <td>{m.description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  )
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleString('tr-TR')
}

function getErrorMessage(err, fallback) {
  const data = err?.response?.data
  if (typeof data === 'string' && data) return data
  if (data?.title) return data.title
  return err?.message || fallback
}

export default ProductHistory
