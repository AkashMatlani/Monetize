import { icons } from '@/constants/icons';
import images from '@/constants/images';
import '@/global.css';
import { formatCurrency } from '@/lib/utills';
import dayjs from "dayjs";
import { styled } from "nativewind";
import { Image, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className='home-header'>
        <View className='home-user'>
          <Image source={images.avatar} className='home-avatar' />
          <Text className='home-user-name'>Akash Matlani</Text>
        </View>
        <Image source={icons.add} className='home-add-icon'/>
      </View>
      <View className='home-balance-card'>
        <Text className='home-balance-label'>Balance</Text>

        <View className='home-balance-row'>
          <Text className='home-balance-amount'>{formatCurrency(2489.48)}</Text>
          <Text className='home-balance-date'>{dayjs("2026-03-18T09:00:00.000Z").format('MM/DD')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}