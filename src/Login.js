import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from "react-router-dom";
import { updateToken } from './store';
import axios from 'axios';
import './Login.css'

const url = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class Login extends Component {

    state = { email: '', password: '', login: false, error: false }

    changeEmailInput(e) {
        this.setState({ email: e.target.value });
    }

    changePasswordInput(e) {
        //console.log(e.target.value);
        this.setState({ password: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.props);

        axios.post(url + "/auth", { email: this.state.email, password: this.state.password })
            .then((response) => {
                console.log(response.data); // får token

                updateToken(response.data.token);
                this.setState({ login: true });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: true })
            })
    }

    render() {
        if (this.state.login) {
            return <Redirect to="/todos" />;
        } else if (this.state.error) {
            return (
                <div>
                    <p>Something went wrong...</p>
                </div>
            )
        }
        return (
            <>
                <header>
                    <h1>login </h1>
                    <Helmet>
                        <title>login page</title>
                    </Helmet>
                </header>

                <form className='form-style'
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <h2>Sign in</h2>
                    <label>Email <input
                        type="email"
                        minLength={1}
                        maxLength={30}
                        placeholder=" Write a email.."
                        className="myInput"
                        onChange={this.changeEmailInput.bind(this)} />
                    </label>
                    <label>  Rassword <input
                        type="password"
                        minLength={1}
                        maxLength={10}
                        placeholder=" Write a password.."
                        className="myInput"
                        onChange={this.changePasswordInput.bind(this)} />
                    </label>
                    <br></br>
                    <input type="submit"
                        className="page"
                        value="Login" />
                </form>
            </>
        );
    }
}

export default Login;