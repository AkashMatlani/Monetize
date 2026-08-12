import { useAuth, useSignUp } from '@clerk/expo';
import { Href, Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();

  const { isSignedIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Client-side validation
  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;

  const formValid = emailAddress.length >= 0 && password.length >= 8 && emailValid;

  const [code, setCode] = useState('');
  const handleSubmit = async () => {

    if (!formValid) return;
    const { error } = await signUp.password({
      emailAddress,
      password
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    //send verification email
    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/tabs");

          if (url.startsWith('http')) {
            if (typeof window !== "undefined" && window.location) {
              window.location.href = url;
            }
            else {
              router.replace("/(tabs)" as Href)
            }
          }
          else {
            router.replace(url as Href)
          }
        }
      });
    }
    else {
      console.error('Sign up attempt not complete', signUp)
    }
  };

  //Don't show anything if alreday signed in or sign-up complete

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  //show verification screen if email needs verification
  if (signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff9e3' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? 'padding' : "height"}
          style={{ flex: 1, backgroundColor: '#fff9e3' }}
        >
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}>
              {/* Branding */}
              <View style={{ marginTop: 8, alignItems: 'center' }}>
                <View style={{ marginBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#ea7a53' }}>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff9e3' }}>R</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#081126' }}>Verify your email</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(0, 0, 0, 0.6)', marginTop: 8 }}>We sent a verification code to {emailAddress}</Text>
              </View>

              {/* Verification form */}
              <View style={{ marginTop: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', padding: 16 }}>
                <View style={{ gap: 16 }}>
                  <View>
                    <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#081126' }}>Verification Code</Text>
                    <TextInput
                      style={{
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        fontSize: 16,
                        backgroundColor: '#fff8e7'
                      }}
                      value={code}
                      placeholder='000000'
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      onChangeText={setCode}
                      keyboardType='number-pad'
                      autoComplete='one-time-code'
                      maxLength={6}
                    />
                    {errors.fields.code && (
                      <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{errors.fields.code.message}</Text>
                    )}
                  </View>

                  <Pressable
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: (!code || fetchStatus === 'fetching') ? 'rgba(8, 17, 38, 0.5)' : '#081126',
                      opacity: (!code || fetchStatus === 'fetching') ? 0.6 : 1
                    }}
                    onPress={handleVerify}
                    disabled={!code || fetchStatus === 'fetching'}
                  >
                    <Text style={{ textAlign: 'center', color: '#fff9e3', fontSize: 16, fontWeight: '600' }}>
                      {fetchStatus === "fetching" ? 'Verifying...' : 'Verify Email'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    }}
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text style={{ textAlign: 'center', color: '#081126', fontSize: 14, fontWeight: '600' }}>Resend Code</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }


  // Signup form
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff9e3' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: '#fff9e3' }}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}>
            {/* Branding */}
            <View style={{ marginTop: 8, alignItems: 'center', marginBottom: 32 }}>
              <View style={{ marginBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#ea7a53' }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff9e3' }}>R</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 30, fontWeight: '800', color: '#081126' }}>Recurrly</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#081126' }}>SUBSCRIPTION</Text>
                </View>
              </View>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#081126' }}>Create Account</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(0, 0, 0, 0.6)', marginTop: 8 }}>Sign up to manage your subscriptions</Text>
            </View>

            {/* Signup Form */}
            <View style={{ borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', padding: 16 }}>
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#081126' }}>Email Address</Text>
                  <TextInput
                    style={{
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: emailTouched && !emailValid ? '#dc2626' : 'rgba(0, 0, 0, 0.1)',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      backgroundColor: '#fff8e7'
                    }}
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='name@example.com'
                    placeholderTextColor='rgba(0,0,0,0.4)'
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType='email-address'
                    autoComplete='email'
                  />
                  {emailTouched && !emailValid && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>Please enter a valid email address</Text>
                  )}
                  {errors.fields.emailAddress && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{errors.fields.emailAddress.message}</Text>
                  )}
                </View>

                <View>
                  <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#081126' }}>Password</Text>
                  <TextInput
                    style={{
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: passwordTouched && !passwordValid ? '#dc2626' : 'rgba(0, 0, 0, 0.1)',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      backgroundColor: '#fff8e7'
                    }}
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Create a strong password'
                    placeholderTextColor='rgba(0,0,0,0.4)'
                    secureTextEntry
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete='password-new'
                  />
                  {passwordTouched && !passwordValid && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>Password must be at least 8 characters</Text>
                  )}
                  {errors.fields.password && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{errors.fields.password.message}</Text>
                  )}
                  {!passwordTouched && (
                    <Text style={{ marginTop: 4, color: 'rgba(0, 0, 0, 0.6)', fontSize: 12 }}>Minimum 8 characters required</Text>
                  )}
                </View>

                <Pressable
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: (!formValid || fetchStatus === 'fetching') ? 'rgba(8, 17, 38, 0.5)' : '#081126',
                    opacity: (!formValid || fetchStatus === 'fetching') ? 0.6 : 1
                  }}
                  onPress={handleSubmit}
                  disabled={!formValid || fetchStatus === "fetching"}
                >
                  <Text style={{ textAlign: 'center', color: '#fff9e3', fontSize: 16, fontWeight: '600' }}>
                    {fetchStatus === 'fetching' ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign in Link */}
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
              <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.6)' }}>Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#ea7a53' }}>Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUp