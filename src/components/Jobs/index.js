import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoSearch} from 'react-icons/io5'
import Header from '../Header'
import '../../App.css'

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

class Jobs extends Component {
  state = {
    searchInput: '',
    eTypes: [],
    salary: '',
    profileStatus: 'INITIAL',
    profileDetails: '',
    jobsList: '',
    jobsStatus: 'INITIAL',
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
    if (responseObj.ok === true) {
      const data = await responseObj.json()
      this.setState({jobsList: data.jobs, jobsStatus: 'SUCCESS'})
    } else {
      this.setState({jobsStatus: 'FAILURE'})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchIcon = () => {
    this.setState({jobsStatus: 'INITIAL'}, this.getJobs)
  }

  onRetryProfile = () => {
    this.setState({profileStatus: 'INITIAL'}, this.getProfile)
  }

  renderProfile = () => {
    const {profileStatus, profileDetails} = this.state
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
            <button className="find-jobs" onClick={this.onRetryProfile}>
              Retry
            </button>
          </div>
        )
    }
  }

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

  JobItem = s => {
    const {jobDetails} = s
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

  renderJobs = () => {
    const {jobsList, jobsStatus} = this.state
    switch (jobsStatus) {
      case 'INITIAL':
        return <div className="other-cases-container">{this.loader()}</div>
      case 'SUCCESS':
        return (
          <>
            {jobsList.length === 0 ? (
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
                {jobsList.map(job => (
                  <this.JobItem key={job.id} jobDetails={job} />
                ))}
              </ul>
            )}
          </>
        )

      default:
        return <div className="other-cases-container">{this.failureView()}</div>
    }
  }

  filterApply = empFilter => {
    this.setState({eTypes: empFilter, jobsStatus: 'INITIAL'}, this.getJobs)
  }

  CreateFilterOption = props => {
    const {eTypes} = this.state
    const {empItem} = props
    const {employmentTypeId, label} = empItem
    const isChecked = eTypes.includes(employmentTypeId)
    const itemClicked = () => {
      const q = eTypes
      const w = eTypes.filter(e => e === employmentTypeId)
      if (w.length === 0) {
        q.push(employmentTypeId)
        this.filterApply(q)
        document.getElementById(employmentTypeId).checked = true
      } else {
        this.filterApply(q.filter(d => d !== employmentTypeId))
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
          checked={isChecked}
        />
        <label htmlFor={employmentTypeId} className="filter-name">
          {label}
        </label>
      </li>
    )
  }

  filterOnSal = salRange => {
    this.setState({salary: salRange, jobsStatus: 'INITIAL'}, this.getJobs)
  }

  CreateFilterOption2 = props => {
    const {salary} = this.state
    const {salRange} = props
    const {salaryRangeId, label} = salRange

    const isOptionSelected = salary === salaryRangeId

    const onFilterSalary = () => {
      this.filterOnSal(salaryRangeId)
    }

    return (
      <li className="filter-item">
        <input
          type="radio"
          className="filter-box"
          id={salaryRangeId}
          name="salary"
          onChange={onFilterSalary}
          checked={isOptionSelected}
        />
        <label htmlFor={salaryRangeId} className="filter-name">
          {label}
        </label>
      </li>
    )
  }

  render() {
    const {profileStatus, jobsStatus, searchInput} = this.state

    if (profileStatus === 'INITIAL') {
      this.getProfile()
    }

    if (jobsStatus === 'INITIAL') {
      this.getJobs()
    }

    return (
      <div className="jobs-container">
        <Header />
        <div className="job-contents-container">
          <div className="search-container">
            <input
              type="search"
              className="search-field"
              onChange={this.onChangeSearch}
              value={searchInput}
              placeholder="Search"
            />
            {/* eslint-disable-next-line */}
            <button
              type="button"
              className="search-button"
              data-testid="searchButton"
              onClick={this.onSearchIcon}
            >
              <IoSearch className="search-icon" />
            </button>
          </div>

          <div className="profile-and-filters-container">
            {this.renderProfile()}
            <hr className="sep-line" />
            <h1 className="filter">Type of Employment</h1>
            <ul className="filter-on-type">
              {employmentTypesList.map(empType => (
                <this.CreateFilterOption
                  empItem={empType}
                  key={empType.employmentTypeId}
                />
              ))}
            </ul>
            <hr className="sep-line" />
            <h1 className="filter">Salary Range</h1>
            <ul className="filter-on-type">
              {salaryRangesList.map(range => (
                <this.CreateFilterOption2
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
                onChange={this.onChangeSearch}
                value={searchInput}
                placeholder="Search"
              />
              {/* eslint-disable-next-line */}
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.onSearchIcon}
              >
                <IoSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
