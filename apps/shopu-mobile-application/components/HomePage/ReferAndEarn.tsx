import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReferAndEarn = () => {
  return (
    <SafeAreaView className="m-auto mb-4 mt-4 w-[95%]">
      <View className="bg-primary-bold flex flex-row items-center justify-around rounded-xl p-4">
        <View>
          <Text className="font-PoppinsSemiBold text-[20px] text-white">Refer and Earn $25</Text>
          <Text className="font-PoppinsRegular text-[12px] text-white">Your buddy get $10</Text>
        </View>
        <View>
          <Image source={images.referAndEarnImage} className="h-[80px] w-[80px]" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReferAndEarn;
