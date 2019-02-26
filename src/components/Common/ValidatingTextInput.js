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
        onBlur: PropTypes.func
    };

    state = {
        error: undefined,
        value: ''
    };

    getErrors = () => {
        return this.state.error;
    };

    validate = (value) => {
        let error = validatejs({[this.props.validateAs]: value}, constraints);
        error = error[this.props.validateAs] ? error[this.props.validateAs][0] : undefined;
        console.log(error);
        return error;
    };

    render() {
        let {label, name, validateAs, onChangeText, secureTextEntry, externalError, onBlur} = this.props;
        let {error} = this.state;
        let showsErrors = (error || externalError);
        console.log(externalError);
        return (
            <Fragment>
                <Label style={showsErrors ? styles.formLabelError : styles.formLabel}>{label}</Label>
                <Item regular style={showsErrors ? styles.formTextboxError : styles.formTextbox}>
                    <Input name={name}
                           secureTextEntry={secureTextEntry}
                           onChangeText={(text) => {
                               this.setState({
                                   value: text,
                               });
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
            marginBottom: 20
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