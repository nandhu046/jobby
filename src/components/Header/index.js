import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {FiLogOut} from 'react-icons/fi'
import {MdWork} from 'react-icons/md'
import '../../App.css'

const Header = props => {
  const logOutUser = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="home-logo"
          alt="website logo"
        />
      </Link>
      <ul className="nav-items-container">
        <Link to="/">
          {/* eslint-disable-next-line */}
          <li className="button">
            <IoMdHome className="nav-icon" />
          </li>
        </Link>
        <Link to="/jobs">
          {/* eslint-disable-next-line */}
          <li className="button">
            <MdWork className="nav-icon" />
          </li>
        </Link>
        <Link to="/login">
          {/* eslint-disable-next-line */}
          <li className="button" onClick={logOutUser}>
            <FiLogOut className="nav-icon" />
          </li>
        </Link>
      </ul>
      <div className="nav-items-container2">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
        <Link to="/jobs">
          <button className="button">Jobs</button>
        </Link>
      </div>
      <div className="l-o">
        <Link to="/login">
          <button onClick={logOutUser} className="log-out-btn">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  )
}

export default withRouter(Header)
