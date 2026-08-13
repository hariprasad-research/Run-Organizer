import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Profile = {
  username: string;
  level: number;
  xp: number;
  coins: number;
  totalDistance: number;
  totalRuns: number;
  bestPace: string;
  streak: number;
};

export type RunRecord = {
  id: string;
  distance: number;
  time: number;
  pace: string;
  date: string;
  missionCompleted: boolean;
  xp: number;
  coins: number;
};

export const currentMission = {
  id: '07',
  title: 'Forest Run',
  subtitle: 'Follow the green line',
  goal: 2.5,
  progress: 1.8,
  rewardXp: 250,
  rewardCoins: 50,
  difficulty: 'Explorer',
};

const starterProfile: Profile = {
  username: 'NovaRunner',
  level: 3,
  xp: 1240,
  coins: 486,
  totalDistance: 21.8,
  totalRuns: 8,
  bestPace: '5:18',
  streak: 4,
};

const starterRuns: RunRecord[] = [
  { id: '1', distance: 3.4, time: 1210, pace: '5:56', date: 'Today', missionCompleted: true, xp: 180, coins: 35 },
  { id: '2', distance: 2.2, time: 844, pace: '6:22', date: 'Yesterday', missionCompleted: false, xp: 120, coins: 20 },
  { id: '3', distance: 5.1, time: 1705, pace: '5:34', date: 'Mon, Aug 10', missionCompleted: true, xp: 300, coins: 60 },
  { id: '4', distance: 2.8, time: 1040, pace: '6:11', date: 'Sun, Aug 9', missionCompleted: true, xp: 220, coins: 45 },
];

type ContextValue = {
  profile: Profile;
  runs: RunRecord[];
  hasStarted: boolean;
  isHydrated: boolean;
  signIn: (username: string) => Promise<void>;
  finishRun: (run: Omit<RunRecord, 'id' | 'date'>) => Promise<RunRecord>;
  resetProgress: () => Promise<void>;
};

const RunQuestContext = createContext<ContextValue | null>(null);

export function RunQuestProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(starterProfile);
  const [runs, setRuns] = useState<RunRecord[]>(starterRuns);
  const [hasStarted, setHasStarted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedProfile, savedRuns, savedStarted] = await Promise.all([
          AsyncStorage.getItem('@runquest/profile'),
          AsyncStorage.getItem('@runquest/runs'),
          AsyncStorage.getItem('@runquest/started'),
        ]);
        if (savedProfile) setProfile(JSON.parse(savedProfile) as Profile);
        if (savedRuns) setRuns(JSON.parse(savedRuns) as RunRecord[]);
        if (savedStarted) setHasStarted(savedStarted === 'true');
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const persist = async (nextProfile: Profile, nextRuns: RunRecord[]) => {
    await Promise.all([
      AsyncStorage.setItem('@runquest/profile', JSON.stringify(nextProfile)),
      AsyncStorage.setItem('@runquest/runs', JSON.stringify(nextRuns)),
    ]);
  };

  const signIn = async (username: string) => {
    const next = { ...profile, username: username.trim() || 'NovaRunner' };
    setProfile(next);
    setHasStarted(true);
    await Promise.all([
      AsyncStorage.setItem('@runquest/profile', JSON.stringify(next)),
      AsyncStorage.setItem('@runquest/started', 'true'),
    ]);
  };

  const finishRun = async (run: Omit<RunRecord, 'id' | 'date'>) => {
    const created: RunRecord = {
      ...run,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: 'Just now',
    };
    const nextRuns = [created, ...runs];
    const distance = Number(run.distance.toFixed(2));
    const nextProfile: Profile = {
      ...profile,
      xp: profile.xp + run.xp,
      coins: profile.coins + run.coins,
      totalDistance: Number((profile.totalDistance + distance).toFixed(1)),
      totalRuns: profile.totalRuns + 1,
      streak: Math.max(profile.streak, 5),
    };
    if (nextProfile.xp >= 1500 && profile.level === 3) nextProfile.level = 4;
    setRuns(nextRuns);
    setProfile(nextProfile);
    await persist(nextProfile, nextRuns);
    return created;
  };

  const resetProgress = async () => {
    setProfile(starterProfile);
    setRuns(starterRuns);
    setHasStarted(false);
    await Promise.all([
      AsyncStorage.removeItem('@runquest/profile'),
      AsyncStorage.removeItem('@runquest/runs'),
      AsyncStorage.removeItem('@runquest/started'),
    ]);
  };

  const value = useMemo(
    () => ({ profile, runs, hasStarted, isHydrated, signIn, finishRun, resetProgress }),
    [profile, runs, hasStarted, isHydrated],
  );

  return <RunQuestContext.Provider value={value}>{children}</RunQuestContext.Provider>;
}

export function useRunQuest() {
  const value = useContext(RunQuestContext);
  if (!value) throw new Error('useRunQuest must be used inside RunQuestProvider');
  return value;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

export function formatPace(seconds: number, distance: number) {
  if (distance <= 0) return '--:--';
  const pace = Math.round(seconds / distance);
  return `${Math.floor(pace / 60)}:${String(pace % 60).padStart(2, '0')}`;
}