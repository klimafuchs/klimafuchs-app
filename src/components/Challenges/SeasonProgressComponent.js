import * as React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {Icon} from "native-base";
// You can import from local files
// or any pure javascript modules available in npm
class Sprite extends React.PureComponent {
    render() {
        const { loc, rot, scale, img } = this.props;
        const { w, h } = scale;
        const x = loc.x - w / 2;
        const y = loc.y - h / 2;
        console.log("render sprite with: " + JSON.stringify({ loc, rot, scale}));
        return (
            <FadeIn>
                <View
                    style={[
                        styles.sprite,
                        {
                            left: x,
                            top: y,
                            transform: [{ rotateZ: rot + 'rad' }],
                            width: w,
                            height: h,
                        },
                    ]}>
                    {img}
                </View>
            </FadeIn>
        );
    }
}

export class SeasonProgressComponent extends React.Component {

    static navigationOptions = {
        title: 'Fortschritt',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='leaf'y   style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    leafTransforms = [
        {
            loc: {
                x: 150,
                y: 430,
            },
            rot: 190,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 140,
                y: 420,
            },
            rot: 270,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 255,
                y: 365,
            },
            rot: 70,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 250,
                y: 380,
            },
            rot: 180,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 160,
                y: 325,
            },
            rot: 230,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 157,
                y: 305,
            },
            rot: 300,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 240,
                y: 230,
            },
            rot: 20,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 230,
                y: 274,
            },
            rot: 130,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 153,
                y: 173,
            },
            rot: 230,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 153,
                y: 142,
            },
            rot: 340,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 210,
                y: 150,
            },
            rot: 0,
            scale: {
                w: 20,
                h: 20,
            },
        },

        {
            loc: {
                x: 225,
                y: 167,
            },
            rot: 100,
            scale: {
                w: 20,
                h: 20,
            },
        },
    ];

    constructor(props) {
        super(props);
        this.state = { leafCount: 0 };
        this.onPressAddLeaf = this.onPressAddLeaf.bind(this);
        this.onPressSubLeaf = this.onPressSubLeaf.bind(this);
    }

    drawTree = (loc, rot, scale) => {
        const { w, h } = scale;
        const x = loc.x - w / 2;
        const y = loc.y - h / 2;
        return (
            <Image
                style={[
                    styles.sprite,
                    {
                        top: y,
                        left: x,
                        height: w,
                        width: h,
                        transform: [{ rotateZ: rot + 'rad' }],
                    },
                ]}
                source={require('../../../assets/tree.png')}
            />
        );
    };

    drawLeaf = (key, {loc, rot, scale}) => {
        console.log(JSON.stringify({key: key, t: {loc, rot, scale}}));

        const { w, h } = scale;
        const x = loc.x - w / 2;
        const y = loc.y - h / 2;
        return (
            <Image key={key}
                   style={[
                       styles.sprite,
                       {
                           top: y,
                           left: x,
                           height: w,
                           width: h,
                           transform: [{ rotateZ: rot + 'deg' }],
                       },
                   ]}
                   source={require('../../../assets/leaf.png')}
            />
        );

    };
    /*
    drawLeaf(id, transform) {
      return (
        <Sprite key={id}
          loc={transform.loc}
          rot={transform.rot}
          scale={transform.scale}
          img={
            <Image
            style={[
              styles.sprite,
              {
                height: 20,
                width: 20,
              },
            ]}
            source={require('./assets/leaf.png')}
            />
          }
        />
      );
    }
    */
    onPressAddLeaf() {
        if (this.state.leafCount < 12) {
            this.setState({ leafCount: this.state.leafCount + 1 });
        }
    }
    onPressSubLeaf() {
        if (this.state.leafCount > 0) {
            this.setState({ leafCount: this.state.leafCount - 1 });
        }
    }
    render() {
        const tree = this.drawTree(
            {
                x: 350,
                y: 200,
            },
            0,
            {
                w: 135 * 3,
                h: 35 * 3,
            }
        );

        var leafs = () => {

            var leafs = [];
            for (var i = 0; this.state.leafCount > i; i++) {
                leafs.push(this.drawLeaf(i, this.leafTransforms[i]))
            }
            return (
                leafs
            )
        };

        const leaf = this.drawLeaf(999, this.leafTransforms[0]);
        return (
            <View style={styles.container}>
                {tree}{leafs()}
                <View>
                    <Button
                        style={styles.buttons}
                        onPress={this.onPressAddLeaf}
                        title="+ Leaf"
                        color="#44aa44"
                    />
                    <Button
                        style={styles.button}
                        onPress={this.onPressSubLeaf}
                        title="- Leaf"
                        color="#aa4444"
                    />
                    <Text>Leafs: {this.state.leafCount}</Text>
                </View>
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