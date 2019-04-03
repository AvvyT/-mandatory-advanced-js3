import React, { Component } from 'react';
//modulen jsonwebtoken skapa en JWT-token
import jwt from "jsonwebtoken";
import { Helmet } from 'react-helmet';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { token$ } from './store';
import './Todos.css';

function getEmail(token) {
    // om vi inte har tillgång till 'hemliga-nyckeln' då funk. decode(token) hämta ut infon
    const decoded = jwt.decode(token);
    return decoded.email;
}

const url = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class Todos extends Component {
    state = {
        token: token$.value, email: '',
        tasks: ['simple', 'thing'], newTask: ''
    }

    change(e) {
        this.setState({ newTask: e.target.value });
    }

    componentDidMount() {
        this.subscription = token$.subscribe((token) => {
            this.setState({ token: this.state.token });

            console.log(token); // få ut token

        });

        axios.get(url + '/todos', { headers: { Authorization: 'Bearer ' + this.state.token } })
            .then((response) => {
                console.log(response.data);
                this.setState({ tasks: response.data.todo });
            })
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }


    handleSubmit(e) {
        e.preventDefault();

        axios.post(url + '/todos', { content: this.state.newTask },
            { headers: { Authorization: 'Bearer ' + this.state.token } })
            .then((response) => {
                console.log(response.data);
                this.setState({ tasks: response.data.todo });
            })
    }

    handleClickIndex(id) {

        axios.delete(url + '/todos/' + id,
            { headers: { Authorization: 'Bearer ' + this.state.token } })
            .then(() => {
                axios.get(url + '/todos', { headers: { Authorization: 'Bearer ' + this.state.token } })
                    .then((response) => {
                        console.log(response);
                        this.setState({ tasks: response.data.tasks });
                    })
            });
    }

    render() {
        if (!this.state.token) {
            return <Redirect to="/" />;
        }
        const tasks = (this.state.tasks).map((task, index) => (
            <li key={index}>
                {task} <button name="removeTask"
                    onClick={this.handleClickIndex.bind(this, task.id)}>x</button>
            </li>
        ))

        return (
            <>
                <h3 className='email'>{getEmail(this.state.token)}</h3>
                    <h1>My todo list </h1>
                    <Helmet>
                        <title>Todos page</title>
                    </Helmet>
               
                <form className='form-style'
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <h2>Add your todo</h2>
                    <label>Item <input
                        type="text"
                        minLength={1}
                        maxLength={30}
                        placeholder=" Write a todo.."
                        className="myInput"
                        value={this.state.value}
                        onChange={this.change.bind(this)} />
                    </label>
                    <br></br>
                    <input type="submit"
                        className="page"
                        value="Add" />
                </form>
                <div>
                    <ul>
                        {tasks}
                        {
                            this.state.task &&
                            <li>{this.state.newTask}</li>
                        }
                    </ul>
                </div>
            </>
        );
    }
}
export default Todos;