import React, { Component } from 'react';
//modulen jsonwebtoken skapa en JWT-token
import jwt from "jsonwebtoken";
import { Helmet } from 'react-helmet';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { token$ } from './store';
import './Todos.css';

// hämta inlogat email-info
function getEmail(token) {
    // om vi inte har tillgång till 'hemliga-nyckeln' då funk/ decode(token) hämta ut infon
    const decoded = jwt.decode(token);
    return decoded.email;
}

const url = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class Todos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: token$.value, error: false,
            tasks: [{ content: 'test', id: 'thing' }], newTask: ''
        }

        this.getTodos = this.getTodos.bind(this);
    }


    getTodos() {
        // ladda inte onödig om snabbt startas ny sida efter
        this.source = axios.CancelToken.source();

        axios.get(url + '/todos', { headers: { Authorization: 'Bearer ' + this.state.token } })
            .then((response) => {
                console.log(response.data.todos); // ge data.todos
                this.setState({ tasks: response.data.todos });
            })
            .catch(error => {
                // fel meddelande
                if (axios.isCancel(error)) {
                    console.log("Request canceled", error.message);
                }
            });
    }

    componentDidMount() {
        this.subscription = token$.subscribe((token) => {
            this.setState({ token: this.state.token });

            console.log(token); // få ut token
        });

        this.getTodos();
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        
        this.source.cancel("Operation canceled by the user.");
    }

    change(e) {
        this.setState({ newTask: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { newTask, token } = this.state;

        let addNew = { content: newTask }

        axios.post(url + '/todos', addNew,
            { headers: { Authorization: 'Bearer ' + token } })
            .then((response) => {
                console.log(response.data.todo);
                this.setState({ tasks: [...this.state.tasks, response.data.todo] });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: true })
            })
        this.setState({ newTask: '' });
    }

    handleClickIndex(id) {

        axios.delete(url + '/todos/' + id,
            { headers: { Authorization: 'Bearer ' + this.state.token } })
            .then(() => {
                axios.get(url + '/todos',
                    { headers: { Authorization: 'Bearer ' + this.state.token } })
                    .then((response) => {
                        console.log(response.data.todos);
                        this.setState({ tasks: response.data.todos });
                    })
            });
    }

    render() {
        const { tasks, token, error } = this.state;

        if (!token) {
            return <Redirect to="/" />;
        } else if (error) {
            return (<div><p>Something is wrong..</p></div>)
        }

        return (
            <>
                <h1>My todo list </h1>
                <Helmet>
                    <title>Todos page</title>
                </Helmet>

                <form className='form-style'
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <h2>Add your todo <br />
                        <span className='email'>
                            {getEmail(this.state.token)}</span>
                    </h2>
                    <label>Item <input
                        type="text"
                        minLength={1}
                        maxLength={30}
                        placeholder=" Write a todo.."
                        className="myInput"
                        value={this.state.newTask}
                        onChange={this.change.bind(this)} />
                    </label>
                    <br></br>
                    <input type="submit"
                        className="page"
                        value="Add" />
                </form>
                <div>
                    <ul>
                        {tasks.map((task) => (
                            <li className='tasks' key={task.id}>
                                {task.content}
                                <button className="removeTask"
                                    onClick={this.handleClickIndex.bind(this, task.id)}>x</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }
}
export default Todos;