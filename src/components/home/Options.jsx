import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {optionStyles} from '../../styles/optionsStyles';
import Icons from '../global/Icons';
import {Colors} from '../../utils/Constants';
import CustomText from '../global/CustomText';
import {useTCP} from '../../services/TCPProvider';
import {navigate} from '../../utils/NavigationUtil';

const Options = ({isHome, onMediaPickedUp, onFilePickedUp}) => {
  // const {isHome, onMediaPickedUp, onFilePickedUp} = props;

  const {isConnected} = useTCP();
  const handleUniversalPicker = async () => {
    if (isHome) {
      if (isConnected) {
        navigate('ConnectionScreen');
      } else {
        navigate('SendScreen');
      }
      return;
    }
    // if(){}
  };

  return (
    <View style={optionStyles.container}>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={handleUniversalPicker('images')}>
        <Icons
          name="images"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-medium"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginTop: 4, textAlign: 'center'}}>
          Photo
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={handleUniversalPicker('file')}>
        <Icons
          name="musical-notes-sharp"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-medium"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginTop: 4, textAlign: 'center'}}>
          Audio
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={handleUniversalPicker('file')}>
        <Icons
          name="folder-open"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-medium"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginTop: 4, textAlign: 'center'}}>
          Files
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={handleUniversalPicker('file')}>
        <Icons
          name="contacts"
          iconFamily="MaterialCommunityIcons"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-medium"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginTop: 4, textAlign: 'center'}}>
          Contacts
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Options;
