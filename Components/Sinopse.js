import React, { Component } from 'react';
import {
  Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking
} from 'react-native';

import Icon from 'react-native-ionicons';

export default class Sinopse extends Component {

  static navigationOptions = ({ navigation }) => {
    return {

      title: 'Sinopse',
      headerRight: (

        <TouchableOpacity style={{ marginRight: 15 }} onPress={navigation.getParam('compartilhar')}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="md-share" color="#2578D5" />
          </View>
        </TouchableOpacity>

      ),
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ compartilhar: this._compartilhar });
    const { navigation } = this.props;
    filme = navigation.getParam('item');

    filme.release_date = this.dataAtualFormatada(new Date(filme.release_date));

  }

  _compartilhar() {
    var message = "Meus Filmes \n\n";

    message += filme.title + "\n\n";

    message += "Sinopse \n";
    message += filme.overview;

    Linking.openURL(`whatsapp://send?text=${message}`);
  }

  dataAtualFormatada(data) {
    var dia = data.getDate();
    if (dia.toString().length == 1)
      dia = "0" + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
      mes = "0" + mes;
    var ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }

  carregaFoto = () => {
    this.props.navigation.navigate('screenFoto', { titulo: filme.title, caminhoimg: filme.poster_path });
  }

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>

          <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}> {item.title} </Text>
          </View>


          <View style={{ flexDirection: 'row' }}>

            <View style={Styles.movieImagemContainer}>
              <TouchableOpacity style={Styles.movieImagemContainer} onPress={this.carregaFoto}>
                <Image style={Styles.moviePosterImage} source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} />
              </TouchableOpacity>
            </View>

            <View style={{ paddingLeft: 10 }}>

              <View style={{ marginBottom: 60 }}>
                <Text style={{ fontSize: 18, color: 'black' }}>Data de Estreia  </Text>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{item.release_date}</Text>
              </View>


              <View style={{ marginBottom: 60 }}>
                <Text style={{ fontSize: 18, color: 'black' }}>Popularidade  </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.popularity}</Text>
              </View>

              <View style={{}}>
                <Text style={{ fontSize: 18, color: 'black' }}>Nota </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.vote_average}</Text>
              </View>

            </View>



          </View>

          <View>
            <Text style={{ fontSize: 18,  color:'black' }}>Sinopse</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold',  color:'black' }}>{item.overview}</Text>
          </View>

        </View>
      </ScrollView>
    );
  }
}

const Styles = StyleSheet.create({

  movieImagemContainer: {
    height: 300,
    width: 150,
    marginBottom: 20,
  },
  moviePosterImage: {
    flex: 1,
  },


});


