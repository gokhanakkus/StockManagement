import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Alert, Container, Spinner } from 'react-bootstrap'
import { login } from '../api/authService'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Kullanıcı adı veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4 fs-3">Stok Yönetim</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Giriş Yap'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
