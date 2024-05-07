import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import AuthenticatedUser from './components/AuthenticatedUser'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <AuthenticatedUser exact path="/" component={Home} />
    <AuthenticatedUser exact path="/jobs" component={Jobs} />
    <AuthenticatedUser exact path="/jobs/:id" component={JobItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
