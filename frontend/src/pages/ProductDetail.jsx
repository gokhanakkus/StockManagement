import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Button, Alert, Spinner, Container, Badge, Card, Row, Col } from 'react-bootstrap'
import ProductFormModal from '../components/ProductFormModal'
import { getProduct, updateProduct } from '../api/productService'
import { getMovementsByProduct } from '../api/stockMovementService'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

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
      setError(getErrorMessage(err, 'Ürün detayı yüklenirken bir hata oluştu.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleUpdate = async (payload) => {
    setSaving(true)
    setError('')
    try {
      await updateProduct(id, payload)
      setShowModal(false)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Ürün kaydedilirken bir hata oluştu.'))
    } finally {
      setSaving(false)
    }
  }

  const totalIn = movements
    .filter((m) => m.movementType === 'In')
    .reduce((sum, m) => sum + m.quantity, 0)

  const totalOut = movements
    .filter((m) => m.movementType === 'Out')
    .reduce((sum, m) => sum + m.quantity, 0)

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Ürün Detayı</h2>
        <div className="d-flex gap-2">
          {product && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Düzenle
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/products')}>
            Geri
          </Button>
        </div>
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
      ) : product ? (
        <>
          <Card className={`mb-4 ${product.isCritical ? 'border-danger' : ''}`}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">
                {product.productCode} - {product.productName}
              </span>
              {product.isCritical && <Badge bg="danger">Kritik Stok</Badge>}
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <DetailField label="Ürün Kodu" value={product.productCode} />
                <DetailField label="Ürün Adı" value={product.productName} />
                <DetailField label="Kategori" value={product.category || '-'} />
                <DetailField label="Birim" value={product.unit || '-'} />
                <DetailField label="Birim Fiyat" value={`${product.unitPrice.toFixed(2)} ₺`} />
                <DetailField
                  label="Stok Miktarı"
                  value={product.stockQuantity}
                  valueClass={product.isCritical ? 'text-danger fw-bold' : ''}
                />
                <DetailField label="Kritik Seviye" value={product.criticalLevel} />
                <DetailField label="Oluşturma Tarihi" value={formatDate(product.createdAt)} />
              </Row>
            </Card.Body>
          </Card>

          <div className="d-flex gap-4 mb-3">
            <div>
              Toplam Giriş: <strong className="text-success">{totalIn}</strong>
            </div>
            <div>
              Toplam Çıkış: <strong className="text-danger">{totalOut}</strong>
            </div>
          </div>

          <h5 className="mb-3">Stok Hareket Geçmişi</h5>
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

          <ProductFormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onSubmit={handleUpdate}
            product={product}
            saving={saving}
          />
        </>
      ) : null}
    </Container>
  )
}

function DetailField({ label, value, valueClass = '' }) {
  return (
    <Col xs={6} md={3}>
      <div className="text-muted small">{label}</div>
      <div className={valueClass}>{value}</div>
    </Col>
  )
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('tr-TR')
}

function getErrorMessage(err, fallback) {
  const data = err?.response?.data
  if (typeof data === 'string' && data) return data
  if (data?.title) return data.title
  return err?.message || fallback
}

export default ProductDetail
