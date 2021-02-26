import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Card, Button, Alert } from "react-bootstrap"
import { Link, Redirect, useHistory } from "react-router-dom"
import CenteredContainer from "./CenteredContainer"

function Profile() {
  const [error, setError] = useState("");
  const history = useHistory();
  const {currentUser,signout} = useContext(AuthContext);
  const logOut = async()=>{
    try {
      setError('');
      await signout();
      history.push('/login');
    } catch {
      setError('Failed to logout');
    }
  }
 
  if(!currentUser) return <Redirect to="/login"/>
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={logOut}>
          Log Out
        </Button>
      </div>
    </CenteredContainer>
  )
}

export default Profile