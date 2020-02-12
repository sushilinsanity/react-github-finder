import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

import './App.css';

import axios from 'axios';

const App = () => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [repos, setRepos] = useState([]);

  const searchUsers = async text => {
    setLoading(true);
    const response = await axios.get(`https://api.github.com/search/users?q=${text}&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUsers(response.data.items);
    setLoading(false);
  }


  const getUser = async username => {
    setLoading(true);
    const response = await axios.get(`https://api.github.com/users/${username}?
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUser(response.data);
    setLoading(false);
  }

  const getUserRepos = async username => {
    setLoading(true);
    const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setRepos(response.data);
    setLoading(false);
  }

  const clearUser = () => {
    setUsers([]);
    setLoading(false);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 5000);
  }

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='container'>
          <Alert alert={alert} />
          <Switch>
            <Route exact path='/' render={props => (
              <Fragment>
                <Search searchUsers={searchUsers} clearUser={clearUser} showClear={users.length ? true : false} setAlert={showAlert} />
                <Users loading={loading} users={users} />
              </Fragment>
            )} />
            <Route exact path='/user/:login' render={props => (
              <User {...props} getUser={getUser} getUserRepos={getUserRepos} user={user} repos={repos} loading={loading} />
            )} />
            <Route exact path='/about' component={About} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;
