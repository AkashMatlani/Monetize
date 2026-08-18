import SubscrptionCard from "@/components/SubscrptionCard";
import { useSubscrptionStore } from "@/lib/subscrptionStore";
import { styled } from "nativewind";
import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const { subscription } = useSubscrptionStore();
const [serachQuery, setSearchQuery] = useState('');
const [expandedId, setExpandedId] = useState<string | null>(null);

const fliterSubscrptions = subscription.filter((subscription) =>
  subscription.name.toLocaleLowerCase().includes(serachQuery.toLowerCase()) ||
  subscription.category?.toLocaleLowerCase().includes(serachQuery.toLowerCase()) ||
  subscription.plan?.toLowerCase().includes(serachQuery.toLowerCase()));

const Subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={fliterSubscrptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="text-3xl font-bold text-dark mb-5">Subscriptions</Text>
            <TextInput className="bg-card rounded-xl px-4 py-3 text-dark mb-4"
              placeholder="Search Subscptions...."
              placeholderTextColor="#666"
              value={serachQuery}
              onChangeText={setSearchQuery} />
          </View>
        }
        renderItem={({ item }) => (
          <SubscrptionCard {...item}
            expanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)} />
        )}
        contentContainerStyle={{paddingHorizontal:20,paddingBottom:20,gap:12}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  )
}

export default Subscriptions