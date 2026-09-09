import { useSignIn, useSignUp } from '@clerk/expo';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSignUp = mode !== 'signin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'password'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const loading = signInStatus === 'fetching' || signUpStatus === 'fetching';

  const title = isSignUp ? 'Create Your Runner' : 'Welcome Back, Runner';
  const submitLabel = isSignUp ? 'CREATE ACCOUNT' : 'START RUNNING';
  const passwordHint = useMemo(() => {
    if (!isSignUp || password.length === 0) return '';
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) ? 'Strong password' : 'Use 8+ characters, one uppercase letter, and one number';
  }, [isSignUp, password]);

  const submit = async () => {
    setError('');
    if (!email.trim() || !password) return setError('Email and password are required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (isSignUp) {
      if (!displayName.trim() || !username.trim()) return setError('Display name and username are required.');
      if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) return setError('Choose a stronger password with 8+ characters, an uppercase letter, and a number.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
      const payload = { emailAddress: email.trim(), password, username: username.trim(), firstName: displayName.trim() } as Parameters<typeof signUp.password>[0];
      const result = await signUp.password(payload);
      if (result.error) return setError(result.error.message);
      await AsyncStorage.setItem('@runquest/pending-profile', JSON.stringify({ displayName: displayName.trim(), username: username.trim() }));
      await signUp.verifications.sendEmailCode();
      setStep('verify');
      return;
    }
    const result = await signIn.password({ emailAddress: email.trim(), password });
    if (result.error) return setError(result.error.message);
    if (signIn.status === 'complete') {
      await signIn.finalize();
      router.replace('/');
    } else {
      setError('This account needs an additional verification step.');
    }
  };

  const verify = async () => {
    setError('');
    if (!code.trim()) return setError('Enter the verification code from your email.');
    const result = await signUp.verifications.verifyEmailCode({ code: code.trim() });
    if (result.error) return setError(result.error.message);
    if (signUp.status === 'complete') {
      await signUp.finalize();
      router.replace('/onboarding' as never);
    } else {
      setError('The verification is not complete yet. Check the code and try again.');
    }
  };

  const beginPasswordReset = async () => {
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter the email on your account first.');
    const created = await signIn.create({ identifier: email.trim() });
    if (created.error) return setError(created.error.message);
    const sent = await signIn.resetPasswordEmailCode.sendCode();
    if (sent.error) return setError(sent.error.message);
    setForgotStep('code');
  };

  const verifyPasswordResetCode = async () => {
    setError('');
    const result = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
    if (result.error) return setError(result.error.message);
    setForgotStep('password');
  };

  const finishPasswordReset = async () => {
    setError('');
    if (newPassword.length < 8 || newPassword !== newPasswordConfirmation) return setError('Use a matching password with at least 8 characters.');
    const result = await signIn.resetPasswordEmailCode.submitPassword({ password: newPassword });
    if (result.error) return setError(result.error.message);
    if (signIn.status === 'complete') {
      await signIn.finalize();
      router.replace('/');
    } else {
      setError('Password reset needs one more verification step.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.card }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable>
        <View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Feather name="navigation" size={18} color={colors.primaryForeground} /></View>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>{isSignUp ? 'JOIN THE ADVENTURE' : 'YOUR NEXT CHAPTER'}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{step === 'verify' ? 'Check your email' : title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{step === 'verify' ? `We sent a verification code to ${email}.` : isSignUp ? 'Your real-world running journey starts here.' : 'Your missions are waiting.'}</Text>
        {forgotMode ? (
          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>{forgotStep === 'email' ? 'ACCOUNT EMAIL' : forgotStep === 'code' ? 'RESET CODE' : 'NEW PASSWORD'}</Text>
            {forgotStep === 'email' && <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />}
            {forgotStep === 'code' && <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />}
            {forgotStep === 'password' && <><TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="New password" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} /><TextInput value={newPasswordConfirmation} onChangeText={setNewPasswordConfirmation} secureTextEntry placeholder="Repeat new password" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} /></>}
            {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
            <Pressable onPress={forgotStep === 'email' ? beginPasswordReset : forgotStep === 'code' ? verifyPasswordResetCode : finishPasswordReset} disabled={loading} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.65 : 1 }]}><Text style={[styles.buttonText, { color: colors.primaryForeground }]}>{forgotStep === 'email' ? 'SEND RESET CODE' : forgotStep === 'code' ? 'VERIFY CODE' : 'UPDATE PASSWORD'}</Text>{loading ? <ActivityIndicator color={colors.primaryForeground} /> : <Feather name="arrow-right" size={18} color={colors.primaryForeground} />}</Pressable>
            <Pressable onPress={() => { setForgotMode(false); setForgotStep('email'); setError(''); }}><Text style={[styles.link, { color: colors.primary }]}>BACK TO LOG IN</Text></Pressable>
          </View>
        ) : step === 'verify' ? (
          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>VERIFICATION CODE</Text>
            <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
            <Pressable onPress={verify} disabled={loading} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.65 : 1 }]}><Text style={[styles.buttonText, { color: colors.primaryForeground }]}>VERIFY EMAIL</Text>{loading ? <ActivityIndicator color={colors.primaryForeground} /> : <Feather name="check" size={18} color={colors.primaryForeground} />}</Pressable>
            <Pressable onPress={() => signUp.verifications.sendEmailCode()}><Text style={[styles.link, { color: colors.primary }]}>Send a new code</Text></Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            {isSignUp && <><Field label="DISPLAY NAME" value={displayName} onChangeText={setDisplayName} placeholder="How should we call you?" colors={colors} /><Field label="USERNAME" value={username} onChangeText={setUsername} placeholder="Your unique runner name" colors={colors} autoCapitalize="none" /> </>}
            <Field label="EMAIL" value={email} onChangeText={setEmail} placeholder="you@example.com" colors={colors} keyboardType="email-address" autoCapitalize="none" />
            <Field label="PASSWORD" value={password} onChangeText={setPassword} placeholder="Your password" colors={colors} secureTextEntry />
            {isSignUp && <><Field label="CONFIRM PASSWORD" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat your password" colors={colors} secureTextEntry /><Text style={[styles.passwordHint, { color: passwordHint === 'Strong password' ? colors.primary : colors.mutedForeground }]}>{passwordHint}</Text></>}
            {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
            <Pressable testID="auth-submit" onPress={submit} disabled={loading} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.65 : 1 }]}><Text style={[styles.buttonText, { color: colors.primaryForeground }]}>{submitLabel}</Text>{loading ? <ActivityIndicator color={colors.primaryForeground} /> : <Feather name="arrow-right" size={18} color={colors.primaryForeground} />}</Pressable>
            {!isSignUp && <Pressable onPress={() => { setForgotMode(true); setError(''); }}><Text style={[styles.link, { color: colors.primary }]}>FORGOT PASSWORD?</Text></Pressable>}
          </View>
        )}
        {!!error && step === 'verify' && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
        <Pressable onPress={() => router.replace((`/auth?mode=${isSignUp ? 'signin' : 'signup'}`) as never)} style={styles.switcher}><Text style={[styles.switchText, { color: colors.mutedForeground }]}>{isSignUp ? 'Already have an account?' : "Don't have an account?"} </Text><Text style={[styles.link, { color: colors.primary }]}>{isSignUp ? 'LOG IN' : 'CREATE ACCOUNT'}</Text></Pressable>
        {isSignUp && <View nativeID="clerk-captcha" />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, placeholder, colors, ...props }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; colors: ReturnType<typeof useColors>; [key: string]: unknown }) {
  return <View style={styles.field}><Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text><TextInput {...props} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} /></View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 12 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  brandMark: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, marginTop: 13 },
  title: { fontSize: 36, lineHeight: 40, fontWeight: '700', letterSpacing: -1, marginTop: 1 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  form: { gap: 12 },
  field: { gap: 7 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  input: { height: 53, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, fontSize: 15 },
  passwordHint: { fontSize: 11, marginTop: -3 },
  error: { fontSize: 12, lineHeight: 18 },
  primaryButton: { minHeight: 56, borderRadius: 17, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  buttonText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  link: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textAlign: 'center', paddingVertical: 8 },
  switcher: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  switchText: { fontSize: 12 },
});