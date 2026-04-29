import CartScreen from '@/components/CartPage/Cart';
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Cart = () => {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <CartScreen />
      </ScrollView>
      <View className="mb-10 flex-row items-center justify-between bg-white px-6 py-4">
        <View>
          <Text className="text-2xl font-bold text-gray-800">₹1,600</Text>
          <Text className="text-sm text-[#666666]">Bill Amount</Text>
        </View>

        <TouchableOpacity className="w-56 items-center rounded-xl bg-[#317C80] py-3 text-center">
          <Text className="text-lg font-semibold text-white">Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
