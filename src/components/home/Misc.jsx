import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import CustomText from '../global/CustomText';
import {commonStyles} from '../../styles/commonStyles';

const Misc = () => {
  return (
    <View style={style.container}>
      <CustomText fontFamily="Okra-Bold" fontSize={20}>
        Explore
      </CustomText>
      <Image
        source={require('../../assets/icons/wild_robot.jpg')}
        style={style.adBanner}
      />
      <View style={commonStyles.flexRowBetween}>
        <CustomText fontSize={22} style={style.text} fontFamily="Okra-Bold">
          #1 world Best File Sharing App!
        </CustomText>
        <Image
          style={style.image}
          source={require('../../assets/icons/share_logo.jpg')}
        />
      </View>
      <CustomText style={style.text2} fontFamily="Okra-Bold">
        Made ♥️ - Hamza Salam
      </CustomText>
    </View>
  );
};

export default Misc;

const style = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  adBanner: {
    width: '!00%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 25,
  },
  text: {
    opacity: 0.5,
    width: '60%',
  },
  text2: {
    opacity: 0.5,
    marginTop: 10,
  },
  image: {resizeMode: 'contain', height: 120, width: '35%'},
});
