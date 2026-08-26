import images from "@/constants/images";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from '@expo/vector-icons';
import { styled } from "nativewind";
import React from 'react';
import { Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };

  const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || "User";
  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-semibold text-primary mb-6">Settings</Text>

      {/* User Profile Section */}
      <View className="auth-card mb-5">
        <View className="flex-row items-center gap-4 mb-4">
          <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full">
          </Image>
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">{displayName}</Text>
            {email && (<Text className="text-sm font-sans-medium text-muted-foreground">{email}</Text>
            )}
          </View>
        </View>
      </View>
      <Ionicons name="log-out" size={24} onPress={() => signOut()} />
    </SafeAreaView>
  )
}

export default Settings