import * as React from 'react';
import { Link } from 'react-router';
import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';
import * as LoginStore from '../store/Login'

class Login extends React.Component<any, any> {

     constructor(props: LoginProps){
        debugger;
        super(props);
        this.state = { userName: this.props.userName, password : this.props.password };
    }

    /*
    propTypes: {
        options: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    }*/


    onUsernameChange(event: any) {
        this.setState({userName: event.target.value.trim()})
    }
    onPasswordChange(event: any) {
        this.setState({password: event.target.value.trim()})
    }

    onSubmit(e) {
        e.preventDefault();
                    debugger;
        if (this.props.requestLogin) {
            this.props.requestLogin(this.state.userName, this.state.password);
        };
    }
    public render() {
        let options = {
            email: {
                label: 'Email Address',
                placeholder: 'Email'
            },
            password: {
                label: 'Password',
                placeholder: 'Password'
            },
            submitButton: {
                text: 'Submit'
            }
        };
      //  options = Object.assign(options, this.props.options || {});
        return <div>
        <h1>Login Forms Rock</h1>
            <form>
                <div className='form-group'>
                    <label>{options.email.label}</label>
                    <input type="email" ref="userName" onChange={(event) => this.onUsernameChange(event)} className='form-control' placeholder={options.email.placeholder} />
                </div>
                <div className='form-group'>
                    <label>{options.password.label}</label>
                    <input type='password' ref="password" onChange={(event) => this.onPasswordChange(event)}  className='form-control' placeholder={options.password.placeholder} />
                </div>
                <button type='submit' onClick={(event) => this.onSubmit(event)} className='btn btn-default'>{options.submitButton.text}</button>
            </form>
        </div>
    }
}

// Build the LoginPropd type, which allows the component to be strongly typed
const provider = provide(
    (state: ApplicationState) => state.login, // Select which part of global state maps to this component
    LoginStore.actionCreators                 // Select which action creators should be exposed to this component
);         
type LoginProps = typeof provider.allProps;
export default provider.connect(Login);