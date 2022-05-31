import { combineReducers } from 'redux';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import newOrderReducer from './newOrderReducer';
import registerReducer from './registerReducer';
import resetReducer from './resetReducer';
import loginReducer from './loginReducer';
import landingReducer from './landingReducer';
import activateReducer from './activateReducer';
import settingsReducer from './settingsReducer';
import stripeReducer from './stripeReducer';
import plansReducer from './plansReducer';

export default combineReducers({
    auth: authReducer,
    users: usersReducer,
    newOrder: newOrderReducer,
    register: registerReducer,
    reset: resetReducer,
    settings: settingsReducer,
    login: loginReducer,
    landing: landingReducer,
    stripe: stripeReducer,
    activate: activateReducer,
    plans: plansReducer
});