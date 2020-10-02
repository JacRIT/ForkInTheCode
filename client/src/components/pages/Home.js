import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../../redux/Actions'

class Home extends Component {
    constructor(props) {
        super(props);
        if (props.user === undefined || Object.keys(props.user).length === 0) {
            props.history.push('/Login')
        }
    }

    componentDidMount() {
        if (this.props.user === undefined || Object.keys(this.props.user).length === 0) {
            this.props.history.push('/Login')
        }
        this.props.changeCurrentPage("Home")
    }

    render() {
        return (
            <div className="home">
                Home - TODO
            </div>
        );
    }
}
export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(Home);
