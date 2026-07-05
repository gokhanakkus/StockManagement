import { useEffect, useState } from 'react'
import { Table, Button, Alert, Spinner, Container, Badge } from 'react-bootstrap'
import MovementFormModal from '../components/MovementFormModal'
import {getAllMovements,createMovement} from '../api/stockMovementService'
import { getProducts } from '../api/productService'

function StockMovements() {
  
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const loadMovements = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllMovements()
      setMovements(res.data)
    } catch (err) {
      setError(getErrorMessage(err, 'Stok hareketleri yüklenirken bir hata oluştu.'))
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (err) {
      setError(getErrorMessage(err, 'Ürünler yüklenirken bir hata oluştu.'))
    }
  }

  useEffect(() => {loadMovements()
    loadProducts()
  }, [])

  const handleNew = () => {
    setSubmitError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSubmitError('')
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    setSubmitError('')
    try {
      await createMovement(payload)
      handleCloseModal()
      await loadMovements()
      await loadProducts()
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Hareket kaydedilirken bir hata oluştu.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Stok Hareketleri</h2>
        <Button variant="success" onClick={handleNew}>
          Yeni Hareket
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th className="text-center">Hareket Tipi</th>
              <th className="text-end">Miktar</th>
              <th>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  Kayıtlı stok hareketi bulunamadı.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.productCode}</td>
                  <td>{m.productName}</td>
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
      )}

      <MovementFormModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
        products={products}
        saving={saving}
        error={submitError}
      />
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

export default StockMovements
