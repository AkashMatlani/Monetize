import { useSignIn } from '@clerk/expo';
import { Href, Link, useRouter } from 'expo-router';
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
  const router = useRouter();
  const [code, setCode] = useState('');


  const handleSubmit = async () => {
    if (!formValid) return;

    const { error } = await signIn.password({
      emailAddress,
      password
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(tabs)");

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

    else if (signIn.status === "needs_second_factor") {
      console.log('MFA required')
    }
    else if (signIn.status === "needs_client_trust") {
      //send email code for client trust verification

      const emaildCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emaildCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }

    }
    else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };


  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/(tabs)');

          if (url.startsWith('http')) {
            //only window.location on web platform
            if (typeof window !== "undefined" && window.location) {
              window.location.href = url;
            }
            else {
              router.replace('/(tabs)' as Href)
            }
          }
          else {
            router.replace(url as Href)
          }
        }
      });
    }
    else {
      console.error("Sign-in attempt not complete:", signIn)
    }
  };

  //show verification screen if client trust is needed
  if (signIn.status === "needs_client_trust") {
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
              <View style={{ marginTop: 8, alignItems: 'center' }}>
                <View style={{ marginBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#ea7a53' }}>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff9e3' }}>R</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#081126' }}>Verify your identity</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(0, 0, 0, 0.6)', marginTop: 8 }}>We sent a verification code to your email</Text>
              </View>

              {/* Verification Form */}
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
                      placeholder="000000"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      onChangeText={setCode}
                      keyboardType='number-pad'
                      autoComplete='one-time-code'
                      maxLength={6} />
                    {
                      errors?.fields?.code && (
                        <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>
                          {errors.fields.code.message}
                        </Text>
                      )
                    }
                  </View>
                  
                  <Pressable
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: (!code || fetchStatus === "fetching") ? 'rgba(8, 17, 38, 0.5)' : '#081126',
                      opacity: (!code || fetchStatus === "fetching") ? 0.6 : 1
                    }}
                    onPress={handleVerify}
                    disabled={!code || fetchStatus === "fetching"}
                  >
                    <Text style={{ textAlign: 'center', color: '#fff9e3', fontSize: 16, fontWeight: '600' }}>
                      {fetchStatus === "fetching" ? "Verifying.." : "Verify"}
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
                    onPress={() => signIn.mfa.sendEmailCode()}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text style={{ textAlign: 'center', color: '#081126', fontSize: 14, fontWeight: '600' }}>Resend code</Text>
                  </Pressable>

                  <Pressable
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    }}
                    onPress={() => signIn.reset()}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text style={{ textAlign: 'center', color: '#081126', fontSize: 14, fontWeight: '600' }}>Start Over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff9e3' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: '#fff9e3' }}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}>
            {/* Branding */}
            <View style={{ marginTop: 8, alignItems: 'center' }}>
              <View style={{ marginBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#ea7a53' }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff9e3' }}>R</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 30, fontWeight: '800', color: '#081126' }}>Recurrly</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#081126' }}>SUBSCRIPTION</Text>
                </View>
              </View>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#081126' }}>Welcome back</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(0, 0, 0, 0.6)', marginTop: 8 }}>Sign in to continue your subscription</Text>
            </View>

            {/* Sign in Form */}
            <View style={{ marginTop: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', padding: 16 }}>
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
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType='email-address'
                    autoComplete='email'
                  />
                  {emailTouched && !emailValid && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>Please enter a valid email address</Text>
                  )}
                  {errors?.fields?.identifier && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{errors.fields.identifier.message}</Text>
                  )}
                </View>

                <View>
                  <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#081126' }}>Password</Text>
                  <TextInput
                    style={{
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: passWordTouched && !passwordValid ? '#dc2626' : 'rgba(0, 0, 0, 0.1)',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      backgroundColor: '#fff8e7'
                    }}
                    value={password}
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    placeholder="Enter your password"
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => setPassWordTouched(true)}
                    autoComplete='password'
                  />
                  {passWordTouched && !passwordValid && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>Password is required</Text>
                  )}
                  {errors?.fields?.password && (
                    <Text style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{errors.fields.password.message}</Text>
                  )}
                </View>

                <Pressable
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: (!formValid || fetchStatus === "fetching") ? 'rgba(8, 17, 38, 0.5)' : '#081126',
                    opacity: (!formValid || fetchStatus === "fetching") ? 0.6 : 1
                  }}
                  disabled={!formValid || fetchStatus === "fetching"}
                  onPress={handleSubmit}>
                  <Text style={{ textAlign: 'center', color: '#fff9e3', fontSize: 16, fontWeight: '600' }}>
                    {fetchStatus === "fetching" ? 'Signing In...' : 'Sign in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-up Link */}
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
              <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.6)' }}>Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#ea7a53' }}>Create Account</Text>
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