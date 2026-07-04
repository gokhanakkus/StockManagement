import { useEffect, useState } from 'react'
import {Container,Row,Col,Card,Table,Badge,Spinner,Alert,} from 'react-bootstrap'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from 'recharts'
import { getSummary } from '../api/dashboardService'

function Dashboard() {

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadSummary = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getSummary()
        setSummary(res.data)
      } catch (err) {
        setError(getErrorMessage(err, 'Özet bilgileri yüklenirken bir hata oluştu.'))
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status"/>
          <div className="mt-2">Yükleniyor...</div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card bg="primary" text="white" className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 text-uppercase">Toplam Ürün</Card.Title>
              <div className="fs-2 fw-bold">{summary.totalProducts}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card bg="success" text="white" className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 text-uppercase">Toplam Stok Değeri</Card.Title>
              <div className="fs-2 fw-bold">{formatCurrency(summary.totalStockValue)}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card bg="danger" text="white" className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 text-uppercase">Kritik Stok</Card.Title>
              <div className="fs-2 fw-bold">{summary.criticalCount}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-3">Kategori Dağılımı</Card.Title>
              {summary.categoryDistribution.length === 0 ? (
                <div className="text-muted">Gösterilecek kategori bulunamadı.</div>
              ) : ( <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d6efd" name="Ürün Sayısı" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-3">Son Hareketler</Card.Title>
              <Table striped bordered hover responsive size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Ürün Adı</th>
                    <th className="text-center">Tip</th>
                    <th className="text-end">Miktar</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentMovements.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Kayıtlı stok hareketi bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    summary.recentMovements.map((m, index) => (
                      <tr key={index}>
                        <td>{formatDate(m.date)}</td>
                        <td>{m.productName}</td>
                        <td className="text-center">
                          {m.movementType === 'In' ? (
                            <Badge bg="success">Giriş</Badge>
                          ) : (
                            <Badge bg="danger">Çıkış</Badge>
                          )}
                        </td>
                        <td className="text-end">{m.quantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value ?? 0)
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

export default Dashboard
