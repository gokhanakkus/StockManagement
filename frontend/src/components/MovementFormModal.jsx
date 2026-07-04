import { useEffect, useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'

const emptyForm = {
  productId: '',
  movementType: 'In',
  quantity: 1,
  description: '',
}

function MovementFormModal({ show, onHide, onSubmit, products, saving, error }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (show) {
      setForm(emptyForm)
    }
  }, [show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      productId: Number(form.productId),
      movementType: form.movementType,
      quantity: Number(form.quantity),
      description: form.description.trim() || null,
    }

    onSubmit(payload)
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Hareket</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Ürün</Form.Label>
            <Form.Select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            >
              <option value="">Ürün seçin...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productCode} - {p.productName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hareket Tipi</Form.Label>
            <Form.Select
              name="movementType"
              value={form.movementType}
              onChange={handleChange}
              required
            >
              <option value="In">Giriş</option>
              <option value="Out">Çıkış</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Miktar</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min={1}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>
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

export default MovementFormModal
