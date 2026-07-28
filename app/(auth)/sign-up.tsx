import { useSignUp } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

const SignUp = () => {

  const posthog = usePostHog();

  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Client-side validation
  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;

  const formValid = emailAddress.length >= 0 && password.length >= 8 && emailValid;

  const handleSubmit = async () => {

    if (!formValid) return;
    const { error } = await signUp.password({
      emailAddress,
      password
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      posthog.capture('user_sign_up_failed', {
        error_message: error.message,
      });
      return;
    }

    //send verification email
    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

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

        <View className='auth-field'>
          <Text className='auth-label'>Password</Text>
          <TextInput
            className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
            value={password}
            onChangeText={setPassword}
            placeholder='Create a strong password'
            placeholderTextColor='rgba(0,0,0,0.4)'
            secureTextEntry
            onBlur={() => setPasswordTouched(true)}
            autoComplete='password-new'
          ></TextInput>
          {passwordTouched && !passwordValid && (
            <Text className='auth-error'>Password must be at least 8 characters</Text>
          )}
          {errors.fields.password && (
            <Text className='auth-error'>{errors.fields.password.message}</Text>
          )}
          {!passwordTouched && (
            <Text className='auth-helper'>Minimum 8 characters required</Text>
          )}
        </View>
        <Pressable
          className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
          onPress={handleSubmit}
          disabled={!formValid || fetchStatus === "fetching"}
        ></Pressable>
      </View>
    </View>
  )
}

export default SignUp