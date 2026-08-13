import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useRunQuest } from '@/context/RunQuestContext';

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasStarted, isHydrated, signIn } = useRunQuest();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isHydrated && hasStarted) router.replace('/home');
  }, [hasStarted, isHydrated, router]);

  if (!isHydrated || hasStarted) {
    return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 18, paddingBottom: insets.bottom + 18 }]}>
      <View style={styles.topline}>
        <View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Feather name="navigation" size={18} color={colors.primaryForeground} /></View>
        <Text style={[styles.brand, { color: colors.foreground }]}>RUNQUEST</Text>
      </View>
      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>THE OUTDOOR ADVENTURE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Every run{'\n'}unlocks a story.</Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>Your real-world miles become missions, XP, and the next reason to head outside.</Text>
        <View style={styles.routePreview}>
          <View style={[styles.routeGlow, { backgroundColor: colors.primary }]} />
          <View style={[styles.routeLine, { borderColor: colors.primary }]} />
          <View style={[styles.routeDot, { backgroundColor: colors.accent }]} />
          <View style={[styles.routeDotSmall, { backgroundColor: colors.primary }]} />
          <Text style={[styles.routeLabel, { color: colors.foreground }]}>MISSION 07</Text>
          <Text style={[styles.routeMeta, { color: colors.mutedForeground }]}>Forest Run · 2.5 KM</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>CHOOSE YOUR RUNNER NAME</Text>
        <TextInput
          testID="username-input"
          value={username}
          onChangeText={setUsername}
          placeholder="e.g. NovaRunner"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
        />
        <Pressable
          testID="begin-button"
          onPress={() => signIn(username)}
          style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>BEGIN YOUR QUEST</Text>
          <Feather name="arrow-right" size={19} color={colors.primaryForeground} />
        </Pressable>
        <Text style={[styles.safeNote, { color: colors.mutedForeground }]}>Run your own pace. Progress is the prize.</Text>
      </View>
      <LinearGradient colors={['transparent', colors.background]} style={styles.bottomFade} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', overflow: 'hidden' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topline: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 13, fontWeight: '700', letterSpacing: 2.4 },
  hero: { marginTop: 40 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: 16 },
  title: { fontSize: 46, lineHeight: 48, fontWeight: '700', letterSpacing: -1.4 },
  body: { fontSize: 16, lineHeight: 24, marginTop: 20, maxWidth: 320 },
  routePreview: { marginTop: 36, height: 116, padding: 18, borderRadius: 24, borderWidth: 1, borderColor: '#293552', overflow: 'hidden' },
  routeGlow: { position: 'absolute', width: 170, height: 170, borderRadius: 170, opacity: 0.06, top: -100, right: -20 },
  routeLine: { position: 'absolute', width: 220, height: 90, borderWidth: 2, borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRadius: 100, transform: [{ rotate: '-15deg' }], right: -36, top: 42 },
  routeDot: { position: 'absolute', width: 11, height: 11, borderRadius: 11, right: 45, top: 45 },
  routeDotSmall: { position: 'absolute', width: 7, height: 7, borderRadius: 7, right: 124, top: 78 },
  routeLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  routeMeta: { marginTop: 9, fontSize: 13 },
  bottom: { zIndex: 2 },
  inputLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3, marginBottom: 9 },
  input: { height: 54, borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, fontSize: 16 },
  primaryButton: { marginTop: 12, height: 56, borderRadius: 16, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonText: { fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
  safeNote: { textAlign: 'center', fontSize: 12, marginTop: 14 },
  bottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 180 },
});