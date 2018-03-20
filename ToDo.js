import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import Proptypes from 'prop-types';

const { width, height } = Dimensions.get("window");

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing : false,
            toDoValue : props.text
        };
    };

    static proptypes = {
        text : Proptypes.string.isRequired,
        isCompleted : Proptypes.bool.isRequired,
        deleteToDo : Proptypes.func.isRequired,
        id : Proptypes.string.isRequired,
        completeToDo : Proptypes.func.isCompleted,
        uncompleteToDo : Proptypes.func.isCompleted,
        updateToDo : Proptypes.func.isRequired
    };

    render() {
        const {isEditing, toDoValue} = this.state;
        const { text, id, isCompleted, deleteToDo } = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View style={[styles.circle, isCompleted 
                            ? styles.completedCircle : styles.uncompleteCircle]} />
                    </ TouchableOpacity>
                    {isEditing ? (
                    <TextInput style={[styles.text, styles.input, isCompleted 
                        ? styles.completedText : styles.uncompleteText]} 
                    value={toDoValue} multiline={true} 
                    onChangeText={this._controllInput}
                    returnKeyType={"done"} 
                    onBlur={this._finishEditing}/>) : (
                    <Text style={[styles.text, isCompleted 
                    ? styles.completedText : styles.uncompleteText]}>{text}</Text>)}
                </View>

                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing}>
                            <View style={styles.actionContainer}>
                                <Text>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View> )
                     : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startEditing}>
                            <View style={styles.actionContainer}>
                                <Text>✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={() => deleteToDo(id)}>
                            <View style={styles.actionContainer}>
                                <Text>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    _toggleComplete = () => {
        const {isCompleted, completeToDo, uncompleteToDo, id} = this.props;
        if(isCompleted) {
            uncompleteToDo(id);
        } else {
            completeToDo(id);
        }
    }

    _startEditing = () => {
        this.setState({
            isEditing : true
        })
    }

    _finishEditing = () => {
        const {toDoValue} = this.state;
        const {id, updateToDo} = this.props;
        
        updateToDo(id, toDoValue);

        this.setState({
            isEditing : false
        })
    }

    _controllInput = text => {
        this.setState({
            toDoValue : text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20,
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompleteText: {
        color: "black"  
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 20,
        borderWidth: 3
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompleteCircle: {
        borderColor: "#f23567"  
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginHorizontal: 10,
        marginVertical: 10,

    },
    input: {
        marginVertical: 15,
        width: width / 2,
        paddingBottom: 5
    }
});