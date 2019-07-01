import * as React from 'react';
import {Button, Image, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {Text as NBText, Icon, Body, Container, Content, Spinner} from "native-base";
import Draggable from "react-native-draggable";
import * as PropTypes from "prop-types";
import {BlurView} from "expo";
import {MaterialDialog} from "react-native-material-dialog";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";
import material from "../../../native-base-theme/variables/material";
import {Query} from "react-apollo";
import {LOAD_FEED} from "../../network/Feed.gql";
import {Fragment} from "react";
import {CURRENT_CHALLENGES} from "../../network/Challenges.gql";

const leafTransforms = require("./leafTransforms");

export class SeasonProgressComponent extends React.Component {

    static navigationOptions = {
        title: 'Fortschritt',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='leaf' y style={{fontSize: 20, color: tintColor}}/>
        ),
    };


    state = {
        showHint: false,
        leafCount: [0, 0, 0],
        seasonType: 'SPRING',
        seasonMonth: 0,
        leafs: [[], [], []]
    };

    // TODO replace with something more expandable, fine for the first season
    getBackgroundImage = (seasonType) => {
        switch (seasonType) {
            case 'SPRING':
                return () => {
                    return require('../../../assets/vector/Backgrounds_Season/background1.png') //@note this construction returning a function is not ideal, but prevents a 'invalid call to require()' error (in expo versions <= 32)
                };
            case 'SUMMER':
                return () => {
                    return require('../../../assets/vector/Backgrounds_Season/background2.png')
                };
            case 'FALL':
                return () => {
                    return require('../../../assets/vector/Backgrounds_Season/background3.png')
                };
            case 'WINTER':
                return () => {
                    return require('../../../assets/vector/Backgrounds_Season/background4.png')
                };
            default:
                console.error(`SeasonType ${seasonType} not defined`)
                return () => {
                    return require('../../../assets/vector/Backgrounds_Season/background1.png')
                };

        }
    };

    getTreeImage = (seasonMonth) => {
        switch (seasonMonth) {
            case 0:
                return () => {
                    return require('../../../assets/vector/Baum_Season/baum_monat1.png')
                };
            case 1:
                return () => {
                    return require('../../../assets/vector/Baum_Season/baum_monat2.png')
                };
            case 2:
                return () => {
                    return require('../../../assets/vector/Baum_Season/baum_monat3.png')
                };
            default:
                console.error(`seasonMonth ${seasonMonth} not defined`)
                return () => {
                    return require('../../../assets/vector/Baum_Season/baum_monat1.png')
                };
        }
    };

    constructor(props) {
        super(props);
    }

    drawTree = (loc, rot, scale) => {
        const x = loc.x;
        const y = loc.y;

        return (
            <View style={{
                top: '15%',
                left: x,
                height: '80%',
                width: '100%',
                position: 'absolute',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'

            }}>

                <Image
                    style={[
                        {
                            transform: [{rotateZ: rot + 'rad'}],
                            flex: 1,
                            height: '100%',
                            width: '100%',
                        }
                    ]}
                    source={this.getTreeImage(this.state.seasonMonth)()}
                    resizeMode="contain"
                >
                </Image>
            </View>
        );
    };

    leafRefs = [];


    onPressAddLeaf = () => {
        if (this.state.leafCount[this.state.seasonMonth] < 12) {
            let newLeafCount = this.state.leafCount;
            let currentLeafs = this.state.leafCount[this.state.seasonMonth] + 1
            newLeafCount[this.state.seasonMonth] = currentLeafs;
            console.log(newLeafCount)
            this.state.leafs[this.state.seasonMonth].push(<Leaf key={newLeafCount}
                                                                id={newLeafCount}
                                                                month={this.state.seasonMonth}
                                                                ref={(ref) => {
                                                                    this.leafRefs = ref
                                                                }}/>);

            this.setState({leafCount: newLeafCount})
        }
    };

    onPressSubLeaf = () => {
        if (this.state.leafCount > 0) {
            this.setState({leafCount: this.state.leafCount - 1});
        }
    };

    onPressAddMonth = () => {
        if (this.state.seasonMonth < 2) {
            this.setState({seasonMonth: this.state.seasonMonth + 1});
        }
    };

    onPressSubMonth = () => {
        if (this.state.seasonMonth > 0) {
            this.setState({seasonMonth: this.state.seasonMonth - 1});
        }
    };

    render() {
        const tree = this.drawTree(
            {
                x: 0,
                y: 0,
            },
            0,
        );

        let {leafs, seasonMonth, seasonType} = this.state;
        console.log(this.leafRefs);

        return (
            <Container style={styles.container}   refreshControl={<RefreshControl
                refreshing={false}
                onRefresh={() => refetch()}
            />}>
                <Image
                    style={{
                        top: -0,
                        left: 0,
                        width: '100%',
                        height: "145%",
                        position: 'absolute'
                    }}
                    source={this.getBackgroundImage(seasonType)()}
                    imageStyle={{overflow: 'hidden'}}
                    resizeMode="cover"

                >

                </Image>
                {tree}

                <Query query={CURRENT_CHALLENGES}
                       variables={{page: {first: this.pageSize, after: ""}}}
                       fetchPolicy="cache-and-network"
                >
                    {({loading, error, data, refetch, fetchMore}) => {
                        if (loading) return (
                            <Container>
                                <Spinner/>
                            </Container>
                        );
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.currentChallenges) {
                            const challenges = data.currentChallenges;
                            const completions = challenges.map((challenge, index) => {
                                if (challenge.challengeCompletion)
                                    return index
                            }).filter((elem) => elem !== undefined);
                            console.log(challenges, completions);


                            const leafsForCompletions = <View style={styles.spriteCanvas}>
                                {completions.map((completion) => {
                                    return (
                                        <Leaf style={ {position:"absolute", top: 0, left:0}}
                                            id={completion}
                                            key={completion}
                                            month={0}
                                            transform={leafTransforms["0"].leafs[completion]}
                                            assetNum={completions.length + 1}
                                        />)
                                })}</View>



                            return (
                                <Fragment>
                                    {leafsForCompletions}
                                    <BlurView tint="light" intensity={95}
                                              style={{
                                                  bottom: 0,
                                                  width: '100%',
                                                  height: 32,
                                                  position: 'absolute',
                                                  flex: 1,
                                                  flexDirection: 'row',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  paddingLeft: 50
                                              }}>
                                        <NBText>Season 1</NBText>
                                        <NBText>Woche 1</NBText>
                                        <NBText>{(4 / 48 * 100).toFixed(0)}%</NBText>
                                        <View>
                                            <TouchableOpacity style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'darkgray',
                                                height: 24,
                                                width: 24,
                                                borderRadius: 24 / 2,
                                                marginTop: 2,
                                                marginBottom: 2,

                                            }} onPress={() => {
                                                this.setState({showHint: true})
                                            }}
                                            >
                                                <Icon style={{color: '#404040'}} name='md-information-circle'/>
                                                <MaterialDialog
                                                    title={L.get('hint_seasonprogress_title')}
                                                    visible={this.state.showHint}
                                                    cancelLabel=''
                                                    onCancel={() => {
                                                        this.setState({showHint: false})
                                                    }}
                                                    okLabel={L.get('okay')}
                                                    onOk={() => {
                                                        this.setState({showHint: false})
                                                    }}
                                                    colorAccent={material.textLight}
                                                >

                                                    <Text>
                                                        {L.get("hint_seasonprogress")}
                                                    </Text>
                                                </MaterialDialog>
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                                </Fragment>
                            )
                        }
                    }
                    }
                </Query>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        width: '100%',
        height: '100%',
        position: 'absolute',

    },
    spriteCanvas: {
        width:'100%',
        height:'100%',
        position: 'absolute',
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    button: {
        width: '30%',
        height: 40,
    },
    sprite: {
        position: 'absolute',
    },
});

