import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {ReactNativeFile} from 'apollo-upload-client';
import React from 'react';
import {Dimensions, Image, ImageBackground, View} from 'react-native';
import {Button, Icon, Text} from 'native-base';
import {ImagePicker, Permissions} from 'expo';

class UploadImage extends React.Component {
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

    uploadImage = async () => {
        if (!this.state.image) {
            console.error('cannot upload undefined image');
            return;
        }
        if (!this.state.media) {
            console.error('image already uploaded');
            return;
        }
        this.setState({uploading: true});
        console.log(`[INFO] ${this.constructor.name}: File ${JSON.stringify(this.state.image, null, 2)}, width: ${this.state.width}, heigth: ${this.state.height} uploading`);

        this.props.mutate({
            variables: {
                file: this.state.image,
                height: this.state.height,
                width: this.state.width
            },
        })
            .then(media => {
                this.setState({uploading: false});
                console.log(`[INFO] ${this.constructor.name}: File ${JSON.stringify(media, null, 2)} uploaded`);

                this.setState({media});
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

    pickImage = async () => { //TODO ENHANCEMENT replace with https://github.com/ivpusic/react-native-image-crop-picker? (requires ejecting)
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
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
        let uploadButton;
        if (this.state.media) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ImageBackground
                        style={{flex: 1, height: 300, backgroundColor: "#0ff", alignSelf: 'stretch'}}
                        resizeMode="cover"
                        source={{uri: image.uri}}>
                        <Icon name="md-checkmark" style={{color: '#ffff00', backgroundColor: '#ff00ff'}}/>
                    </ImageBackground>
                </View>
            )
        }
        if (image) {
            const imageAspectRatio = this.state.height / this.state.width;
            console.log(imageAspectRatio, this.state.height, this.state.width);
            const width = (Dimensions.get('window').width);

            return (
                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', height: 300}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Button warning onPress={this.reset}>
                            <Text>Abbrechen</Text>
                        </Button>
                        <Button info disabled={!this.state.permissionsGranted} onPress={this.pickImage}>
                            <Text>Wähle ein anderes Bild</Text>
                        </Button>
                    </View>
                    <Image
                        style={{
                            width: '100%',
                            height: width * imageAspectRatio,
                            backgroundColor: "#0ff",
                        }}
                        resizeMode="contain"
                        source={{uri: image.uri}}
                    />

                    <Button primary block onPress={this.uploadImage}>
                        <Text>Bild hochladen</Text>
                    </Button>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Button primary onPress={this.pickImage}>
                        <Text>Wähle ein Bild</Text>
                    </Button>
                </View>
            )
        }
    }
}

export default graphql(gql`
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
`)(UploadImage)