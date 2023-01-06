import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { registerReducer } from "./registerReducer";
import { resetReducer } from "./resetReducer";
import { loginReducer } from "./loginReducer";
import { activateReducer } from "./activateReducer";
import { settingsReducer } from "./settingsReducer";
import { forgotReducer } from "./forgotReducer";

export default combineReducers({
    user: userReducer,
    register: registerReducer,
    reset: resetReducer,
    login: loginReducer,
    activate: activateReducer,
    settings: settingsReducer,
    forgot: forgotReducer,
});
