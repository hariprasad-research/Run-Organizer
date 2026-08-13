import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { currentMission, useRunQuest } from '@/context/RunQuestContext';

function ProgressBar({ progress, color, track }: { progress: number; color: string; track: string }) {
  return <View style={[styles.progressTrack, { backgroundColor: track }]}><View style={[styles.progressFill, { backgroundColor: color, width: `${Math.min(progress, 1) * 100}%` }]} /></View>;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useRunQuest();
  const xpInLevel = profile.xp % 500;
  const xpProgress = xpInLevel / 500;
  const missionProgress = currentMission.progress / currentMission.goal;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>GOOD MORNING,</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{profile.username}</Text>
        </View>
        <Pressable testID="profile-button" onPress={() => router.push('/profile')} style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={[styles.avatarText, { color: colors.accentForeground }]}>{profile.username.slice(0, 1).toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={[styles.levelCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.levelTop}>
          <View>
            <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>CURRENT LEVEL</Text>
            <View style={styles.levelRow}><Text style={[styles.levelNumber, { color: colors.foreground }]}>{String(profile.level).padStart(2, '0')}</Text><Text style={[styles.levelName, { color: colors.primary }]}>EXPLORER</Text></View>
          </View>
          <View style={styles.xpValue}><Text style={[styles.xpNumber, { color: colors.foreground }]}>{profile.xp.toLocaleString()}</Text><Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>TOTAL XP</Text></View>
        </View>
        <ProgressBar progress={xpProgress} color={colors.primary} track={colors.secondary} />
        <View style={styles.levelBottom}><Text style={[styles.levelHint, { color: colors.mutedForeground }]}>{500 - xpInLevel} XP to level {profile.level + 1}</Text><Text style={[styles.levelHint, { color: colors.primary }]}>{Math.round(xpProgress * 100)}%</Text></View>
      </View>

      <View style={styles.sectionTitleRow}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>TODAY'S MISSION</Text><Pressable onPress={() => router.push('/missions')}><Text style={[styles.link, { color: colors.primary }]}>VIEW ALL</Text></Pressable></View>
      <View style={[styles.missionCard, { backgroundColor: colors.primary }]}>
        <View style={styles.missionHeader}><View style={[styles.missionIcon, { backgroundColor: colors.primaryForeground }]}><Feather name="compass" size={20} color={colors.primary} /></View><View style={styles.missionTag}><Text style={[styles.missionTagText, { color: colors.primaryForeground }]}>MISSION {currentMission.id}</Text><Feather name="more-horizontal" size={17} color={colors.primaryForeground} /></View></View>
        <Text style={[styles.missionTitle, { color: colors.primaryForeground }]}>{currentMission.title}</Text>
        <Text style={[styles.missionSubtitle, { color: colors.primaryForeground }]}>{currentMission.subtitle}</Text>
        <View style={styles.missionStats}><View><Text style={[styles.missionDistance, { color: colors.primaryForeground }]}>{currentMission.progress.toFixed(1)} <Text style={styles.missionUnit}>/ {currentMission.goal.toFixed(1)} KM</Text></Text><ProgressBar progress={missionProgress} color={colors.primaryForeground} track="rgba(11,16,32,0.18)" /></View><View style={styles.reward}><Text style={[styles.rewardValue, { color: colors.primaryForeground }]}>+{currentMission.rewardXp}</Text><Text style={[styles.rewardLabel, { color: colors.primaryForeground }]}>XP REWARD</Text></View></View>
      </View>

      <Pressable testID="start-run-button" onPress={() => router.push('/run')} style={({ pressed }) => [styles.startButton, { backgroundColor: colors.accent, opacity: pressed ? 0.82 : 1 }]}>
        <View style={[styles.startIcon, { backgroundColor: colors.accentForeground }]}><Feather name="play" size={17} color={colors.accent} /></View><Text style={[styles.startText, { color: colors.accentForeground }]}>START RUN</Text><Feather name="arrow-up-right" size={20} color={colors.accentForeground} />
      </Pressable>

      <View style={styles.statsRow}><View style={[styles.stat, { borderColor: colors.border }]}><Feather name="zap" size={16} color={colors.accent} /><Text style={[styles.statValue, { color: colors.foreground }]}>{profile.streak}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>DAY STREAK</Text></View><View style={[styles.stat, { borderColor: colors.border }]}><Feather name="map" size={16} color={colors.primary} /><Text style={[styles.statValue, { color: colors.foreground }]}>{profile.totalDistance}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>TOTAL KM</Text></View><View style={[styles.stat, { borderColor: colors.border }]}><Feather name="award" size={16} color={colors.primary} /><Text style={[styles.statValue, { color: colors.foreground }]}>{profile.totalRuns}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>RUNS</Text></View></View>

      <View style={[styles.unlock, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.unlockIcon, { backgroundColor: colors.secondary }]}><Feather name="lock" size={15} color={colors.mutedForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.unlockEyebrow, { color: colors.mutedForeground }]}>NEXT UNLOCK</Text><Text style={[styles.unlockTitle, { color: colors.foreground }]}>Night Runner badge</Text></View><Text style={[styles.unlockXp, { color: colors.primary }]}>260 XP</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  greeting: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  name: { fontSize: 27, fontWeight: '700', letterSpacing: -0.5, marginTop: 4 },
  avatar: { width: 43, height: 43, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '700' },
  levelCard: { borderWidth: 1, borderRadius: 21, padding: 18 },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  cardEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  levelRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 },
  levelNumber: { fontSize: 38, fontWeight: '700', letterSpacing: -1 },
  levelName: { fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  xpValue: { alignItems: 'flex-end' },
  xpNumber: { fontSize: 19, fontWeight: '700' },
  xpLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.1, marginTop: 3 },
  progressTrack: { height: 7, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  levelBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  levelHint: { fontSize: 11 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  link: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  missionCard: { borderRadius: 23, padding: 19 },
  missionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  missionTag: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  missionTagText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  missionTitle: { fontSize: 28, fontWeight: '700', marginTop: 18, letterSpacing: -0.8 },
  missionSubtitle: { fontSize: 13, opacity: 0.75, marginTop: 2 },
  missionStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 22 },
  missionDistance: { fontSize: 24, fontWeight: '700' },
  missionUnit: { fontSize: 12, fontWeight: '500' },
  reward: { alignItems: 'flex-end' },
  rewardValue: { fontSize: 19, fontWeight: '700' },
  rewardLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, opacity: 0.7, marginTop: 2 },
  startButton: { height: 60, borderRadius: 19, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 13 },
  startIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  startText: { flex: 1, fontSize: 13, fontWeight: '700', letterSpacing: 1.3 },
  statsRow: { flexDirection: 'row', gap: 9 },
  stat: { flex: 1, minHeight: 100, borderWidth: 1, borderRadius: 18, padding: 13, justifyContent: 'space-between' },
  statValue: { fontSize: 24, fontWeight: '700', marginTop: 7 },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  unlock: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 18, padding: 13 },
  unlockIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  unlockEyebrow: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  unlockTitle: { fontSize: 14, fontWeight: '600', marginTop: 3 },
  unlockXp: { fontSize: 12, fontWeight: '700' },
});