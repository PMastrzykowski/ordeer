import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterComponent from "./components/Router";
import { Provider } from "react-redux";
import store from "./store";
import short from "shortid";
import "./styles/all-styles.scss";
short.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/*"
                    element={<RouterComponent store={store.getState()} />}
                />
            </Routes>
        </BrowserRouter>
    </Provider>
);
