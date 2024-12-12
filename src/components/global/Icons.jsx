import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import React from 'react';

const Icons = ({color, size, name, iconFamily}) => {
  return (
    <>
      {iconFamily === 'Ionicons' && (
        <Ionicons name={name} color={color} size={RFValue(size)} />
      )}
      {iconFamily === 'MaterialIcons' && (
        <MaterialIcons name={name} color={color} size={RFValue(size)} />
      )}
      {iconFamily === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcons
          name={name}
          color={color}
          size={RFValue(size)}
        />
      )}
    </>
  );
};

export default Icons;
