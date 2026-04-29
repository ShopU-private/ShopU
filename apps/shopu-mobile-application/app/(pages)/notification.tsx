import NotificationCard from '@/components/NotificationPage/NotificationCard';
import { images } from '@/constants';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = () => {
  return (
    <SafeAreaView className="m-auto mt-4 w-[95%] flex-1">
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-4">
          <NotificationCard
            title={'Order confirmed'}
            message="Thank you for shopping with us. You’ll receive confirmation email /SMS shortly with your order details. We’ll notify you once your package is on its way"
            sentAt={new Date()}
            image={images.orderConfirm}
          />
          <NotificationCard
            title={'Payment success'}
            message="Thank you for your payment. Your transaction has been completed successfully. A confirmation has been sent to your email/SMS"
            sentAt={new Date()}
            image={images.paymentSuccess}
          />
          <NotificationCard
            title={'Offer & Discount'}
            message="Big Savings Await! Get up to 50% OFF on your favorite products. Limited time only – don’t miss out!"
            sentAt={new Date()}
            image={images.offerAndDiscount}
          />
          <NotificationCard
            title={'You got a promo code'}
            message="Promo Code Unlocked: DISCOUNT15, Apply at checkout to enjoy 15% OFF your purchase. Offer ends soon."
            sentAt={new Date()}
            image={images.promoCode}
          />
          <NotificationCard
            title={'Order delivered'}
            message="Order Delivered! We hope everything was perfect. Loved it? Leave a quick review and help others too!"
            sentAt={new Date()}
            image={images.orderDelivered}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
