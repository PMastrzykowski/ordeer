//http://localhost:3000/qr/hXXS4ByEp1zX3L9vb4sQjB
import React from 'react';
import { withRouter } from "react-router";
import short from 'shortid';

class PreNewOrder extends React.Component {
    componentDidMount = () => {
        let pointId = this.props.location.pathname.split('/')[2];
        this.props.history.push(`/neworder/${pointId}/${short.generate()}`)
    }
    render = () => <></>
}

export default withRouter(PreNewOrder);