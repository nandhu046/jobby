import {Link} from 'react-router-dom'
import Header from '../Header'
import '../../App.css'

const Home = props => (
  <div className="main-container">
    <Header />
    <div className="home-content-container">
      <div className="c1">
        <h1 className="home-heading">Find the Job That Fits Your Life</h1>
        <p className="home-para">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-jobs">Find Jobs</button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
