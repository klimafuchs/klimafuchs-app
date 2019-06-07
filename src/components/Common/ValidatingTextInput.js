import React, {Component, Fragment} from 'react';
import {Input, Item, Label, Text} from 'native-base';
import PropTypes from 'prop-types';

import {validate as validatejs} from 'validate.js'
import {constraints} from './Validations'
import {StyleSheet} from "react-native";
import material from "../../../native-base-theme/variables/material";

export class ValidatingTextField extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        validateAs: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onChangeText: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        externalError: PropTypes.string,
        secureTextEntry: PropTypes.bool,
        onBlur: PropTypes.func,
        alwaysShowErrors: PropTypes.bool
    };

    state = {
        error: undefined,
        value: this.props.value
    };

    getErrors = () => {
        return this.state.error;
    };

    validate = (value) => {
        console.log(`validate ${this.props.validateAs}: ${value}`);
        let error = validatejs({[this.props.validateAs]: value}, constraints);
        error = error[this.props.validateAs] ? error[this.props.validateAs][0] : undefined;
        console.log(error);
        return error;
    };

    render() {
        let {label, name, onChangeText, secureTextEntry, externalError, onBlur, alwaysShowErrors} = this.props;
        let {error} = this.state;
        let showsErrors = (error || externalError);
        return (
            <Fragment>
                <Item regular style={showsErrors ? styles.formTextboxError : styles.formTextbox}>
                    <Input name={name}
                           secureTextEntry={secureTextEntry}
                           onChangeText={(text) => {
                               this.setState({
                                   value: text,
                               });
                               if (alwaysShowErrors) {
                                   let error = this.validate(text);
                                   this.setState({
                                       error
                                   });
                               }
                               onChangeText(text);
                           }}
                           onBlur={() => {
                               let error = this.validate(this.state.value);
                               this.setState({
                                   error
                               });
                               if (onBlur) onBlur(error);
                           }}
                           value={this.state.value}/>
                </Item>
                <Label style={showsErrors ? styles.formLabelError : styles.formLabel}>{label}</Label>

                <Text>
                    {showsErrors && <Text style={styles.formLabelError}>
                        {(error || externalError)}
                    </Text>}
                </Text>
            </Fragment>
        )
    };


}

const styles = StyleSheet.create(
    {
        form: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 40,
            marginBottom: 40
        },
        formLabel: {
            color: material.textColor,
            fontSize: 12,
            marginBottom: 5
        },
        formTextbox: {
            color: material.textColor,
            borderColor: material.textColor,
            marginBottom: 5
        },
        formLabelError: {
            color: material.brandDanger,
            fontSize: 12,
            marginBottom: 5
        },
        formTextboxError: {
            color: material.brandDanger,
            borderColor: material.brandDanger,
            marginBottom: 20
        }
    }
);