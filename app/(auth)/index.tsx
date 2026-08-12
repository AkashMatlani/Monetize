import { Redirect } from 'expo-router';

export default function AuthIndex() {
  console.log('AuthIndex - redirecting to sign-in');
  return <Redirect href="/(auth)/sign-in" />;
}
