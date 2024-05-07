import Cookies from 'js-cookie'
import {Route, Redirect} from 'react-router-dom'

const AuthenticateUser = props => {
  const s = Cookies.get('jwt_token')
  if (s === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default AuthenticateUser
