import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useRunQuest } from '@/context/RunQuestContext';
import { useClerk, useUser } from '@clerk/expo';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, resetProgress } = useRunQuest();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const achievements = [{ icon: 'star' as const, title: 'First 500m', copy: 'Your first quest began' }, { icon: 'zap' as const, title: 'On a roll', copy: '4 day streak' }, { icon: 'award' as const, title: 'Explorer', copy: 'Complete 5 missions' }];
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHead}><View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{profile.username.slice(0, 1).toUpperCase()}</Text></View><View style={{ flex: 1 }}><Text style={[styles.username, { color: colors.foreground }]}>{profile.username}</Text><Text style={[styles.rank, { color: colors.primary }]}>LEVEL {profile.level} · EXPLORER</Text></View><Pressable onPress={() => Alert.alert('Coming next', 'Profile customization is ready for the next chapter.')}><Feather name="settings" size={20} color={colors.mutedForeground} /></Pressable></View>
      <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>PLAYER PROFILE</Text><Text style={[styles.heroTitle, { color: colors.foreground }]}>Built by every{'\n'}run you finish.</Text><View style={styles.profileStats}><View><Text style={[styles.bigStat, { color: colors.primary }]}>{profile.xp.toLocaleString()}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>XP EARNED</Text></View><View><Text style={[styles.bigStat, { color: colors.foreground }]}>{profile.coins}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>COINS</Text></View><View><Text style={[styles.bigStat, { color: colors.foreground }]}>{profile.streak}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>STREAK</Text></View></View></View>
      <Text style={[styles.section, { color: colors.foreground }]}>ACHIEVEMENTS</Text>
      {achievements.map((achievement) => <View key={achievement.title} style={[styles.achievement, { borderColor: colors.border, backgroundColor: colors.card }]}><View style={[styles.achievementIcon, { backgroundColor: colors.secondary }]}><Feather name={achievement.icon} size={17} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={[styles.achievementTitle, { color: colors.foreground }]}>{achievement.title}</Text><Text style={[styles.achievementCopy, { color: colors.mutedForeground }]}>{achievement.copy}</Text></View><Feather name="check-circle" size={17} color={colors.primary} /></View>)}
      <Text style={[styles.section, { color: colors.foreground }]}>ACCOUNT</Text>
      <Pressable style={[styles.accountRow, { borderColor: colors.border }]} onPress={() => router.push('/history')}><Feather name="bar-chart-2" size={18} color={colors.primary} /><Text style={[styles.accountText, { color: colors.foreground }]}>Your stats</Text><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
      <Pressable style={[styles.accountRow, { borderColor: colors.border }]} onPress={() => Alert.alert('Safety first', 'Run at your own pace, stay aware of traffic and weather, and stop when your body asks you to.') }><Feather name="shield" size={18} color={colors.primary} /><Text style={[styles.accountText, { color: colors.foreground }]}>Safety & support</Text><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
       <Pressable style={[styles.signOut, { borderColor: colors.border }]} onPress={async () => { await resetProgress(); if (isSignedIn) await signOut(); router.replace('/'); }}><Feather name="log-out" size={17} color={colors.accent} /><Text style={[styles.signOutText, { color: colors.accent }]}>{isSignedIn ? 'LOG OUT' : 'EXIT GUEST MODE'}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 12 },
  profileHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 21, fontWeight: '700' },
  username: { fontSize: 21, fontWeight: '700' },
  rank: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginTop: 4 },
  heroCard: { borderWidth: 1, borderRadius: 21, padding: 18, marginBottom: 8 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  heroTitle: { fontSize: 25, lineHeight: 28, fontWeight: '700', letterSpacing: -0.5, marginTop: 13 },
  profileStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28 },
  bigStat: { fontSize: 25, fontWeight: '700' },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginTop: 9 },
  achievement: { borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  achievementIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { fontSize: 14, fontWeight: '700' },
  achievementCopy: { fontSize: 11, marginTop: 3 },
  accountRow: { borderBottomWidth: 1, paddingVertical: 15, flexDirection: 'row', gap: 12, alignItems: 'center' },
  accountText: { flex: 1, fontSize: 14, fontWeight: '600' },
  signOut: { marginTop: 10, borderWidth: 1, borderRadius: 15, padding: 15, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});