import { useSignIn } from '@clerk/expo';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const signIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');

  //client side validation
  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);

  //validation state
  const [emailTouched, setEmailTouched] = useState(false);
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

          {/* Sign in Form */}
          <View className='auth-card'>
            <View className='auth-form'>
              <View className='auth-field'>
                <Text className='auth-label'>Email Address</Text>
                <TextInput
                  className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                  autoCapitalize='none'
                  value={emailAddress}
                  placeholder='name@example.com'
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={setEmailAddress}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType='email-address'
                  autoComplete='email'
                ></TextInput>
                {emailTouched && !emailValid && (
                  <Text className='auth-error'>Please enter a valid email address</Text>
                )}
                {errors.fields.identifier && (
                  <Text className='auth-error'>{errors.fields.identifier.message}</Text>
                )}
              </View>
              <View>
              </View>
            </View>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signIn