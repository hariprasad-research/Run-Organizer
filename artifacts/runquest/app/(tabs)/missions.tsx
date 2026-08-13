import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { currentMission } from '@/context/RunQuestContext';

const missions = [
  { id: '07', title: 'Forest Run', type: 'DISTANCE', goal: '2.5 KM', reward: '+250 XP', state: 'CURRENT', icon: 'compass' as const },
  { id: '08', title: 'Keep Moving', type: 'TIME', goal: '25 MIN', reward: '+300 XP', state: 'LOCKED', icon: 'clock' as const },
  { id: '09', title: 'Sunrise Scout', type: 'STREAK', goal: '5 DAYS', reward: '+400 XP', state: 'LOCKED', icon: 'sunrise' as const },
  { id: '10', title: 'Fast Lane', type: 'PACE', goal: '5:30 / KM', reward: '+500 XP', state: 'LOCKED', icon: 'wind' as const },
];

export default function MissionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR ADVENTURE MAP</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Missions</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Each one is a small reason to go farther.</Text>
      <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}><View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>COMPLETED THIS WEEK</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>03 <Text style={[styles.summaryTotal, { color: colors.mutedForeground }]}>/ 07</Text></Text></View><View style={styles.summaryRight}><Feather name="trending-up" size={16} color={colors.primary} /><Text style={[styles.summaryGain, { color: colors.primary }]}>+18% XP</Text></View></View>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CURRENT CHAPTER</Text>
      {missions.map((mission) => {
        const isCurrent = mission.state === 'CURRENT';
        return (
          <Pressable key={mission.id} style={[styles.mission, { backgroundColor: isCurrent ? colors.primary : colors.card, borderColor: isCurrent ? colors.primary : colors.border }]}>
            <View style={[styles.missionIcon, { backgroundColor: isCurrent ? colors.primaryForeground : colors.secondary }]}><Feather name={mission.icon} size={19} color={isCurrent ? colors.primary : colors.mutedForeground} /></View>
            <View style={styles.missionCopy}><View style={styles.missionLine}><Text style={[styles.missionId, { color: isCurrent ? colors.primaryForeground : colors.mutedForeground }]}>MISSION {mission.id}</Text><Text style={[styles.missionState, { color: isCurrent ? colors.primaryForeground : colors.mutedForeground }]}>{mission.state}</Text></View><Text style={[styles.missionTitle, { color: isCurrent ? colors.primaryForeground : colors.foreground }]}>{mission.title}</Text><Text style={[styles.missionMeta, { color: isCurrent ? colors.primaryForeground : colors.mutedForeground }]}>{mission.type} · {mission.goal}</Text>{isCurrent && <View style={styles.currentProgress}><View style={[styles.progressTrack, { backgroundColor: 'rgba(11,16,32,0.18)' }]}><View style={[styles.progressFill, { width: `${(currentMission.progress / currentMission.goal) * 100}%`, backgroundColor: colors.primaryForeground }]} /></View><Text style={[styles.progressText, { color: colors.primaryForeground }]}>{currentMission.progress.toFixed(1)} / {currentMission.goal.toFixed(1)} KM</Text></View>}</View><View style={styles.rewardCopy}><Text style={[styles.reward, { color: isCurrent ? colors.primaryForeground : colors.primary }]}>{mission.reward}</Text><Feather name={mission.state === 'LOCKED' ? 'lock' : 'arrow-up-right'} size={16} color={isCurrent ? colors.primaryForeground : colors.mutedForeground} /></View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 14 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  title: { fontSize: 36, fontWeight: '700', letterSpacing: -1, marginTop: -3 },
  subtitle: { fontSize: 15, marginTop: -5, marginBottom: 8 },
  summary: { borderWidth: 1, borderRadius: 19, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  summaryValue: { fontSize: 29, fontWeight: '700', marginTop: 3 },
  summaryTotal: { fontSize: 16, fontWeight: '500' },
  summaryRight: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  summaryGain: { fontSize: 11, fontWeight: '700' },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3, marginTop: 5 },
  mission: { borderWidth: 1, borderRadius: 20, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  missionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  missionCopy: { flex: 1 },
  missionLine: { flexDirection: 'row', justifyContent: 'space-between' },
  missionId: { fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  missionState: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  missionTitle: { fontSize: 18, fontWeight: '700', marginTop: 7 },
  missionMeta: { fontSize: 12, marginTop: 3 },
  rewardCopy: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 55 },
  reward: { fontSize: 11, fontWeight: '700' },
  currentProgress: { marginTop: 13 },
  progressTrack: { height: 5, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { fontSize: 10, marginTop: 5 },
});