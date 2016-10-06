import { fetch, addTask } from 'domain-task';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LoginState {
    isLoading: boolean;
    isAuthenticated: boolean;
    userName : string;
    password : string;
    jwt: Object;
    errorMessage : string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

@typeName("REQUEST_LOGIN")
class RequestLogin extends Action {
    constructor(public userName: string, public password: string) {
        super();
    }
}

@typeName("LOGIN_SUCCESS")
class ReceiveLogin extends Action {
    constructor(public userName: string, public password: string, public jwt: Object) {
        super();
    }
}

@typeName("LOGIN_FAILURE")
class LoginError extends Action {
    constructor(public message: string) {
        super();
    }
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestLogin: (userName:string, password:string): ActionCreator => (dispatch, getState) => {
       //var userName = getState().login.userName;
       //var password = getState().login.password;
        let postTask = new Request(
                '/token', 
                {
                    method: 'POST', 
                    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
                    body: `username=${userName}&password=${password}`
                }
            );
        
        const headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
         let config = {
            method: 'POST',
            headers:headers,
            body: `username=${userName}&password=${password}`
        };    
        let fetchTask = fetch('/token',config)
            .then(response => response.json().then(user => ({user,response})))
            .then(({user,response}) => {
                if(!response.ok){
                    dispatch(new LoginError(user.message));
                    return Promise.reject(user);
                }else{
                    dispatch(new ReceiveLogin(userName, password, user));
                }
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch(new RequestLogin());
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: LoginState = { isAuthenticated: false, isLoading: false, userName: "", password: "", jwt:{}, errorMessage:"" };
export const reducer: Reducer<LoginState> = (state, action) => {
    if (isActionType(action, RequestLogin)) {
            return {isLoading: true, isAuthenticated: false, userName: action.userName, password: action.password, jwt: {}, errorMessage: "" }
    }
    if (isActionType(action, ReceiveLogin)) {
        return {isLoading: false, isAuthenticated: true, userName: action.userName, password: action.password, jwt: action.jwt, errorMessage: "" }
    }
    if (isActionType(action, LoginError)) {
        return {isLoading: false, isAuthenticated: false, userName:"", password:"", jwt:{}, errorMessage: action.message  }
    }
    return state || unloadedState;
};
