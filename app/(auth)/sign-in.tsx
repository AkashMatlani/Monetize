import { useSignIn } from '@clerk/expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  //client side validation
  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length > 0;
  //validation state
  const [emailTouched, setEmailTouched] = useState(false);
  const [passWordTouched, setPassWordTouched] = useState(false);
  const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

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
                {errors?.fields?.identifier && (
                  <Text className='auth-error'>{errors.fields.identifier.message}</Text>
                )}
              </View>

              <View className='auth-field'>
                <Text className='auth-label'>Password</Text>
                <TextInput
                  className={`auth-input ${passWordTouched && !passwordValid && 'auth-input-error'}`}
                  value={password}
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  placeholder="Enter your password"
                  secureTextEntry
                  onChangeText={setPassword}
                  onBlur={() => setPassWordTouched(true)}
                  autoComplete='password'
                />
                {passWordTouched && !passwordValid && (
                  <Text className='auth-error'>
                    Password is required
                  </Text>
                )}

                {errors?.fields?.password && (
                  <Text className='auth-error'>{errors.fields.password.message}</Text>
                )}
                
                <Pressable
                  className={`auth-button ${(!formValid || fetchStatus === "fetching") && 'auth-button-disabled'}`}
                  disabled={!formValid || fetchStatus === "fetching"}>
                  <Text className='auth-button-text'>
                    {fetchStatus === "fetching" ? 'Signing In...' : 'Sign in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-up Link */}
            <View className='auth-link-row'>
              <Text className='auth-link-copy'>Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className='auth-link'>Create Account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignIn