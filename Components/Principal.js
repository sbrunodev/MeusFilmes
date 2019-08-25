import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View, ScrollView,
    FlatList,
    TouchableOpacity,
    TextInput,
    AsyncStorage,
    StatusBar,
    Picker,
    ActivityIndicator
} from 'react-native';

import Icon from 'react-native-ionicons';
import Item from './Item';

const isFavorite = (myFavorites, itemFilme) => {
    return myFavorites.filter(({ item }) => item.id === itemFilme.id).length >= 1;
}

export default class Principal extends Component {

    state = { movies: [], myFavorites: [], ano: '', tipoPesquisa: 'Ano', totalPages: '', totalResults: '', paginaAtual: '', loading: true }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Meus Filmes",
            headerRight: (

                <TouchableOpacity style={{ marginRight: 10 }} onPress={navigation.getParam('btnFavoritos')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                            Favoritos
                    </Text>
                        <Icon name="heart" color="red" />
                    </View>
                </TouchableOpacity>

            ),
        };
    };


    async componentDidMount() {

        this.props.navigation.setParams({ btnFavoritos: this._btnFavoritos });
        // Inicializa os favoritos
        //AsyncStorage.setItem('@MyFavoriteMovies:myFavorites', JSON.stringify([]));
        const myFavorites = await AsyncStorage.getItem('@MyFavoriteMovies:myFavorites');

        const currentYear = new Date().getFullYear();
        this.setState({
            ano: currentYear,
            myFavorites: JSON.parse(myFavorites) || []
        });
        this.pesquisar();
    }

    _btnFavoritos = () => {

        const movies = this.state.myFavorites;
        console.log("Abrir Favoritos");
        console.log(movies);
        this.props.navigation.navigate('screenFavoritos', { movies: movies, updateMain: () => this.updateMain() });

    };

    updateMain = async () => {

        const myFavorites = await AsyncStorage.getItem('@MyFavoriteMovies:myFavorites');
        this.setState({
            myFavorites: JSON.parse(myFavorites) || []
        });

    }

    async pesquisar() {

        this.setState({
            loading:true
        });

        url = "";
        if (this.state.tipoPesquisa === 'Ano') {
            url = "https://api.themoviedb.org/3/discover/movie" +
                `?primary_release_year=${this.state.ano}` +
                "&page=1" +
                "&include_video=false" +
                "&include_adult=false" +
                "&sort_by=popularity.desc" +
                "&language=pt-BR" +
                "&api_key=03a176429e309da499d69a746dad0fe5";
        }
        else {
            let titulo = this.state.ano;
            titulo = titulo.trim().replace(' ', '+');
            url = `https://api.themoviedb.org/3/search/movie?api_key=03a176429e309da499d69a746dad0fe5&query=${titulo}&page=1`;
        }


        const movieCall = await fetch(url);
        const response = await movieCall.json();
        const movies = response.results;

        const totalPages = response.total_pages;
        const totalResults = response.total_results;

        this.setState({
            movies: movies,
            totalPages: totalPages,
            totalResults: totalResults,
            paginaAtual: '1',
            loading:false
        });

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

            if (isFavorite(currentState.myFavorites, item)) {
                return {
                    myFavorites: this.removeFavoritos(currentState.myFavorites, item)
                }
            }
            return {
                myFavorites: currentState.myFavorites.concat([{ item: item }])
            }
        },
            () => {
                AsyncStorage.setItem('@MyFavoriteMovies:myFavorites', JSON.stringify(this.state.myFavorites));
            });
    };

    handleToggleSinopse = item => {
        this.props.navigation.navigate('screenSinopse', { item: item });
    }

    async getNovosFilmes(proxPagina) {

        console.log("Página Atual: " + proxPagina);
        url = url.replace(`page=${this.state.paginaAtual}`, `page=${proxPagina}`);

        const movieCall = await fetch(url);
        const response = await movieCall.json();
        const movies = response.results;

        return movies;
    }

    async proximaPagina() {

        let proxPagina = parseInt(this.state.paginaAtual) + 1;

        if (proxPagina <= parseInt(this.state.totalPages)) {
            this.setState({
                paginaAtual: proxPagina.toString(),
                loading:true
            });

            const movies = await this.getNovosFilmes(proxPagina);

            const listFilmes = this.state.movies;

            /*var igual = 0;
            for (let i = 0; i < listFilmes.length; i++){
                for (let x = 0; x < movies.length; x++){
                    if( listFilmes[i].id === movies[x].id ){
                        igual++;
                        console.log(igual+"REPETIDOOOOOO");
                    }
                }
            }
            */

            const list = listFilmes.concat(movies);
            console.log("Lista Total"); console.log(list);

            this.setState({
                movies: list,
                loading:false,
            });
        }
    }

    renderItens() {
        return (
            <FlatList
                data={this.state.movies}
                numColumns={3}
                renderItem={info => (
                    <Item
                        item={info.item}
                        isFavorite={isFavorite(this.state.myFavorites, info.item)}
                        onToggleFavorite={() => this.handleToggleFavorite(info.item)}
                        onSinopse={() => this.handleToggleSinopse(info.item)}
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={() => this.proximaPagina()}
                extraData={this.state.myFavorites}
                keyExtractor={item => `${item.id}`}
            />
        );
    }

    renderPages() {
        if (this.state.movies.length != 0)
            return (
                <View style={{ marginTop: 25, padding: 10 }}>
                    <Text style={{ fontSize: 15 }}>Páginas: {this.state.totalPages}</Text>
                    <Text style={{ fontSize: 15 }}>Resultados encontrados: {this.state.totalResults}</Text>
                </View>
            );
    }

    renderButton() {
        if (this.state.loading) {
            return (
                <ActivityIndicator size="large" color="#0E86F1" />
            );
        }
        else {
            return (
                <TouchableOpacity style={{ width: "15%", backgroundColor: "#0E86F1", height: 40 }} onPress={() => this.pesquisar()}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Icon name="md-search" color="#fff" />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View style={Styles.container}>

                <StatusBar backgroundColor="black" />

                <View style={Styles.header}>

                    <View style={{ flexDirection: 'row' }}>
                        <TextInput style={{ width: "52%", fontSize: 15, borderColor: "#bababa", backgroundColor: "#fff", borderWidth: 1, height: 40 }}
                            onChangeText={(text) => { this.setState({ ano: text }) }}
                            placeholder={this.state.tipoPesquisa === 'Ano' ? "Pesquisar por ano" : "Pesquisar por título"}
                            maxLength={this.state.tipoPesquisa === 'Ano' ? 4 : 15}
                            keyboardType={this.state.tipoPesquisa === 'Ano' ? "numeric" : "default"}
                            underlineColorAndroid='transparent' />

                        <Picker
                            selectedValue={this.state.tipoPesquisa}
                            style={{ width: "33%", borderColor: "#bababa", borderWidth: 1, height: 40 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ tipoPesquisa: itemValue, ano: '' })}>
                            <Picker.Item label="Ano" value="Ano" />
                            <Picker.Item label="Titulo" value="Titulo" />
                        </Picker>

                        {this.renderButton()}

                    </View>

                </View>


                {this.renderItens()}


            </View>
        );
    }


}

Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        paddingTop: 10,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 6,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    }
});
