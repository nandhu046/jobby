import {Component} from 'react'

import {Switch, Route, Redirect, Link, withRouter} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {FiLogOut} from 'react-icons/fi'
import {MdWork, MdLocationOn} from 'react-icons/md'
import {IoSearch} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class App extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    searchInput: '',
    eTypes: [],
    salary: '',
    profileStatus: 'INITIAL',
    profileDetails: '',
    jobsList: '',
    jobsStatus: 'INITIAL',
    jobItemStatus: 'INITIAL',
    jobItem: '',
  }

  componentWillUnmount() {}

  getProfile = async () => {
    const userToken = Cookies.get('jwt_token')
    const responseObj = await fetch('https://apis.ccbp.in/profile', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    const data = await responseObj.json()
    if (responseObj.ok === true) {
      const profileInfo = data.profile_details
      const profileObj = {
        profileImg: profileInfo.profile_image_url,
        profileName: profileInfo.name,
        profileBio: profileInfo.short_bio,
      }
      this.setState({profileStatus: 'SUCCESS', profileDetails: profileObj})
    } else {
      this.setState({profileStatus: 'FAILURE'})
    }
  }

  getJobs = async () => {
    const {searchInput, salary, eTypes} = this.state
    const userToken = Cookies.get('jwt_token')
    const empSelected = eTypes.join()
    const url = `https://apis.ccbp.in/jobs?employment_type=${empSelected}&minimum_package=${salary}&search=${searchInput}`
    const responseObj = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    const data = await responseObj.json()
    if (responseObj.ok === true) {
      this.setState({jobsList: data, jobsStatus: 'SUCCESS'})
    } else {
      this.setState({jobsStatus: 'FAILURE'})
    }
  }

  getJobDetails = async itemId => {
    const userToken = Cookies.get('jwt_token')
    const responseObj = await fetch(`https://apis.ccbp.in/jobs/${itemId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    const data = await responseObj.json()
    if (responseObj.ok === true) {
      this.setState({
        jobItemStatus: 'SUCCESS',
        jobItem: data,
      })
    } else {
      this.setState({jobItemStatus: 'FAILURE'})
    }
  }

  logOutUser = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  toHome = () => {
    const {history} = this.props
    history.push('/')
  }

  Login = props => {
    const onSubmitForm = async event => {
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
        const {history} = props
        history.replace('/')
      } else {
        const message = accessToken.error_msg
        this.setState({errorMsg: message})
      }
    }

    const onChangeUsername = event => {
      this.setState({username: event.target.value})
    }

    const onChangePassword = event => {
      this.setState({password: event.target.value})
    }

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
            onChange={onChangeUsername}
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
            onChange={onChangePassword}
          />
          <button className="submit-form-btn" onClick={onSubmitForm}>
            Login
          </button>
          {errorMsg !== '' && <p className="login-error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }

  Header = () => (
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
          <li className="button" onClick={this.logOutUser}>
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
          <button onClick={this.logOutUser} className="log-out-btn">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  )

  Home = props => (
    <div className="main-container">
      <this.Header />
      <div className="home-content-container">
        <div className="c1">
          <h1 className="home-heading">Find the Job That Fits Your Life</h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button className="find-jobs">Find Jobs</button>
          </Link>
        </div>
      </div>
    </div>
  )

  loader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failureView = () => {
    const {location} = this.props
    const id = location.pathname.split('/')[2]

    const getPath = () => {
      this.getJobDetails(id)
    }

    const onRetryJobs = () => {
      if (location.pathname === '/jobs') {
        this.setState({jobsStatus: 'INITIAL'}, this.getJobs)
      } else {
        this.setState({jobItemStatus: 'INITIAL'}, getPath)
      }
    }

    return (
      <>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="jobs-fail-img"
        />
        <h1 className="fail-heading">Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button className="find-jobs" onClick={onRetryJobs}>
          Retry
        </button>
      </>
    )
  }

  EmployLists = event => {
    const {eTypes} = this.state
    const CheckboxNotInLists = eTypes.filter(each => each === event.target.id)
    if (CheckboxNotInLists.length === 0) {
      this.setState(
        prevState => ({eTypes: [...prevState.eTypes, event.target.id]}),
        this.getJobs,
      )
    } else {
      const filterData = eTypes.filter(each => each !== event.target.id)
      this.setState(
        {
          eTypes: filterData,
        },
        this.getJobs,
      )
    }
  }

  Jobs = () => {
    const {
      profileStatus,
      jobsStatus,
      profileDetails,
      searchInput,
      jobItemStatus,
      eTypes,
    } = this.state

    if (jobItemStatus !== 'INITIAL') {
      this.setState({jobItemStatus: 'INITIAL'})
    }

    if (profileStatus === 'INITIAL') {
      this.getProfile()
    }

    if (jobsStatus === 'INITIAL') {
      this.getJobs()
    }

    const onChangeSearch = event => {
      this.setState({searchInput: event.target.value})
    }

    const onEnter = event => {
      if (event.key === 'Enter') {
        this.setState({jobsStatus: 'INITIAL'}, this.getJobs)
      }
    }

    const onSearchIcon = () => {
      this.setState({jobsStatus: 'INITIAL'}, this.getJobs)
    }

    const onRetryProfile = () => {
      this.setState({profileStatus: 'INITIAL'}, this.getProfile)
    }

    const renderProfile = () => {
      switch (profileStatus) {
        case 'INITIAL':
          return <div className="profile-loader-container">{this.loader()}</div>
        case 'SUCCESS':
          return (
            <div className="profile-container">
              <img
                src={profileDetails.profileImg}
                className="profile-img"
                alt="profile"
              />
              <h1 className="profile-name">{profileDetails.profileName}</h1>
              <p className="profile-bio">{profileDetails.profileBio}</p>
            </div>
          )
        default:
          return (
            <div className="profile-failure-container">
              <button className="find-jobs" onClick={onRetryProfile}>
                Retry
              </button>
            </div>
          )
      }
    }

    const JobItem = props => {
      const {jobDetails} = props
      const jobDetailsObj = {
        id: jobDetails.id,
        companyLogo: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        rolePackage: jobDetails.package_per_annum,
        title: jobDetails.title,
        rating: jobDetails.rating,
      }
      const {
        companyLogo,
        employmentType,
        id,
        jobDescription,
        location,
        rolePackage,
        title,
        rating,
      } = jobDetailsObj

      return (
        <Link to={`/jobs/${id}`} className="go-to-jobItem">
          <li className="job-item">
            <div className="company">
              <img src={companyLogo} alt="company logo" className="c-logo" />
              <div className="role">
                <h1 className="r-name">{title}</h1>
                <div className="job-star">
                  <FaStar className="job-logo" />
                  <p className="r-name">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-and-type">
              <div className="location-type">
                <div className="each-info">
                  <MdLocationOn className="job-logo" />
                  <p className="about">{location}</p>
                </div>
                <div className="each-info">
                  <BsBriefcaseFill className="job-logo" />
                  <p className="about">{employmentType}</p>
                </div>
              </div>
              <p className="package">{rolePackage}</p>
            </div>
            <hr className="sep-line" />
            <h1 className="r-heading">Description</h1>
            <p className="job-text">{jobDescription}</p>
          </li>
        </Link>
      )
    }

    const renderJobs = () => {
      const {jobsList} = this.state
      switch (jobsStatus) {
        case 'INITIAL':
          return <div className="other-cases-container">{this.loader()}</div>
        case 'SUCCESS':
          return (
            <>
              {jobsList.jobs.length === 0 ? (
                <div className="other-cases-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    className="no-jobs"
                    alt="no jobs"
                  />
                  <h1 className="fail-heading">No Jobs Found</h1>
                  <p>We could not find any jobs. Try other filters</p>
                </div>
              ) : (
                <ul className="jobs-success-container">
                  {jobsList.jobs.map(job => (
                    <JobItem key={job.id} jobDetails={job} />
                  ))}
                </ul>
              )}
            </>
          )

        default:
          return (
            <div className="other-cases-container">{this.failureView()}</div>
          )
      }
    }

    const filterApply = empFilter => {
      this.setState({eTypes: empFilter, jobsStatus: 'INITIAL'}, this.getJobs)
    }

    const CreateFilterOption = props => {
      const {empItem} = props
      const {employmentTypeId, label} = empItem

      const itemClicked = () => {
        const q = eTypes
        const w = eTypes.filter(e => e === employmentTypeId)
        if (w.length === 0) {
          q.push(employmentTypeId)
          filterApply(q)
          document.getElementById(employmentTypeId).checked = true
        } else {
          filterApply(q.filter(d => d !== employmentTypeId))
        }
      }

      return (
        <li className="filter-item">
          <input
            type="checkbox"
            className="filter-box"
            id={employmentTypeId}
            value={label}
            onChange={itemClicked}
          />
          <label htmlFor={employmentTypeId} className="filter-name">
            {label}
          </label>
        </li>
      )
    }

    const filterOnSal = salRange => {
      this.setState({salary: salRange, jobsStatus: 'INITIAL'}, this.getJobs)
    }

    const CreateFilterOption2 = props => {
      const {salRange} = props
      const {salaryRangeId, label} = salRange

      const onFilterSalary = () => {
        filterOnSal(salaryRangeId)
      }

      return (
        <li className="filter-item">
          <input
            type="radio"
            className="filter-box"
            id={salaryRangeId}
            name="salary"
            onClick={onFilterSalary}
          />
          <label htmlFor={salaryRangeId} className="filter-name">
            {label}
          </label>
        </li>
      )
    }

    return (
      <div className="jobs-container">
        <this.Header />
        <div className="job-contents-container">
          <div className="search-container">
            <input
              type="search"
              className="search-field"
              onChange={onChangeSearch}
              value={searchInput}
              placeholder="Search"
              onKeyDown={onEnter}
            />
            {/* eslint-disable-next-line */}
            <button
              type="button"
              className="search-button"
              data-testid="searchButton"
              onClick={onSearchIcon}
            >
              <IoSearch className="search-icon" />
            </button>
          </div>

          <div className="profile-and-filters-container">
            {renderProfile()}
            <hr className="sep-line" />
            <h1 className="filter">Type of Employment</h1>
            <ul className="filter-on-type">
              {employmentTypesList.map(empType => (
                <CreateFilterOption
                  empItem={empType}
                  key={empType.employmentTypeId}
                />
              ))}
            </ul>
            <hr className="sep-line" />
            <h1 className="filter">Salary Range</h1>
            <ul className="filter-on-type">
              {salaryRangesList.map(range => (
                <CreateFilterOption2
                  salRange={range}
                  key={range.salaryRangeId}
                />
              ))}
            </ul>
          </div>
          <div className="search-with-jobs">
            <div className="search-container2">
              <input
                type="search"
                className="search-field"
                onChange={onChangeSearch}
                value={searchInput}
                placeholder="Search"
                onKeyDown={onEnter}
              />
              {/* eslint-disable-next-line */}
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={onSearchIcon}
              >
                <IoSearch className="search-icon" />
              </button>
            </div>
            {renderJobs()}
          </div>
        </div>
      </div>
    )
  }

  JobItemDetails = props => {
    const {jobItemStatus} = this.state
    const {match} = props
    const {params} = match
    const {id} = params

    if (jobItemStatus === 'INITIAL') {
      this.getJobDetails(id)
    }

    const renderProductDetails = () => {
      const {jobItem} = this.state
      let aboutJob
      let similarJobs
      if (jobItemStatus === 'SUCCESS') {
        const job = {
          aboutJob: {
            id: jobItem.job_details.id,
            companyLogoUrl: jobItem.job_details.company_logo_url,
            companyWebUrl: jobItem.job_details.company_website_url,
            employmentType: jobItem.job_details.employment_type,
            jobDescription: jobItem.job_details.job_description,
            skills: jobItem.job_details.skills,
            lifeAtCompany: jobItem.job_details.life_at_company,
            location: jobItem.job_details.location,
            packagePerAnnum: jobItem.job_details.package_per_annum,
            rating: jobItem.job_details.rating,
            title: jobItem.job_details.title,
          },
          similarJobs: jobItem.similar_jobs,
        }
        aboutJob = job.aboutJob
        similarJobs = job.similarJobs
      }

      const SkillItem = ps => {
        const {skill} = ps
        const newObj = {
          imageUrl: skill.image_url,
          name: skill.name,
        }
        const {imageUrl, name} = newObj
        return (
          <li className="skill-item">
            <img src={imageUrl} alt={name} className="skill-img" />
            <p className="s-name">{name}</p>
          </li>
        )
      }

      const SimilarJob = i => {
        const {j} = i

        return (
          <li className="similar-job-item">
            <div className="company">
              <img
                src={j.company_logo_url}
                alt="similar job company logo"
                className="c-logo"
              />
              <div className="role">
                <h1 className="r-name">{j.title}</h1>
                <div className="job-star">
                  <FaStar className="job-logo" />
                  <p className="r-name">{j.rating}</p>
                </div>
              </div>
            </div>
            <h1 className="s-j-sub-heading">Description</h1>
            <p className="s-j-text">{j.job_description}</p>
            <div className="location-and-type">
              <div className="location-type">
                <div className="s-j-each-info">
                  <MdLocationOn className="job-logo" />
                  <p className="about">{j.location}</p>
                </div>
                <div className="s-j-each-info">
                  <BsBriefcaseFill className="job-logo" />
                  <p className="about">{j.employment_type}</p>
                </div>
              </div>
            </div>
          </li>
        )
      }

      switch (jobItemStatus) {
        case 'INITIAL':
          return <div className="job-item-loader">{this.loader()}</div>
        case 'SUCCESS':
          return (
            <div className="job-item-details-container">
              <div className="job-item-specific">
                <div className="company">
                  <img
                    src={aboutJob.companyLogoUrl}
                    alt="job details company logo"
                    className="c-logo"
                  />
                  <div className="role">
                    <h1 className="r-name">{aboutJob.title}</h1>
                    <div className="job-star">
                      <FaStar className="job-logo" />
                      <p className="r-name">{aboutJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-and-type">
                  <div className="location-type">
                    <div className="each-info">
                      <MdLocationOn className="job-logo" />
                      <p className="about">{aboutJob.location}</p>
                    </div>
                    <div className="each-info">
                      <BsBriefcaseFill className="job-logo" />
                      <p className="about">{aboutJob.employmentType}</p>
                    </div>
                  </div>
                  <p className="package">{aboutJob.packagePerAnnum}</p>
                </div>
                <hr className="sep-line" />
                <div className="company-profile">
                  <h1 className="r-heading">Description</h1>
                  <a href={aboutJob.companyWebUrl} className="visit-link">
                    Visit
                  </a>
                </div>
                <p className="job-text">{aboutJob.jobDescription}</p>
                <h1 className="r-heading">Skills</h1>
                <ul className="skills-container">
                  {aboutJob.skills.map(skill => (
                    <SkillItem skill={skill} key={skill.name} />
                  ))}
                </ul>
                <h1 className="r-heading">Life at Company</h1>
                <div className="company-info">
                  <p className="job-text">
                    {aboutJob.lifeAtCompany.description}
                  </p>
                  <img
                    src={aboutJob.lifeAtCompany.image_url}
                    className="company-img"
                    alt="life at company"
                  />
                </div>
              </div>
              <h1 className="s-j-heading">Similar Jobs</h1>
              <ul className="similar-jobs-container">
                {similarJobs.map(job => (
                  <SimilarJob j={job} key={job.id} />
                ))}
              </ul>
            </div>
          )

        default:
          return <div className="job-item-failure">{this.failureView()}</div>
      }
    }

    return (
      <div className="job-item-container">
        <this.Header />
        {renderProductDetails()}
      </div>
    )
  }

  NotFound = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1 className="fail-heading">Page Not Found</h1>
      <p className="fail-heading">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  )

  AuthenticateUser = props => {
    const s = Cookies.get('jwt_token')
    if (s === undefined) {
      return <Redirect to="/login" />
    }
    return <Route {...props} />
  }

  render() {
    return (
      <Switch>
        <Route exact path="/login" component={this.Login} />
        <this.AuthenticateUser exact path="/" component={this.Home} />
        <this.AuthenticateUser exact path="/jobs" component={this.Jobs} />
        <this.AuthenticateUser
          exact
          path="/jobs/:id"
          component={this.JobItemDetails}
        />
        <Route path="/not-found" component={this.NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}

export default withRouter(App)
