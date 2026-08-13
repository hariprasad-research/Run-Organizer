import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { currentMission, formatDuration, useRunQuest } from '@/context/RunQuestContext';

export default function CompleteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { runs, profile } = useRunQuest();
  const last = runs[0];
  const completed = Boolean(last?.missionCompleted);
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 22 }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.successMark, { backgroundColor: colors.primary }]}><Feather name={completed ? 'check' : 'activity'} size={31} color={colors.primaryForeground} /></View>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{completed ? 'MISSION COMPLETE' : 'RUN LOGGED'}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{completed ? 'You found\nyour next level.' : 'A strong step\nforward.'}</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{completed ? 'The forest route is yours. Mission 08 is now waiting in the distance.' : 'Every run counts. Keep your momentum and your next mission will come into view.'}</Text>
      <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.resultTop}><Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>MISSION {currentMission.id} · {currentMission.title}</Text><Feather name="award" size={20} color={colors.accent} /></View><View style={styles.bigResult}><Text style={[styles.distance, { color: colors.foreground }]}>{last?.distance.toFixed(2) ?? '0.00'}</Text><Text style={[styles.km, { color: colors.mutedForeground }]}>KM</Text></View><View style={styles.resultGrid}><View><Text style={[styles.resultValue, { color: colors.foreground }]}>{last ? formatDuration(last.time) : '00:00'}</Text><Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>TIME</Text></View><View><Text style={[styles.resultValue, { color: colors.foreground }]}>{last?.pace ?? '--:--'}</Text><Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>PACE / KM</Text></View><View><Text style={[styles.resultValue, { color: colors.primary }]}>+{last?.xp ?? 0}</Text><Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>XP EARNED</Text></View></View></View>
      <View style={[styles.nextCard, { backgroundColor: colors.accent }]}><View style={styles.nextIcon}><Feather name="unlock" size={18} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={[styles.nextEyebrow, { color: colors.accentForeground }]}>NEXT ADVENTURE</Text><Text style={[styles.nextTitle, { color: colors.accentForeground }]}>MISSION 08 · Keep Moving</Text><Text style={[styles.nextMeta, { color: colors.accentForeground }]}>Run for 25 minutes · +300 XP</Text></View><Feather name="arrow-up-right" size={20} color={colors.accentForeground} /></View>
      <View style={styles.streak}><Feather name="zap" size={17} color={colors.accent} /><Text style={[styles.streakText, { color: colors.foreground }]}><Text style={{ fontWeight: '700' }}>{profile.streak} day streak.</Text> Tomorrow's adventure is waiting.</Text></View>
      <Pressable testID="back-home-button" onPress={() => router.replace('/home')} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}><Text style={[styles.buttonText, { color: colors.primaryForeground }]}>BACK TO HOME</Text><Feather name="arrow-right" size={18} color={colors.primaryForeground} /></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 15 },
  successMark: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.7, marginTop: 10 },
  title: { fontSize: 42, lineHeight: 43, fontWeight: '700', letterSpacing: -1.3, marginTop: -3 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: -3, marginBottom: 5 },
  resultCard: { borderWidth: 1, borderRadius: 21, padding: 18 },
  resultTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  bigResult: { flexDirection: 'row', alignItems: 'baseline', marginTop: 18 },
  distance: { fontSize: 55, lineHeight: 58, fontWeight: '700', letterSpacing: -2 },
  km: { fontSize: 13, fontWeight: '700', marginLeft: 7 },
  resultGrid: { borderTopWidth: 1, borderTopColor: '#293552', marginTop: 18, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' },
  resultValue: { fontSize: 18, fontWeight: '700' },
  resultMeta: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, marginTop: 4 },
  nextCard: { borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  nextIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#0B1020', alignItems: 'center', justifyContent: 'center' },
  nextEyebrow: { fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  nextTitle: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  nextMeta: { fontSize: 11, opacity: 0.72, marginTop: 3 },
  streak: { flexDirection: 'row', gap: 9, alignItems: 'center', paddingHorizontal: 4 },
  streakText: { fontSize: 13, flex: 1 },
  button: { height: 56, borderRadius: 17, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 2 },
  buttonText: { fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
});