import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import Swiper from 'react-native-swiper';
import { images } from '@/constants/index';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const swiperStyle = {
  mainViewStyle: 'flex h-full items-center',
  headerStyle: 'text-center font-KarlaSemiBold text-[22px] mt-[22px]',
  descriptionStyle: 'text-center font-KarlaRegular text-[16px] mt-[22px] w-[75%]',
  firstSliderImageAspect: 'h-[280px] w-[280px]',
  secondSliderImageAspect: 'h-[265px] w-[398px]',
  thirdSliderImageAspect: 'h-[275px] w-[413px]',
};

const slides = [0, 1, 2];

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastSlide = activeIndex === slides.length - 1;
  const router = useRouter();

  const handleSkip = () => {
    router.replace('/(auth)/loginPage');
    return;
  };

  const renderDots = () => (
    <View className="mt-7.5 flex-row items-center justify-center">
      {slides.map(index => (
        <View
          key={index}
          className={`ml-1 h-2 rounded-full ${index === activeIndex ? 'bg-primary-semiBold' : 'bg-lightRed'}`}
          style={{
            width: index === activeIndex ? 30 : 8,
            transitionDuration: '200ms',
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-27.5 flex-1">
        <Swiper
          loop={false}
          showsPagination={false}
          ref={swiperRef}
          onIndexChanged={index => setActiveIndex(index)}
        >
          {/* Swiper slide 1 */}
          <View className={swiperStyle.mainViewStyle}>
            <Image source={images.slider1} className={swiperStyle.firstSliderImageAspect} />
            <Text className={swiperStyle.headerStyle}>Fast & Reliable Medicine Delivery</Text>
            <Text className={swiperStyle.descriptionStyle}>
              Get your medicines delivered within hours. No more waiting in queues. Safe, fast, and
              hassle-free.
            </Text>
          </View>

          {/* Swiper slide 2 */}
          <View className={swiperStyle.mainViewStyle}>
            <Image source={images.slider2} className={swiperStyle.secondSliderImageAspect} />
            <Text className={swiperStyle.headerStyle}>Track Your Orders</Text>
            <Text className={swiperStyle.descriptionStyle}>
              Stay updated with real-time order tracking. Know exactly when your medicines or lab
              reports will arrive.
            </Text>
          </View>

          {/* Swiper slide 3 */}
          <View className={swiperStyle.mainViewStyle}>
            <Image source={images.slider3} className={swiperStyle.thirdSliderImageAspect} />
            <Text className={swiperStyle.headerStyle}>Professional Healthcare Support</Text>
            <Text className={swiperStyle.descriptionStyle}>
              Get expert advice from qualified pharmacists and healthcare professionals whenever you
              need it.
            </Text>
          </View>
        </Swiper>
        <View className="absolute bottom-80 left-0 right-0 items-center">{renderDots()}</View>
        <View className="absolute bottom-14 left-10">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="font-KarlaRegular text-[16px]">Skip</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-primary-bold absolute bottom-12 right-10 rounded-full p-3">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              lastSlide ? router.replace('/(auth)/loginPage') : swiperRef.current?.scrollBy(1)
            }
          >
            <AntDesign name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
