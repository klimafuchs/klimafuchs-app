import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import {ReactNativeFile} from 'apollo-upload-client';
import React from 'react';
import {ImageBackground, TouchableWithoutFeedback, View} from 'react-native';
import {Button, Icon, Spinner, Text} from 'native-base';
import {ImagePicker, Permissions} from 'expo';
import PropTypes from 'prop-types'

class UploadImage extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func,
        onUploadFinished: PropTypes.func,
        placeholder: PropTypes.string,
    };

    state = {
        image: null,
        width: null,
        height: null,
        media: null,
        uploading: false,
        uploadFinished: false,
        permissionsGranted: false,
    };


    async componentDidMount() {
        const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (permission.status !== 'granted') {
            const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            this.setState({permissionsGranted: newPermission.status !== 'granted'});
        } else {
            this.setState({permissionsGranted: true});
        }
    }

    pickImage = async (upload, destroy) => { //TODO ENHANCEMENT replace with https://github.com/ivpusic/react-native-image-crop-picker? (requires ejecting)
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: false,
        });

        if (!result.cancelled) {
            const [name, ext] = result.uri.split('\\').pop().split('/').pop().split('.');
            let image = new ReactNativeFile({
                uri: result.uri,
                type: `image/${ext}`,
                name: `${name}.${ext}`,
            });
            this.setState({image: image, width: result.width, height: result.height});
            if (this.props.onSelected) {
                this.props.onSelected(this.state.image);
            }

            if (destroy) {
                console.log(`[INFO] ${this.constructor.name}: Deleting ${(this.state.media)}`);
                destroy({
                    variables: {
                        mediaId: this.state.media.id
                    }
                })
            }

            this.setState({uploading: true});
            console.log(`[INFO] ${this.constructor.name}: File ${JSON.stringify(this.state.image, null, 2)}, width: ${this.state.width}, heigth: ${this.state.height} uploading`);

            upload({
                variables: {
                    file: this.state.image,
                    height: this.state.height,
                    width: this.state.width
                },
            })
                .then(media => {
                    this.setState({uploading: false});
                    console.log(`[INFO] ${this.constructor.name}: File ${JSON.stringify(media, null, 2)} uploaded`);

                    this.setState({media: media.data.upload});
                    if (this.props.onUploadFinished) {
                        this.props.onUploadFinished(media.data.upload);
                    } else {
                        console.log(`[WARN] ${this.constructor.name}: No onUpladFinished callback set in properties`);
                    }
                })
                .catch(err => {
                    this.setState({uploading: false});
                    console.error(err)
                });
        }
    };

    reset = () => {
        this.setState({image: null, media: null});
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    render() {
        let image = this.state.image;
        let {placeholder} = this.props;
        let imgSrc = this.image ?
            {uri: this.image.uri} :
            (placeholder ?
                {uri: placeholder} :
                require('../../../assets/image_select.png'));
        return (
            <Mutation mutation={UPLOAD_IMAGE}>
                {(upload, {data}) => {
                    const a = this.state.media ?
                        <Mutation mutation={DELETE_IMAGE}>
                            {(destroy, {loading, error}) => {
                                if (error) return (<Text>{JSON.stringify(error)}</Text>)
                                return (<View
                                    style={{flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <ImageBackground
                                        style={{flex: 1, height: '100%', alignSelf: 'stretch'}}
                                        resizeMode="cover"
                                        source={imgSrc}>
                                        <Button style={{position: 'absolute', bottom: 0, right: 0}} info transparent
                                                onPress={() => this.pickImage(upload, destroy)}>
                                            <Icon name={'md-attach'}/>
                                        </Button>
                                    </ImageBackground>
                                </View>)
                            }
                            }
                        </Mutation>
                        : <TouchableWithoutFeedback
                            style={{
                                flex: 1,
                                height: '100%',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => this.pickImage(upload)}>
                            <ImageBackground
                                style={{height: '100%', width: '100%', backgroundColor: '#ffff00'}}
                                resizeMode="cover"
                                source={imgSrc}>
                                {this.state.uploading ? <Spinner/> :
                                    <Button style={{position: 'absolute', bottom: 0, right: 0}} info transparent
                                            onPress={() => this.pickImage(upload, null)}>
                                        <Icon name={'md-attach'}/>
                                    </Button>}
                            </ImageBackground>
                        </TouchableWithoutFeedback>;
                    return (a)
                }}
            </Mutation>
        )
    }

}

const UPLOAD_IMAGE = gql`
    mutation upload($file: Upload!, $height: Int!, $width: Int!) {
        upload(file: $file, height: $height, width: $width) {
            id
            filename
            mimetype
            path
            uploadedAt,
            width,
            height
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation destroy($mediaId: Int!) {
        delete(mediaId: $mediaId) {
            id
            filename
            mimetype
            path
            uploadedAt,
            width,
            height
        }
    }
`;

export default UploadImage