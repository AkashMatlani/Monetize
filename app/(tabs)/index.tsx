import CreateSubscriptionModal from "@/components/CreateSubscrptionModal";
import ListHeading from '@/components/ListHeading';
import SubscrptionCard from '@/components/SubscrptionCard';
import UpcomingSubscrptionCard from '@/components/UpcomingSubscrptionCard';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import '@/global.css';
import { useSubscrptionStore } from '@/lib/subscrptionStore';
import { formatCurrency } from '@/lib/utills';
import { useUser } from '@clerk/expo';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const { subscription, addSubscription } = useSubscrptionStore();
  const [expandedSubscrptionId, setExpandedSubscrptionId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const upcomingSubscrptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = now.add(7, 'days');
    return subscription.filter(sub =>
      sub.status === 'active' &&
      dayjs(sub.renewalDate).isAfter(now) &&
      dayjs(sub.renewalDate).isBefore(nextWeek)
    ).sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [subscription]);


  const handleSubscriptionPress = (item: Subscrption) => {
    const isExpanding = expandedSubscrptionId !== item.id;
    setExpandedSubscrptionId((currentId) => (currentId === item.id ? null : item.id));

  }

  const handleCreateSubscription = (newSubscription: Subscrption) => {
    addSubscription(newSubscription);
  }

  const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className='home-header'>
              <View className='home-user'>
                <Image
                  source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                  className='home-avatar'
                  resizeMode="cover"
                />
                <Text className='home-user-name' numberOfLines={1}>{displayName}
                </Text>
              </View>

              <Pressable
                onPress={() => setIsModalVisible(true)}
                className="p-2">
                <Image
                  source={icons.add}
                  className='home-add-icon'
                  resizeMode="contain" />
              </Pressable>
            </View>

            <View className='home-balance-card'>
              <Text className='home-balance-label'>Balance</Text>
              <View className='home-balance-row'>
                <Text className='home-balance-amount'>{formatCurrency(2489.48)}</Text>
                <Text className='home-balance-date'>{dayjs("2026-03-18T09:00:00.000Z").format('MM/DD')}</Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={upcomingSubscrptions}
                renderItem={({ item }) => (<UpcomingSubscrptionCard {...item} />)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscription}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscrptionCard
            {...item}
            expanded={expandedSubscrptionId === item.id}
            onPress={() => handleSubscriptionPress(item)} />
        )}
        extraData={expandedSubscrptionId}
        ItemSeparatorComponent={() => <View className='h-4' />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-30'
        ListEmptyComponent={
          <Text className='home-empty-state'>No subscrptions yet.</Text>
        }
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />

    </SafeAreaView>
  );
}
