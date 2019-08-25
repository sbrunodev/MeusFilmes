import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Dimensions
} from 'react-native';

import Icon from 'react-native-ionicons';

export default class Foto extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }


    render() {

        const { navigation } = this.props;
        const { goBack } = this.props.navigation;
        titulo = navigation.getParam('titulo');
        caminhoimg = navigation.getParam('caminhoimg');

        return (
            <View style={{ flex: 1 }}>

                <View style={{ backgroundColor: 'black', width: "100%", height: 50, flexDirection: 'row', padding: 10 }}>

                    <TouchableOpacity onPress={() => goBack()} >
                        <Icon name="md-arrow-round-back" color="#fff" />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, color: "#fff", marginLeft: 20 }}>{titulo}</Text>
                </View>

                <View style={Styles.movieImagemContainer}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${caminhoimg}` }} style={Styles.moviePosterImage} />
                </View>

            </View>
        );
    }
}

const Styles = StyleSheet.create({

    movieImagemContainer: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        marginBottom: 20,
    },
    moviePosterImage: {
        flex: 1
    }



});


