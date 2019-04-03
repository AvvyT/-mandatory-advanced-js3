import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import Login from './Login';
import Register from './Register';
import Todos from './Todos';
import { token$ } from "./store";

class App extends Component {
  state = { token: token$.value };

  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { token } = this.state;

    return (
      <Router>
        <div className="App">
          <header>
            <h1> User-authentication application </h1>

            <div className='header-pages'>
              {!token ? <Link to="/"><button className='page'>Login</button></Link> :
                <button className="page" onClick={this.subscription}>Sign out</button>}

              {token ? <Link to="/todos"><button className='page'>Todos</button></Link> : null}
              <Link to="/register/"><button className='page'>Register</button></Link>
            </div>

          </header>
          <Route path="/" exact component={Login} />
          <Route path="/register/" component={Register} />
          <Route path="/todos" component={Todos} />
        </div>
      </Router>
    );
  }
}

export default App;
