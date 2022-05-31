import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './components/Router';
import { Provider } from 'react-redux';
import store from './store';
import short from 'shortid';
import './styles/all-styles.scss';
short.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Root = () => (
    <Provider store={store}>
        <RouterComponent />
    </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'));