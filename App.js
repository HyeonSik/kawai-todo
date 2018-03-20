import React from 'react';
import { StyleSheet, Text, View, StatusBar, 
  TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import {AppLoading} from 'expo';
import ToDo from './ToDo';
import uuidv1 from 'uuid/v1';

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo : "",
    loadedToDos : false,
    toDos : {
    }
  };

  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
    const {newToDo, loadedToDos, toDos} = this.state;
    if(!loadedToDos){
      return <AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>KAWAI TODO</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder="NEW TODO" 
          value={newToDo} onChangeText={this._controlTodo}
          placeholderTextColor="#999" returnKeyType="done"
          autoCorrect={false} onSubmitEditing={this._addToDo} />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo => 
            <ToDo key={toDo.id} {...toDo} deleteToDo={this._deleteToDo} 
            completeToDo={this._completeToDO} uncompleteToDo={this._uncompleteToDO}
            updateToDo={this._updateToDo}/>)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlTodo = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parseToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos : true,
        toDos : parseToDos
      });
      console.log(toDos);
    } catch(err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const { newToDo } = this.state;
    if(newToDo !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObjects = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObjects  
          }
        };
        this._saveToDos(newState.toDos);
        return {...newState};
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }

  _uncompleteToDO = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }

  _completeToDO = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text : text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }

  _saveToDos = (newToDo) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDo));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: "white",
    marginTop: 50,
    fontWeight: "500",
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center",
  }
});
