import * as React from 'react';
import {Button, Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {Icon} from "native-base";
import Draggable from "react-native-draggable";
import * as PropTypes from "prop-types";

const leafTransforms = require("./leafTransforms");

export class SeasonProgressComponent extends React.Component {

    static navigationOptions = {
        title: 'Fortschritt',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='leaf' y style={{fontSize: 20, color: tintColor}}/>
        ),
    };


    state = {
        leafCount: [0,0,0],
        seasonType: 'SPRING',
        seasonMonth: 0,
        leafs: [[],[],[]]
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
            newLeafCount[this.state.seasonMonth] =  currentLeafs;
            console.log(newLeafCount)
            this.state.leafs[this.state.seasonMonth].push(<Leaf key={newLeafCount}
                                                                id={newLeafCount}
                                                                month={this.state.seasonMonth}
                                                                ref={(ref) => {this.leafRefs = ref}}/>);

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
            <View style={styles.container}>

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
                {tree}{leafs[seasonMonth]}

                {__DEV__ && <View opacity={0.5} style={{top: 100, left: 350, height: "100%", width: 75}}>
                    <Text>BG: {seasonType}</Text>
                    <Button
                        small
                        style={styles.buttons}
                        onPress={() => {
                            this.setState({seasonType: 'SPRING'})
                        }}
                        title="Spr"
                        color="#77ff77"
                    />
                    <Button
                        small
                        style={styles.button}
                        onPress={() => {
                            this.setState({seasonType: 'SUMMER'})
                        }}
                        title="Sum"
                        color="#44aa44"
                    />
                    <Button
                        small
                        style={styles.buttons}
                        onPress={() => {
                            this.setState({seasonType: 'FALL'})
                        }}
                        title="Fall"
                        color="#aaaa44"
                    />
                    <Button
                        small
                        style={styles.button}
                        onPress={() => {
                            this.setState({seasonType: 'WINTER'})
                        }}
                        title="Win"
                        color="#4444aa"
                    />
                    <Text>Tree: {seasonMonth}</Text>
                    <Button
                        small
                        style={styles.buttons}
                        onPress={this.onPressAddMonth}
                        title="+Mon"
                        color="#44aa44"
                    />
                    <Button
                        small
                        style={styles.button}
                        onPress={this.onPressSubMonth}
                        title="-Mon"
                        color="#aa4444"
                    />

                    <Text>{this.state.leafCount}</Text>
                    <Button
                        small
                        style={styles.buttons}
                        onPress={this.onPressAddLeaf}
                        title="+ Leaf"
                        color="#44aa44"
                    />
                    <Button
                        small
                        style={styles.button}
                        onPress={this.onPressSubLeaf}
                        title="- Leaf"
                        color="#aa4444"
                    />
                    <Text>Transforms</Text>
                    <Button
                        small
                        style={styles.button}
                        onPress={() => {
                            this.leafRefs.forEach((month) => {
                                month.forEach((leaf) => {
                                    console.log(leaf.getPosition())
                                })
                            })
                        }}
                        title="dump"
                        color="#aaaaaa"
                    />

                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
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
    leafRef;
    render() {
        let {id, month, transform} = this.props;

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
                       renderSize={20}
                       reverse={false}
                       x={x}
                       y={y}
                       ref={(ref) => {
                           this.leafRef = ref
                       }}
                       longPressDrag={(_) => console.log('long press' + _)}
                       pressDrag={(_) => console.log('press drag' + _)}
                       pressInDrag={(_) => console.log('in press' + _)}
                       pressOutDrag={(_) => console.log('out press' * _)}
                       pressDragRelease={(e, gestureState) => console.log(e, gestureState)}
            />
        );
        return (
            <View style={{flex: 1}}>
                <Image
                    style={[
                        styles.sprite,
                        {
                            top: y,
                            left: x,
                            height: w,
                            width: h,
                            transform: [{rotateZ: rot + 'deg'}],
                            position: 'absolute'
                        },
                    ]}
                    source={require('../../../assets/vector/Blaetter_Baum_und_Fortschritt/Blatt1.png')}
                    resizeMode="contain"
                />
            </View>
        );

    }
}