class Leaf extends React.Component {

    render() {
        let {id, month, transform, assetNum} = this.props;
        if(!assetNum) assetNum = 4;
        let assetUri;
        switch (assetNum) {
            case 1:
                assetUri = () => { return  require("../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt1.png")};
                break;
            case 2:
                assetUri = () => { return  require("../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt2.png")};
                break;
            case 3:
                assetUri = () => { return  require("../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt3.png")};
                break;
            default:
                assetUri = () => { return  require("../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt4.png")};
                break;
        }
        if (!transform) transform = {loc: {x: 100, y: 100}, rot: 0, scale: {w: 20, h: 20}};
        let {loc, rot, scale} = transform;
        console.log(JSON.stringify({id: id, month: month, t: {loc, rot, scale}}));

        const {w, h} = scale;
        const x = loc.x - w / 2;
        const y = loc.y - h / 2;
        if (false) return (
            <Draggable
                renderShape='image'
                imageSource={require('../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt1.png')}
                renderSize={48}
                reverse={false}
                x={x}
                y={y}
                pressDragRelease={(e, gestureState) => console.log(gestureState)}
            />
        );
        return (
            <View style={{transform: [{translateX: x}, {translateY: y}, {rotate: rot + 'deg'}],
                position: 'absolute',}}>
                <Image
                    style={{
                            top: 0,
                            left: 0,
                            height: w,
                            width: h,

                        }}
                    source={assetUri()}
                    resizeMode="contain"
                />
            </View>
        );

    }
}