import React, { Component } from 'react';
import {
  View,
  FlatList, TouchableOpacity, Text, Linking, AsyncStorage
} from 'react-native';

import Item from './Item';
import Icon from 'react-native-ionicons';


export default class Favoritos extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Meus Favoritos",
      headerRight: (

        <TouchableOpacity style={{ marginRight: 15 }} onPress={navigation.getParam('compartilhar')}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>            
            <Icon name="md-share" color="#2578D5" />
          </View>
        </TouchableOpacity>

      ),
    }
  };

  componentWillUnmount() {

    const { params } = this.props.navigation.state
    params && params.updateMain && params.updateMain() // Checking that the function was passed down, as a navigation prop before executing

  }

  state = { movies: [] }


  componentDidMount() {
    const { navigation } = this.props;
    movies = navigation.getParam('movies');
    //console.log('Favoritos.js');
    //console.log(movies);
    this.setState({ movies: movies });

    this.props.navigation.setParams({ compartilhar: this._compartilhar });
  }

  handleToggleSinopse = item => {
    this.props.navigation.navigate('screenSinopse', { item: item });
  };

  _compartilhar() {

    var message = "Meus Filmes Favoritos \n\n";

    movies.forEach(element => {
      message += element.item.title + " \n";
    });

    Linking.openURL(`whatsapp://send?text=${message}`);

  }

  removeFavoritos(myFavorites, item) {

    let result = [];
    myFavorites.forEach(element => {
      if (element.item.id !== item.id)
        result.push(element);
    });

    return result;
  }

  handleToggleFavorite = item => {

    this.setState((currentState) => {
      return {
        movies: this.removeFavoritos(currentState.movies, item)
      }
    },
      () => {
        AsyncStorage.setItem('@MyFavoriteMovies:myFavorites', JSON.stringify(this.state.movies));
        console.log("Adicionados");
        console.log(this.state.movies);
      });
  };

  renderLista() {

    if (this.state.movies.length == 0) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{fontSize:18, color:'black'}}>
            Você não tem filmes favoritos :/
          </Text>
        </View>
      );
    }
    else {
      return (
        <FlatList
          data={this.state.movies}
          numColumns={3}
          renderItem={info => (
            <Item
              item={info.item.item}
              //{...console.log(info.item.item)}
              isFavorite={true}
              onSinopse={() => this.handleToggleSinopse(info.item.item)}
              onToggleFavorite={() => this.handleToggleFavorite(info.item.item)}
            />
          )}
          keyExtractor={item => `${item.id}`}
        />
      );
    }

  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        {this.renderLista()}
      </View>
    );

  }
}
