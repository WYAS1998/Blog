import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'


export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/main" component={Main} />
      </Switch>
    </BrowserRouter>
  )
}