import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Principal from './Components/Principal';
import Sinopse from './Components/Sinopse';
import Favoritos from './Components/Favoritos';
import Foto from './Components/Foto';

const Gaveta = createDrawerNavigator({
  Home: {
    screen: Principal,
  },
  Favoritos: {
    screen: Favoritos,
  },
});

const AppNavigator = createStackNavigator({
  screenPrincipal: { screen: Principal },
  screenSinopse: { screen: Sinopse },
  screenFavoritos: { screen: Favoritos },
  screenFoto: { screen: Foto },
});

type Props = {};
export default class App extends Component<Props> {

  render() {
    return (
      <AppNavigator />
    );
  }

}

