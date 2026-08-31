import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthLayout() {
    const { isLoaded, isSignedIn } = useAuth();


    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff9e3' }}>
                <ActivityIndicator size="large" color="#081126" />
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href='/(tabs)' />
    }
    
    
    try {
        return (
            <Stack screenOptions={{ headerShown: false }} />
        );
    } catch (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff9e3', padding: 20 }}>
                <Text style={{ color: '#dc2626', fontSize: 16, textAlign: 'center' }}>
                    Error rendering auth screen: {String(error)}
                </Text>
            </View>
        );
    }
}