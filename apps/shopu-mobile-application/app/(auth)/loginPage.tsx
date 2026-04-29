import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';

const LoginPage = () => {
  const router = useRouter();
  const { setPhoneNumber } = useAuth();
  const [phone, setPhone] = useState<string>('');
  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhone(value);
      setPhoneNumber(value);
    },
    [setPhoneNumber]
  );

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'https://shop-u-repo.vercel.app/api/auth/login/send-otp',
        { phoneNumber: phone },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data && response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: 'OTP send',
          text2: `OTP is send to the ${phone}`,
        });
        router.replace('/(auth)/verifyOtp');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Unable to send OTP',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: String(error),
      });
    }
  };

  return (
    <SafeAreaView className="mb-13.5 flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-[90%] items-center">
            <Text className="font-KarlaSemiBold text-[29px]">India&apos;s last minute app</Text>
            <Text className="font-KarlaMedium text-primary-bold mb-4 text-[18px]">
              Log in or Sign up
            </Text>

            <TextInput
              placeholder="Enter your mobile"
              keyboardType="number-pad"
              className="mb-4 w-[90%] rounded-lg border border-[#909090] px-5"
              value={phone}
              onChangeText={handlePhoneChange}
            />

            <TouchableOpacity
              className="bg-primary-bold py-3 mb-2 rounded-lg px-20"
              onPress={handleSubmit}
            >
              <Text className="font-KarlaMedium text-[14px] text-white">Generate OTP</Text>
            </TouchableOpacity>

            <View className="mb-1.25 h-0.5 w-full bg-[#EDEDED]" />
            <Text className="font-KarlaRegular text-center text-[12px]">
              By continuing, you agree to our Terms of Services & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;
