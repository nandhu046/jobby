import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'
import '../../App.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const details = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }
    const responseObj = await fetch('https://apis.ccbp.in/login', details)
    const accessToken = await responseObj.json()
    const token = accessToken.jwt_token
    if (responseObj.ok === true) {
      Cookies.set('jwt_token', token, {expires: 1})
      const {history} = this.props
      history.replace('/')
    } else {
      const message = accessToken.error_msg
      this.setState({errorMsg: message})
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="app-logo"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            id="username"
            className="input-field"
            placeholder="Username"
            type="text"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label htmlFor="pass" className="label">
            PASSWORD
          </label>
          <input
            id="pass"
            className="input-field"
            placeholder="Password"
            type="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <button className="submit-form-btn" onClick={this.onSubmitForm}>
            Login
          </button>
          {errorMsg !== '' && <p className="login-error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default withRouter(Login)
