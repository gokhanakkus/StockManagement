import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Alert, Spinner, Container, Form, Row, Col } from 'react-bootstrap'
import ProductFormModal from '../components/ProductFormModal'
import {getProducts,createProduct,updateProduct,deleteProduct,exportProducts} from '../api/productService'

function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) // null => yeni ürün
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [criticalOnly, setCriticalOnly] = useState(false)

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort()

  const filteredProducts = products.filter((p) => {
    const term = search.trim().toLowerCase()
    const matchesSearch =
      !term ||
      p.productName.toLowerCase().includes(term) ||
      p.productCode.toLowerCase().includes(term)

    const matchesCategory = !category || p.category === category
    const matchesCritical = !criticalOnly || p.isCritical

    return matchesSearch && matchesCategory && matchesCritical
  })

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (err) {
      setError(getErrorMessage(err, 'Ürünler yüklenirken bir hata oluştu.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleNew = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    setError('')
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await createProduct(payload)
      }
      handleCloseModal()
      await loadProducts()
    } catch (err) {
      setError(getErrorMessage(err, 'Ürün kaydedilirken bir hata oluştu.'))
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      await exportProducts()
    } catch (err) {
      setError(getErrorMessage(err, 'Excel dosyası oluşturulurken bir hata oluştu.'))
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `"${product.productName}" ürününü silmek istediğinize emin misiniz?`
    )
    if (!confirmed) return

    setError('')
    try {
      await deleteProduct(product.id)
      await loadProducts()
    } catch (err) {
      setError(getErrorMessage(err, 'Ürün silinirken bir hata oluştu.'))
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-1">Ürünler</h2>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={handleExport} disabled={exporting}>
            {exporting ? 'İndiriliyor...' : "Excel'e Aktar"}
          </Button>
          <Button variant="primary" onClick={handleNew}>
            Yeni Ürün
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Row className="g-2 mb-3 align-items-center">
        <Col md={5}>
          <Form.Control
            type="search"
            placeholder="Ürün adı veya kodu ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Check
            type="checkbox"
            label="Sadece kritik stok"
            checked={criticalOnly}
            onChange={(e) => setCriticalOnly(e.target.checked)}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <div className="mt-2">Yükleniyor...</div>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Birim</th>
              <th className="text-end">Birim Fiyat</th>
              <th className="text-end">Stok</th>
              <th className="text-end">Kritik Seviye</th>
              <th className="text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  {products.length === 0 ? 'Kayıtlı ürün bulunamadı.' : 'Sonuç bulunamadı.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className={p.isCritical ? 'table-danger' : ''}>
                  <td>{p.productCode}</td>
                  <td>{p.productName}</td>
                  <td>{p.category || '-'}</td>
                  <td>{p.unit || '-'}</td>
                  <td className="text-end">{p.unitPrice.toFixed(2)} ₺</td>
                  <td className="text-end">{p.stockQuantity}</td>
                  <td className="text-end">{p.criticalLevel}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/products/${p.id}`)}
                    >
                      Detay
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(p)}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <ProductFormModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
        product={editingProduct}
        saving={saving}
      />
    </Container>
  )
}

function getErrorMessage(err, fallback) {
  const data = err?.response?.data
  if (typeof data === 'string' && data) return data
  if (data?.title) return data.title
  return err?.message || fallback
}

export default ProductList
