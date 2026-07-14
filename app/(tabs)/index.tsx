import ListHeading from '@/components/ListHeading';
import SubscrptionCard from '@/components/SubscrptionCard';
import UpcomingSubscrptionCard from '@/components/UpcomingSubscrptionCard';
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import '@/global.css';
import { formatCurrency } from '@/lib/utills';
import dayjs from 'dayjs';
import { styled } from "nativewind";
import { useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {

  const [expandedSubscrptionId, setExpandedSubscrptionId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className='home-header'>
              <View className='home-user'>
                <Image 
                source={images.avatar} 
                className='home-avatar'
                 />
                <Text className='home-user-name'>Akash Matlani</Text>
              </View>
              <Image source={icons.add} className='home-add-icon' />
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
                data={UPCOMING_SUBSCRPTIONS}
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
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscrptionCard
          {...item}
            expanded={expandedSubscrptionId === item.id}
            onPress={() => setExpandedSubscrptionId((currentId) => currentId === item.id ? null : item.id)}
          />
        )}
        extraData={expandedSubscrptionId}
        ItemSeparatorComponent={() => <View className='h-4' />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-30'
        ListEmptyComponent={
          <Text className='home-empty-state'>No subscrptions yet.</Text>
        }
      />
    </SafeAreaView>
  );
}