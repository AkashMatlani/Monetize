import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
        <Tabs.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
)

export default TabsLayout

