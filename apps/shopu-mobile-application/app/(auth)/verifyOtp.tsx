import { images } from '@/constants';
import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const OTP_LENGTH = 6;
const RESEND_TIMER = 60;

const VerifyOTP = () => {
  const { phoneNumber, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>(new Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    // Only allow single digit input, no paste/autofill
    if (!/^\d*$/.test(text)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '' && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (newOtp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');

    if (otpString.length !== OTP_LENGTH) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: `Please enter ${OTP_LENGTH} digit OTP`,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://shop-u-repo.vercel.app/api/auth/login/verify-otp',
        {
          phoneNumber,
          otp: otpString,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      console.log(response.data.token);
      if (response.data && response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'OTP verified successfully',
        });
        router.replace('/(root)/(tabs)/home');
        await AsyncStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: response.data.message || 'Please check OTP and try again',
        });
        setOtp(new Array(OTP_LENGTH).fill(''));
        inputs.current[0]?.focus();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: error.response?.data?.message || 'Please try again',
      });
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://shop-u-repo.vercel.app/api/auth/login/send-otp',
        { phoneNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: `New OTP sent to +91 ${phoneNumber}`,
        });

        setResendTimer(RESEND_TIMER);
        setCanResend(false);
        setOtp(new Array(OTP_LENGTH).fill(''));
        inputs.current[0]?.focus();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Resend failed',
          text2: 'Unable to resend OTP. Please try again.',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to resend OTP',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      'Go Back?',
      'Are you sure you want to go back? You will need to request a new OTP.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8 items-center">
            <Image source={images.verifyOtpImages} className='h-52 w-48' />
            <Text className="font-KarlaBold mb-2 text-center text-[24px]">OTP Verification</Text>
            <View className="items-center">
              <Text className="font-KarlaRegular text-center text-[14px] text-gray-600">
                Enter the OTP sent to{' '}
                <Text className="font-KarlaBold text-primary-bold text-[14px]">
                  +91 {phoneNumber}
                </Text>
              </Text>
            </View>
          </View>

          <View className="w-full items-center">
            <View className="mb-6 flex-row justify-center gap-3">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => {
                    inputs.current[index] = el;
                  }}
                  className={`h-12 w-12 font-KarlaBold rounded-lg border text-center text-[18px] ${
                    digit ? 'border-primary-bold bg-primary-light/20' : 'border-gray-300'
                  } ${isLoading ? 'opacity-50' : ''}`}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  editable={!isLoading}
                  autoFocus={index === 0}
                  selectTextOnFocus
                  textContentType="none"
                  autoComplete="off"
                  importantForAutofill="no"
                  inputMode="numeric"
                />
              ))}
            </View>

            <TouchableOpacity
              className={`mb-4 w-[80%] rounded-lg py-4 ${
                isLoading || otp.join('').length !== OTP_LENGTH ? 'bg-gray-300' : 'bg-primary-bold'
              }`}
              onPress={handleVerifyOTP}
              disabled={isLoading || otp.join('').length !== OTP_LENGTH}
            >
              <Text
                className={`font-KarlaMedium text-center text-[16px] ${
                  isLoading || otp.join('').length !== OTP_LENGTH ? 'text-gray-500' : 'text-white'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <View className="mb-4 flex-row items-center">
              <Text className="font-KarlaRegular text-[14px] text-gray-600">
                Didn&apos;t receive OTP?{' '}
              </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={!canResend || isLoading}>
                <Text
                  className={`font-KarlaMedium text-[14px] ${
                    canResend && !isLoading ? 'text-primary-bold' : 'text-gray-400'
                  }`}
                >
                  {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleGoBack} disabled={isLoading} className="mb-4">
              <Text className="font-KarlaRegular text-[14px] text-gray-600 underline">
                Change Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOTP;
