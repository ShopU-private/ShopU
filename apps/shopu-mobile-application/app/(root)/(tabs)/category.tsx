import { ScrollView } from 'react-native';
import React from 'react';
import BabyCareCategory from '@/components/CategoryPage/BabyCareCategory';
import PersonalCareCategory from '@/components/CategoryPage/PersonalCareCategory';
import WomenCareCategory from '@/components/CategoryPage/WomenCareCategory';
import HealthDeviceCategory from '@/components/CategoryPage/HealthDeviceCategory';
import { SafeAreaView } from 'react-native-safe-area-context';

const Category = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <BabyCareCategory />
        <PersonalCareCategory />
        <WomenCareCategory />
        <HealthDeviceCategory />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Category;
