import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { updateToken } from "./store";

const url = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class Register extends Component {
    state = { email: '', password: '', register: false, error: false }

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

        axios.post(url + "/register", { email: this.state.email, password: this.state.password })
            .then((response) => {
                console.log(response.data); // får token

                updateToken(response.data.token);
                this.setState({ register: true });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: true })
            })
    }

    render() {
        if (this.state.register) {
            return <Redirect to="/"></Redirect>
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
                    <h1>Register</h1>
                    <Helmet>
                        <title>Register page</title>
                    </Helmet>
                </header>

                <form className='form-style'
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <h2>Add a new user</h2>
                    <label>Email <input
                        type="email"
                        name='email'
                        minLength={1}
                        maxLength={30}
                        placeholder=" Write a email.."
                        className="myInput"
                        onChange={this.changeEmailInput.bind(this)} />
                    </label>
                    <label>  Rassword <input
                        type="password"
                        name='password'
                        minLength={1}
                        maxLength={10}
                        placeholder=" Write a password.."
                        className="myInput"
                        onChange={this.changePasswordInput.bind(this)} />
                    </label>
                    <br></br>
                    <input type="submit"
                        className="page"
                        value="Save" />
                </form>
            </>
        );
    }
}

export default Register;