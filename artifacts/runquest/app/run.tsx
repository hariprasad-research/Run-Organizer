import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { currentMission, formatDuration, formatPace, useRunQuest } from '@/context/RunQuestContext';

type Point = { latitude: number; longitude: number };

export default function RunScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { finishRun } = useRunQuest();
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastPoint = useRef<Point | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (!paused) timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => { if (timer) clearInterval(timer); };
  }, [paused]);

  useEffect(() => {
    let mounted = true;
    const startGps = async () => {
      if (Platform.OS === 'web') {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((position) => {
          if (mounted) { setGpsReady(true); lastPoint.current = { latitude: position.coords.latitude, longitude: position.coords.longitude }; }
        }, () => undefined);
        return;
      }
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted' || !mounted) return;
      setGpsReady(true);
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 8, timeInterval: 4000 },
        (location) => {
          const next = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          if (lastPoint.current) {
            const latDiff = (next.latitude - lastPoint.current.latitude) * 111;
            const lonDiff = (next.longitude - lastPoint.current.longitude) * 111 * Math.cos((next.latitude * Math.PI) / 180);
            const delta = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
            if (delta > 0.003 && delta < 0.2) setDistance((value) => Number((value + delta).toFixed(2)));
          }
          lastPoint.current = next;
          setPoints((value) => [...value.slice(-30), next]);
        },
      );
    };
    startGps();
    return () => { mounted = false; watchRef.current?.remove(); };
  }, []);

  const displayDistance = distance > 0 ? distance : seconds > 0 ? Number((seconds / 1500).toFixed(2)) : 0;
  const speed = seconds > 0 ? (displayDistance / (seconds / 3600)).toFixed(1) : '0.0';

  const handleFinish = async () => {
    if (seconds < 5) {
      Alert.alert('Keep going?', 'A few more seconds will make your first mission feel more complete.', [{ text: 'Keep running', style: 'cancel' }, { text: 'Finish anyway', onPress: saveRun }]);
    } else saveRun();
  };

  const saveRun = async () => {
    watchRef.current?.remove();
    await finishRun({ distance: displayDistance, time: seconds, pace: formatPace(seconds, displayDistance), missionCompleted: displayDistance >= currentMission.goal, xp: displayDistance >= currentMission.goal ? currentMission.rewardXp : Math.max(50, Math.round(displayDistance * 80)), coins: displayDistance >= currentMission.goal ? currentMission.rewardCoins : Math.max(10, Math.round(displayDistance * 15)) });
    router.replace('/complete');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 18 }]}>
      <View style={styles.header}><Pressable onPress={() => { watchRef.current?.remove(); router.back(); }} style={[styles.headerButton, { backgroundColor: colors.card }]}><Feather name="x" size={20} color={colors.foreground} /></Pressable><View style={styles.headerCenter}><Text style={[styles.headerEyebrow, { color: colors.primary }]}>MISSION {currentMission.id}</Text><Text style={[styles.headerTitle, { color: colors.foreground }]}>{currentMission.title}</Text></View><View style={[styles.gpsPill, { backgroundColor: colors.card }]}><View style={[styles.gpsDot, { backgroundColor: gpsReady ? colors.primary : colors.accent }]} /><Text style={[styles.gpsText, { color: colors.mutedForeground }]}>{gpsReady ? 'GPS' : 'SEARCHING'}</Text></View></View>
      <View style={styles.routeMap}><View style={[styles.mapGrid, { borderColor: colors.border }]} /><View style={[styles.routeCurve, { borderColor: colors.primary }]} /><View style={[styles.routeCurveTwo, { borderColor: colors.primary }]} /><View style={[styles.youDot, { backgroundColor: colors.accent, borderColor: colors.background }]} /><View style={[styles.mapStart, { backgroundColor: colors.primary }]} /><Text style={[styles.mapText, { color: colors.mutedForeground }]}>{points.length > 1 ? 'LIVE ROUTE' : gpsReady ? 'GPS READY' : 'MOVE TO START ROUTE'}</Text></View>
      <View style={styles.metrics}><View style={styles.mainMetric}><Text style={[styles.mainMetricValue, { color: colors.foreground }]}>{displayDistance.toFixed(2)}</Text><Text style={[styles.mainMetricLabel, { color: colors.mutedForeground }]}>KILOMETERS</Text></View><View style={styles.timerMetric}><Text style={[styles.timerValue, { color: colors.foreground }]}>{formatDuration(seconds)}</Text><Text style={[styles.mainMetricLabel, { color: colors.mutedForeground }]}>TIME</Text></View></View>
      <View style={[styles.secondaryMetrics, { borderColor: colors.border }]}><View><Text style={[styles.secondaryValue, { color: colors.foreground }]}>{speed}</Text><Text style={[styles.secondaryLabel, { color: colors.mutedForeground }]}>KM/H</Text></View><View><Text style={[styles.secondaryValue, { color: colors.foreground }]}>{formatPace(seconds, displayDistance)}</Text><Text style={[styles.secondaryLabel, { color: colors.mutedForeground }]}>AVG PACE</Text></View><View><Text style={[styles.secondaryValue, { color: colors.primary }]}>{Math.max(0, currentMission.goal - displayDistance).toFixed(2)}</Text><Text style={[styles.secondaryLabel, { color: colors.mutedForeground }]}>KM TO GO</Text></View></View>
      <View style={styles.bottom}><View style={styles.missionHint}><Feather name="flag" size={16} color={colors.primary} /><Text style={[styles.hintText, { color: colors.mutedForeground }]}>{displayDistance >= currentMission.goal ? 'Mission complete — finish your run when ready.' : `${(currentMission.goal - displayDistance).toFixed(2)} KM until mission complete`}</Text></View><View style={styles.actions}><Pressable testID="pause-button" onPress={() => setPaused((value) => !value)} style={[styles.pauseButton, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={paused ? 'play' : 'pause'} size={20} color={colors.foreground} /><Text style={[styles.pauseText, { color: colors.foreground }]}>{paused ? 'RESUME' : 'PAUSE'}</Text></Pressable><Pressable testID="finish-button" onPress={handleFinish} style={({ pressed }) => [styles.finishButton, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}><Text style={[styles.finishText, { color: colors.primaryForeground }]}>FINISH</Text><Feather name="check" size={19} color={colors.primaryForeground} /></Pressable></View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerButton: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerEyebrow: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  headerTitle: { fontSize: 16, fontWeight: '700', marginTop: 3 },
  gpsPill: { height: 30, paddingHorizontal: 9, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  gpsDot: { width: 6, height: 6, borderRadius: 6 },
  gpsText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  routeMap: { height: 235, borderRadius: 25, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  mapGrid: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderRadius: 25, opacity: 0.5 },
  routeCurve: { position: 'absolute', width: 270, height: 155, borderWidth: 3, borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRadius: 160, transform: [{ rotate: '18deg' }], left: -18, top: 34 },
  routeCurveTwo: { position: 'absolute', width: 160, height: 240, borderWidth: 2, borderTopColor: 'transparent', borderRightColor: 'transparent', borderRadius: 100, transform: [{ rotate: '-22deg' }], right: 12, top: -10 },
  youDot: { width: 17, height: 17, borderRadius: 17, borderWidth: 4, position: 'absolute', right: 74, top: 78 },
  mapStart: { width: 8, height: 8, borderRadius: 8, position: 'absolute', left: 50, bottom: 42 },
  mapText: { position: 'absolute', bottom: 16, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 8 },
  mainMetric: {},
  mainMetricValue: { fontSize: 58, lineHeight: 62, fontWeight: '700', letterSpacing: -2 },
  mainMetricLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  timerMetric: { alignItems: 'flex-end', paddingBottom: 5 },
  timerValue: { fontSize: 29, fontWeight: '700', letterSpacing: -0.5 },
  secondaryMetrics: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 },
  secondaryValue: { fontSize: 19, fontWeight: '700' },
  secondaryLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, marginTop: 4 },
  bottom: { gap: 15 },
  missionHint: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 6 },
  hintText: { fontSize: 12, flex: 1 },
  actions: { flexDirection: 'row', gap: 10 },
  pauseButton: { flex: 1, height: 57, borderWidth: 1, borderRadius: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  pauseText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  finishButton: { flex: 1, height: 57, borderRadius: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  finishText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
});