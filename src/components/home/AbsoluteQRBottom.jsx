import {View, Text, Touchable, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Icons from '../global/Icons';
import {bottomTabStyles} from '../../styles/bottomTabStyle';
import {navigate} from '../../utils/NavigationUtil';
import QRScannerModel from '../modals/QRScannerModel';

const AbsoluteQRBottom = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <View style={bottomTabStyles.container}>
        <TouchableOpacity onPress={() => navigate('ReceviedFileScreen')}>
          <Icons
            name="apps-sharp"
            iconFamily="Ionicons"
            color="#333"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={bottomTabStyles.qrCode}>
          <Icons
            name="qrcode-scan"
            iconFamily="MaterialCommunityIcons"
            color="#fff"
            size={26}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icons
            name="beer-sharp"
            iconFamily="Ionicons"
            color="#333"
            size={24}
          />
        </TouchableOpacity>
      </View>

      {visible && (
        <QRScannerModel visible={visible} onClose={() => setVisible(false)} />
      )}
    </>
  );
};

export default AbsoluteQRBottom;
