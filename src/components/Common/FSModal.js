import React, {Component, Fragment} from 'react';
import {StyleSheet} from 'react-native'
import Modal from "react-native-modal";
import PropTypes from 'prop-types';

export class FSModal extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        body: PropTypes.element.isRequired
    };

    state = {
        modalVisible: false
    };
    closeModal = () => {
        this.setState({modalVisible: false})
    };
    openModal = () => {
        this.setState({modalVisible: true})
    };

    render() {
        let {children, body, ...other} = this.props;
        //body.props = Object.assign(body.props, ...other);
        return (
            <Fragment>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    style={styles.modal}
                    onRequestClose={() => {
                        this.closeModal()
                    }}>
                    {body}
                </Modal>
                {children}
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0)',
        margin: '5%',
    },
});

export class FSModalContentBase extends Component {
    static propTypes = {
        requestModalClose: PropTypes.func.isRequired,
    };

    closeParent = this.props.requestModalClose;
}