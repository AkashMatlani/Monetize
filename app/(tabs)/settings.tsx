import { useAuth } from "@clerk/expo";
import { Ionicons } from '@expo/vector-icons';
import { styled } from "nativewind";
import React from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
const SafeAreaView = styled(RNSafeAreaView);

const {signOut}=useAuth();

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Ionicons name="log-out" size={24} onPress={()=>signOut()} />
    </SafeAreaView>
  )
}

export default Settings