import { useContext, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, Redirect } from "react-router-dom"
import CenteredContainer from "./CenteredContainer"

function ForgotPassword() {
  const emailRef = useRef()
  const {resetPassword,currentUser} = useContext(AuthContext);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await resetPassword(emailRef.current.value);
      setMessage('Check your email for instructions')
    } catch {
      setError('Failed to reset');
    }
    setLoading(false);
  }
 
  if(!currentUser) return <Redirect to="/login"/>
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </CenteredContainer>
  )
}
export default ForgotPassword