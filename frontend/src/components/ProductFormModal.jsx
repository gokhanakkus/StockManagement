import { useEffect, useState } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'

const emptyForm = {productCode: '',productName: '',category: '',unit: '',unitPrice: 0,stockQuantity: 0, criticalLevel: 0}

function ProductFormModal({ show, onHide, onSubmit, product, saving }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {

    if (product) {

      setForm({
        productCode: product.productCode ?? '',
        productName: product.productName ?? '',
        category: product.category ?? '',

        unit: product.unit ?? '',
        unitPrice: product.unitPrice ?? 0,
        stockQuantity: product.stockQuantity ?? 0,
        criticalLevel: product.criticalLevel ?? 0,
      })

    } else {
      setForm(emptyForm)
    }
  }, [product, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      productName: form.productName.trim(),
      category: form.category.trim() || null,
      unit: form.unit.trim() || null,
      unitPrice: Number(form.unitPrice),
      criticalLevel: Number(form.criticalLevel)
    }

    if (!isEdit) {
      payload.productCode = form.productCode.trim()
      payload.stockQuantity = Number(form.stockQuantity)
    }

    onSubmit(payload)
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Ürün Kodu</Form.Label>
            <Form.Control
              name="productCode"
              value={form.productCode}
              onChange={handleChange}
              required={!isEdit}
              // Ürün kodu güncellenemez
              disabled={isEdit}
              maxLength={50}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Kategori</Form.Label>
                <Form.Control
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Birim</Form.Label>
                <Form.Control
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="Adet, Kg, Lt..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Birim Fiyat</Form.Label>
                <Form.Control
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Stok</Form.Label>
                <Form.Control
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  min={0}
                  disabled={isEdit}
                  required={!isEdit}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Kritik Seviye</Form.Label>
                <Form.Control
                  type="number"
                  name="criticalLevel"
                  value={form.criticalLevel}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            İptal
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ProductFormModal
