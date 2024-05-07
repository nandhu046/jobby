import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import '../../App.css'

class JobItemDetails extends Component {
  state = {
    jobItemStatus: 'INITIAL',
    jobItem: '',
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

  renderProductDetails = () => {
    const {jobItem, jobItemStatus} = this.state
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
                <p className="job-text">{aboutJob.lifeAtCompany.description}</p>
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

  render() {
    const {jobItemStatus} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    if (jobItemStatus === 'INITIAL') {
      this.getJobDetails(id)
    }
    return (
      <div className="job-item-container">
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default JobItemDetails
