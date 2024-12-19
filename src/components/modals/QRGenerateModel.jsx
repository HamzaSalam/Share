import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {modalStyles} from '../../styles/modalStyles';
import Icons from '../global/Icons';
import CustomText from '../global/CustomText';
import {Camera, useCameraDevice, CodeScanner} from 'react-native-vision-camera';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import {multiColor} from '../../utils/Constants';
import DeviceInfo from 'react-native-device-info';
import {server} from '../../../metro.config';

const QRGenerateModel = ({visible, onClose}) => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('hamza');

  const shimmerTranslateX = useSharedValue(-300);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerTranslateX.value}],
  }));

  const setupServer = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    setLoading(false);
  };

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
    if (visible) {
      setLoading(true);
      setupServer();
    }
  }, [visible, shimmerTranslateX]);

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={visible}
      onDismiss={onClose}
      onRequestClose={onClose}>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.qrContainer}>
          {loading || qrValue == null || qrValue == '' ? (
            <View style={modalStyles.skeleton}>
              <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={modalStyles.shimmerGradient}
                />
              </Animated.View>
            </View>
          ) : (
            <QRCode
              value={qrValue}
              size={250}
              logoSize={60}
              logoMargin={2}
              logoBorderRadius={10}
              logoBackgroundColor="#fff"
              linearGradient={multiColor}
              logo={require('../../assets/images/profile2.jpg')}
              enableLinearGradient
            />
          )}
        </View>
        <View>
          <CustomText style={modalStyles.infoText1}>
            Ensure you're on the same Wi-Fi network.
          </CustomText>
          <CustomText style={modalStyles.infoText2}>
            Ask the sender to scan this QR code to connect and transfer files
          </CustomText>
          <ActivityIndicator
            size={22}
            color="#000"
            style={{alignSelf: 'center'}}
          />
        </View>
        <TouchableOpacity
          onPress={() => onClose()}
          style={modalStyles.closeButton}>
          <Icons name="close" iconFamily="Ionicons" color="#000" size={24} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRGenerateModel;
