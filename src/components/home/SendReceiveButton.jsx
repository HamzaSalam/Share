import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {screenHeight} from '../../utils/Constants';

const SendReceiveButton = () => {
  return (
    <View style={style.container}>
      <TouchableOpacity style={style.button}>
        <Image
          source={require('../../assets/icons/send1.jpg')}
          style={style.img}
        />
      </TouchableOpacity>
      <TouchableOpacity style={style.button}>
        <Image
          source={require('../../assets/icons/receive1.jpg')}
          style={style.img}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SendReceiveButton;

const style = StyleSheet.create({
  container: {
    marginTop: screenHeight * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  img: {width: '100%', height: '100%', resizeMode: 'cover'},
  button: {
    width: 140,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
