import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {actions} from '../../persistence/actions/Actions';
import Spinner from "native-base";

class CachingImage extends Component {
    static propTypes = {
        localUri: PropTypes.string,
        source: PropTypes.shape({
            uri: PropTypes.string.isRequired,
            filename: PropTypes.string.isRequired
        }).isRequired,
        imageCacheAction: PropTypes.shape({
            fetch: PropTypes.func.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        localUri: null,
    };

    componentDidMount() {
        this.props.imageCacheAction.fetch(this.props.source);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.localUri !== nextProps.localUri;
    }

    render() {
        const image = this.props.localUri ? <Image {...this.props} source={this.props.localUri}/> : <Spinner/>;
        return (image)
    }
}

export default connect(
    (state, props) => {
        const {loading, loaded} = state.imageCache;
        return {
            loading: loading.includes(props.source.uri),
            localUri: loaded[props.source.uri]
        };
    },
    (dispatch) => ({
        imageCacheAction: bindActionCreators(actions, dispatch)
    }),
)(CachingImage);
