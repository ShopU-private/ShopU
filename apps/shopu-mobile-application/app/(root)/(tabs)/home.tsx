import { images } from '@/constants';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import NewArrivalProduct from '@/components/DifferentProductSection/NewArrivalProduct';
import HairAndSkinProducts from '@/components/DifferentProductSection/HairAndSkinProduct';
import EveryDayMedicines from '@/components/DifferentProductSection/EveryDayMedicines';
import TravelEssentials from '@/components/DifferentProductSection/TravelEssentials';
import ColdAndCoughProducts from '@/components/DifferentProductSection/ColdAndCoughProduct';
import ReferAndEarn from '@/components/HomePage/ReferAndEarn';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView className="m-auto mb-1 w-[95%] flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 50 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Image
          source={images.homePageMainImage}
          className="h-49.75 w-full rounded-xl"
          resizeMode="contain"
        />
        <NewArrivalProduct />
        <HairAndSkinProducts />
        <View className="m-auto mt-4 w-[95%] rounded-xl">
          <Image source={images.secondMainImage} className="h-49.75 w-full" resizeMode="contain" />
        </View>
        <EveryDayMedicines />
        <TravelEssentials />
        <ColdAndCoughProducts />
        <ReferAndEarn />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
