import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useRunQuest } from '@/context/RunQuestContext';

const steps = [
  { title: "What's your current running experience?", options: ['Completely new', 'Mostly walk', 'Jog sometimes', 'Run regularly', 'Athlete'], icon: 'activity' as const },
  { title: 'What do you want to achieve?', options: ['Start running', 'Improve fitness', 'Become faster', 'Run longer distances', 'Train for competitions', 'Train for a marathon', 'Play and explore'], icon: 'target' as const },
  { title: 'How do you want to play?', options: ['Explorer', 'Challenger', 'Speed Runner', 'Consistency Builder', 'Athlete'], icon: 'compass' as const },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const { initializeNewRunner } = useRunQuest();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([[], [], []]);
  const [saving, setSaving] = useState(false);
  const current = steps[step];

  const toggle = (option: string) => {
    setAnswers((previous) => previous.map((value, index) => {
      if (index !== step) return value;
      if (step === 1) return value.includes(option) ? value.filter((item) => item !== option) : [...value, option];
      return [option];
    }));
  };

  const next = async () => {
    if (!answers[step].length) return;
    if (step < steps.length - 1) return setStep((value) => value + 1);
    setSaving(true);
    const pending = await AsyncStorage.getItem('@runquest/pending-profile');
    const profile = pending ? JSON.parse(pending) as { displayName?: string; username?: string } : {};
    const metadata = { displayName: profile.displayName ?? user?.firstName ?? 'Runner', username: profile.username ?? user?.username ?? 'NovaRunner', runningExperience: answers[0][0], goals: answers[1], adventureStyle: answers[2][0], level: 1, xp: 0, coins: 0, totalDistance: 0, totalRuns: 0, bestPace: '--:--', currentStreak: 0, onboardingCompleted: true, updatedAt: new Date().toISOString() };
    try {
      await (user as unknown as { update: (params: { firstName?: string; unsafeMetadata: Record<string, unknown> }) => Promise<unknown> }).update({ firstName: metadata.displayName, unsafeMetadata: metadata });
      await AsyncStorage.removeItem('@runquest/pending-profile');
      await initializeNewRunner(metadata.username);
      router.replace('/first-mission' as never);
    } finally {
      setSaving(false);
    }
  };

  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><Text style={[styles.step, { color: colors.primary }]}>STEP {step + 1} OF 3</Text><View style={styles.progressRow}>{steps.map((_, index) => <View key={index} style={[styles.progressDot, { backgroundColor: index <= step ? colors.primary : colors.secondary }]} />)}</View></View>
    <View style={[styles.icon, { backgroundColor: colors.primary }]}><Feather name={current.icon} size={22} color={colors.primaryForeground} /></View>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>BUILD YOUR RUNNER</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>{current.title}</Text>
    <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{step === 0 ? 'There is no wrong starting point.' : step === 1 ? 'Your missions will reflect what motivates you.' : 'This sets the feeling of your adventure.'}</Text>
    <View style={styles.options}>{current.options.map((option) => {
      const selected = answers[step].includes(option);
      return <Pressable key={option} onPress={() => toggle(option)} style={[styles.option, { backgroundColor: selected ? colors.primary : colors.card, borderColor: selected ? colors.primary : colors.border }]}><Text style={[styles.optionText, { color: selected ? colors.primaryForeground : colors.foreground }]}>{option}</Text><View style={[styles.radio, { borderColor: selected ? colors.primaryForeground : colors.border, backgroundColor: selected ? colors.primaryForeground : 'transparent' }]}>{selected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}</View></Pressable>;
    })}</View>
    <Pressable onPress={next} disabled={!answers[step].length || saving} style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: !answers[step].length || saving || pressed ? 0.65 : 1 }]}><Text style={[styles.buttonText, { color: colors.accentForeground }]}>{step === 2 ? 'START MY ADVENTURE' : 'CONTINUE'}</Text>{saving ? <ActivityIndicator color={colors.accentForeground} /> : <Feather name="arrow-right" size={18} color={colors.accentForeground} />}</Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 12 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  step: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  progressRow: { flexDirection: 'row', gap: 5 },
  progressDot: { width: 25, height: 4, borderRadius: 4 },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', letterSpacing: -0.8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 9 },
  options: { gap: 9 },
  option: { minHeight: 55, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { fontSize: 14, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 8 },
  button: { minHeight: 56, borderRadius: 17, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  buttonText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
});