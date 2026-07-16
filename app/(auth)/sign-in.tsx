import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const signIn = () => {
  return (
    <SafeAreaView className='auth-safe-area'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        className='auth-screen'
      >
        <ScrollView
          className='auth-scroll'
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View className='auth-content'>
            {/* Branding */}
            <View className='auth-brand-block'>
              <View className='auth-logo-mark'>
                <Text className='auth-logo-mark-test'>R</Text>
              </View>
              <View>
                <Text className='auth-wordmark'>Recurrly</Text>
                <Text className='auth-wordmark-sub'>SUBSCRIPTION</Text>
              </View>
            </View>
            <Text className='auth-title'>Welcome back</Text>
            <Text className='auth-subtitle'>Sign in to continue your subscription</Text>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signIn