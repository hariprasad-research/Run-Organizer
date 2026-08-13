import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { formatDuration, useRunQuest } from '@/context/RunQuestContext';

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { runs, profile } = useRunQuest();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR TRAIL SO FAR</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Run history</Text>
      <View style={styles.summaryRow}><View style={[styles.summaryCard, { backgroundColor: colors.primary }]}><Text style={[styles.summaryNumber, { color: colors.primaryForeground }]}>{profile.totalDistance}</Text><Text style={[styles.summaryLabel, { color: colors.primaryForeground }]}>TOTAL KM</Text></View><View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.summaryNumber, { color: colors.foreground }]}>{profile.totalRuns}</Text><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>TOTAL RUNS</Text></View><View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.summaryNumber, { color: colors.foreground }]}>{profile.bestPace}</Text><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>BEST PACE</Text></View></View>
      <Text style={[styles.section, { color: colors.mutedForeground }]}>RECENT RUNS</Text>
      {runs.map((run) => <View key={run.id} style={[styles.run, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.runIcon, { backgroundColor: run.missionCompleted ? colors.primary : colors.secondary }]}><Feather name="activity" size={17} color={run.missionCompleted ? colors.primaryForeground : colors.mutedForeground} /></View><View style={styles.runCopy}><View style={styles.runTop}><Text style={[styles.runDate, { color: colors.foreground }]}>{run.date}</Text>{run.missionCompleted && <View style={[styles.completePill, { backgroundColor: colors.secondary }]}><Text style={[styles.completeText, { color: colors.primary }]}>MISSION CLEAR</Text></View>}</View><Text style={[styles.runStats, { color: colors.mutedForeground }]}>{run.distance.toFixed(1)} KM · {formatDuration(run.time)} · {run.pace} / KM</Text></View><View style={styles.runReward}><Text style={[styles.xp, { color: colors.primary }]}>+{run.xp}</Text><Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>XP</Text></View></View>)}
      <View style={[styles.quote, { borderColor: colors.border }]}><Feather name="message-circle" size={16} color={colors.accent} /><Text style={[styles.quoteText, { color: colors.foreground }]}>Consistency is a superpower. Your next chapter starts with one more step.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 15 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  title: { fontSize: 36, fontWeight: '700', letterSpacing: -1, marginTop: -4, marginBottom: 5 },
  summaryRow: { flexDirection: 'row', gap: 9 },
  summaryCard: { flex: 1, borderRadius: 18, padding: 13, minHeight: 91, justifyContent: 'space-between' },
  summaryNumber: { fontSize: 23, fontWeight: '700' },
  summaryLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.7 },
  section: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3, marginTop: 6 },
  run: { borderWidth: 1, borderRadius: 18, padding: 13, flexDirection: 'row', gap: 11, alignItems: 'center' },
  runIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  runCopy: { flex: 1 },
  runTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  runDate: { fontSize: 13, fontWeight: '700' },
  completePill: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  completeText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  runStats: { fontSize: 11, marginTop: 4 },
  runReward: { alignItems: 'flex-end' },
  xp: { fontSize: 13, fontWeight: '700' },
  xpLabel: { fontSize: 9, fontWeight: '700', marginTop: 1 },
  quote: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 17, padding: 14, marginTop: 6 },
  quoteText: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '500' },
});