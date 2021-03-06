import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Login from './components/Login';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: Login }} />
    <Route path='/counter' components={{ body: Counter }} />
    <Route path='/fetchdata' components={{ body: FetchData }}>
        <Route path='(:startDateIndex)' /> { /* Optional route segment that does not affect NavMenu highlighting */ }
    </Route>
</Route>;

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
