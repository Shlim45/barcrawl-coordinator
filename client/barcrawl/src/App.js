import React, { Component } from 'react';
import TwitterLogin from 'react-twitter-auth';

import './App.css';
import Search from './Search';

class App extends Component {
    constructor() {
        super();
        
        this.state = {
            isAuthenticated: false,
            user: null,
            token: '',
        };
    }
    
    onSuccess = (response) => {
      const token = response.headers.get('x-auth-token');
      response.json().then(user => {
        if (token) {
          this.setState({isAuthenticated: true, user: user, token: token});
        }
      });
    };
    
    onFailed = (error) => {
      alert(error);
    };
    
    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };
    
    render() {
      let headerContent = !!this.state.isAuthenticated ?
        (
          <div>
          <button onClick={this.logout} className="button" >
            Log out
          </button>
          </div>
        ) :
        (
          <TwitterLogin loginUrl="https://fcc-dynamic-shlim45.c9users.io:8081/api/v1/auth/twitter"
                        onFailure={this.onFailed} onSuccess={this.onSuccess}
                        requestTokenUrl="https://fcc-dynamic-shlim45.c9users.io:8081/api/v1/auth/twitter/reverse"
            />
        );
    
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Barcrawl Coordinator.</h1>
                    {headerContent}
                </header>
                
                <Search authenticated={this.state.isAuthenticated} user={this.state.user} />
                
            </div>
        );
    }
}

export default App;
