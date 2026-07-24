import { useSignUp } from '@clerk/expo';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const SignUp = () => {

  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);

  // Client-side validation
  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  // Signup form
  return (
    <View className='auth-card'>
      <View className='auth-form'>
        <View className='auth-field'>
          <Text className='auth-label'>Email Address</Text>
          <TextInput
            className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
            autoCapitalize='none'
            value={emailAddress}
            placeholder='name@example.com'
            placeholderTextColor='rgba(0,0,0,0.4)'
            onChangeText={setEmailAddress}
            onBlur={() => setEmailTouched(true)}
            keyboardType='email-address'
            autoComplete='email'
          ></TextInput>
          {emailTouched && !emailValid && (
            <Text className='auth-error'>Please enter a valid email address</Text>
          )}
          {errors.fields.emailAddress && (
            <Text className='auth-error'>{errors.fields.emailAddress.message}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default SignUp