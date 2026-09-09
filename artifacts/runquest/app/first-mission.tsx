import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export default function FirstMissionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 18, paddingBottom: insets.bottom + 18 }]}>
    <View style={styles.top}><View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Feather name="navigation" size={18} color={colors.primaryForeground} /></View><Text style={[styles.brand, { color: colors.foreground }]}>RUNQUEST</Text></View>
    <View style={styles.hero}><View style={[styles.missionIcon, { backgroundColor: colors.primary }]}><Feather name="flag" size={27} color={colors.primaryForeground} /></View><Text style={[styles.eyebrow, { color: colors.primary }]}>MISSION 01</Text><Text style={[styles.title, { color: colors.foreground }]}>THE FIRST STEP</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Walk, jog or run.{'\n'}Your adventure begins here.</Text><View style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View><Text style={[styles.goalLabel, { color: colors.mutedForeground }]}>GOAL</Text><Text style={[styles.goal, { color: colors.foreground }]}>Complete 1 KM</Text></View><View style={styles.reward}><Text style={[styles.rewardValue, { color: colors.primary }]}>+100 XP</Text><Text style={[styles.rewardValue, { color: colors.accent }]}>+50 COINS</Text></View></View></View>
    <View><Text style={[styles.safety, { color: colors.mutedForeground }]}>Start when you feel ready. Stay aware of your surroundings and stop if you feel pain or unwell.</Text><Pressable testID="start-first-mission" onPress={() => router.replace('/run')} style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }]}><Text style={[styles.buttonText, { color: colors.accentForeground }]}>START MISSION</Text><Feather name="arrow-up-right" size={20} color={colors.accentForeground} /></Pressable><Pressable onPress={() => router.replace('/home')} style={styles.skip}><Text style={[styles.skipText, { color: colors.mutedForeground }]}>I'LL EXPLORE FIRST</Text></Pressable></View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 13, fontWeight: '700', letterSpacing: 2.4 },
  hero: { marginTop: 20 },
  missionIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.7 },
  title: { fontSize: 40, lineHeight: 43, fontWeight: '700', letterSpacing: -1.1, marginTop: 5 },
  subtitle: { fontSize: 17, lineHeight: 25, marginTop: 16 },
  goalCard: { marginTop: 35, borderWidth: 1, borderRadius: 21, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  goal: { fontSize: 22, fontWeight: '700', marginTop: 5 },
  reward: { alignItems: 'flex-end', gap: 7 },
  rewardValue: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  safety: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  button: { minHeight: 58, borderRadius: 17, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttonText: { fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
  skip: { alignItems: 'center', paddingVertical: 14 },
  skipText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});