import { images } from '@/constants';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeHeader = () => {
  const [showText, setShowText] = useState('Products');
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideAnimation, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowText(prev => (prev === 'Products' ? 'Medicine' : 'Products'));
        // Reset position to below (new text comes from below)
        slideAnimation.setValue(30);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [slideAnimation]);

  const handleCart = () => {
    router.push('/(pages)/cart');
  };
  const handleNotification = () => {
    router.push('/(pages)/notification');
  };

  const handleSearchPress = () => {
    router.push('/(pages)/searchPage');
  };

  return (
    <View className="flex gap-5">
      <SafeAreaView className="mb-[10px] flex w-full flex-row items-center justify-between">
        <View className="ml-[20px] flex flex-shrink-0 items-start">
          <Text className="font-RobotoSemiBold mb-[5px] text-[22px] text-[#F3F3F3]">Hi, User</Text>
          <Text className="font-RobotoRegular text-[14px] text-[#F3F3F3]">Welcome to ShopU</Text>
        </View>
        <View className="mr-[20px] flex flex-shrink-0 flex-row gap-10">
          <TouchableOpacity onPress={handleCart}>
            <Image source={images.cartIcon} className="h-[24px] w-[24px]" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotification}>
            <Image source={images.notificationIcon} className="h-[24px] w-[24px]" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <TouchableOpacity onPress={handleSearchPress} activeOpacity={1}>
        <SafeAreaView
          className="relative flex items-center"
          style={{
            shadowColor: '#fff',
            shadowOffset: { height: 10, width: 10 },
            elevation: 10,
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
        >
          <Image
            source={images.searchIcon}
            className="absolute left-[24px] top-[16px] z-50 h-[18px] w-[18px]"
          />
          <View
            className="m-auto flex w-[97%] flex-row gap-2 overflow-hidden rounded-full bg-white px-14 py-5"
            style={{
              shadowColor: 'gray',
              shadowOffset: {
                height: 5,
                width: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 10,
            }}
          >
            <Text className="font-RobotoRegular text-[14px] text-[#666666]">Search</Text>
            <Animated.Text
              style={{
                transform: [{ translateY: slideAnimation }],
              }}
              className={'font-RobotoRegular text-[14px] text-[#666666]'}
            >
              &quot;{showText}&quot;
            </Animated.Text>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </View>
  );
};
