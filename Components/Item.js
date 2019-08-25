import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ionicons';

const Styles = StyleSheet.create({
    movieContatos: {
        width: Dimensions.get('window').width / 3 - 10,
        marginHorizontal: 5,
        marginVertical: 6,
    },
    movieImagemContainer: {
        height: 200
    },
    moviePosterImage: {
        flex: 1,
        borderRadius: 10
    },
    movieTitle: {
        fontSize: 15,
        fontFamily: "Roboto",
        color:'black'
    },
    movieFavoriteButton: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    movieSinopseButton: {
        position: 'absolute',
        top: 5,
        right: 5
    }

});

export default class Item extends Component {

    render() {
        /*numberOfLines={1}*/
        return (

            <View style={Styles.movieContatos}>
                <View style={Styles.movieImagemContainer}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${this.props.item.poster_path}` }} style={Styles.moviePosterImage} />
                </View>

                <Text style={Styles.movieTitle} > { this.props.item.title } </Text>

                <TouchableOpacity style={Styles.movieFavoriteButton} onPress={this.props.onToggleFavorite}>
                    <Icon name="heart" color={this.props.isFavorite ? "red" : "#fff"} />
                </TouchableOpacity>

                <TouchableOpacity style={Styles.movieSinopseButton} onPress={this.props.onSinopse}>
                    <Icon name="md-list" color="#fff" />
                </TouchableOpacity>

            </View>

        );
    }
}



