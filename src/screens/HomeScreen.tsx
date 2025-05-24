// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  useColorScheme, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Platform,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  FadeIn,
  SlideInUp 
} from 'react-native-reanimated';
import { useAuth } from '../providers/AuthProvider';
import { listenToTasks, Task } from '../services/tasks';
import { listenToMoods, Mood } from '../services/moods';
import { listenToPartnerStats, PartnerStats } from '../services/supportPartners';
import { listenToLatestPhoto, WidgetContentDoc } from '../services/widgetContent';
import { useWeather, WeatherData } from '../services/weather';
import TaskWidgetCard from '../components/TaskWidgetCard';
import MoodWidgetCard from '../components/MoodWidgetCard';
import PartnerStatsCard from '../components/PartnerStatsCard';
import PhotoWidgetCard from '../components/PhotoWidgetCard';
import WeatherWidgetCard from '../components/WeatherWidgetCard';
import HydrationWidgetCard from '../components/HydrationWidgetCard';
import QuoteWidgetCard from '../components/QuoteWidgetCard';
import { Ionicons } from '@expo/vector-icons';
import { useWidgetOrder, WidgetId } from '../hooks/useWidgetOrder';

type WidgetItem = { id: WidgetId };

const DEFAULT_ORDER: WidgetId[] = ['photo', 'tasks', 'moods', 'weather', 'hydration', 'quote'];

// Header component for both views
const HomeHeader: React.FC<{ 
  title: string; 
  subtitle?: string;
}> = ({ title, subtitle }) => {
  const isDark = useColorScheme() === 'dark';
  
  return (
    <Animated.View 
      entering={FadeIn.duration(600).delay(100)} 
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.headerSubtitle, { color: isDark ? '#aaa' : '#666' }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const AnimatedCard: React.FC<{ 
  isActive: boolean; 
  bg: string; 
  children: React.ReactNode;
  index?: number; 
}> = ({ isActive, bg, children, index = 0 }) => {
  const scale = useSharedValue(1);
  const isDark = useColorScheme() === 'dark';
  
  React.useEffect(() => {
    scale.value = withTiming(isActive ? 1.05 : 1, { duration: 150 });
  }, [isActive]);
  
  const style = useAnimatedStyle(() => ({ 
    transform: [{ scale: scale.value }],
    shadowOpacity: withTiming(isActive ? 0.2 : 0.1),
  }));
  
  return (
    <Animated.View 
      entering={SlideInUp.delay(100 * index).springify()}
      style={[
        styles.card, 
        { 
          backgroundColor: bg,
          shadowColor: isDark ? '#000' : '#000',
          borderColor: isDark ? '#333' : '#e0e0e0',
          borderWidth: isDark ? 1 : 0,
        }, 
        style
      ]}
    >
      {children}
    </Animated.View>
  );
};

const PartnerView: React.FC = () => {
  const { user, profile } = useAuth();
  const isDark = useColorScheme() === 'dark';
  const [tasks, setTasks] = useState<Task[]>();
  const [moods, setMoods] = useState<Mood[]>();
  const [latestPhoto, setLatestPhoto] = useState<WidgetContentDoc | null>();
  const { weather, loading: weatherLoading } = useWeather();
  const [order, setOrder] = useWidgetOrder(user!.uid);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure new widgets are added to existing order
  useEffect(() => {
    if (order.length > 0) {
      const missingWidgets = DEFAULT_ORDER.filter(id => !order.includes(id));
      if (missingWidgets.length > 0) {
        setOrder([...order, ...missingWidgets]);
      }
    }
  }, [order, setOrder]);

  const refreshData = React.useCallback(async () => {
    setRefreshing(true);
    // In a real app, you would re-fetch data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    const unsubscribers: (() => void)[] = [];
    
    // Listen to tasks
    const unsubT = listenToTasks(user.uid, (newTasks) => {
      setTasks(newTasks);
      setIsLoading(false);
    });
    unsubscribers.push(unsubT);
    
    // Listen to moods
    const unsubM = listenToMoods(user.uid, (newMoods) => {
      setMoods(newMoods);
      setIsLoading(false);
    });
    unsubscribers.push(unsubM);
    
    // Listen to latest photo
    const unsubP = listenToLatestPhoto(user.uid, (photo) => {
      setLatestPhoto(photo);
      setIsLoading(false);
    });
    unsubscribers.push(unsubP);
    
    return () => { 
      unsubscribers.forEach(unsub => unsub());
    };
  }, [user]);

  const items = (order.length ? order : DEFAULT_ORDER).map(id => ({ id }));

  const latestMood = moods === undefined
    ? undefined
    : moods.length > 0
      ? moods[0]
      : null;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<WidgetItem>) => (
    <View style={{ flex: 1 }}>
      <AnimatedCard 
        isActive={isActive} 
        bg={isDark ? '#1c1c1e' : '#fff'} 
        index={items.findIndex(i => i.id === item.id)}
      >
        {(() => {
          switch(item.id) {
            case 'tasks':
              return <TaskWidgetCard tasks={tasks} onLongPress={drag} />;
            case 'moods':
              return <MoodWidgetCard latestMood={latestMood} onLongPress={drag} />;
            case 'photo':
              return <PhotoWidgetCard photo={latestPhoto} onLongPress={drag} />;
            case 'weather':
              return <WeatherWidgetCard weather={weather} onLongPress={drag} />;
            case 'hydration':
              return <HydrationWidgetCard onLongPress={drag} />;
            case 'quote':
              return <QuoteWidgetCard onLongPress={drag} />;
            default:
              return null;
          }
        })()}
      </AnimatedCard>
    </View>
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
        <HomeHeader 
          title={`Hi, ${profile?.name?.split(' ')[0] || 'there'}!`} 
          subtitle="Loading your dashboard..."
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#1e90ff' : '#007aff'} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
            Loading your dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
      <HomeHeader 
        title={`Hi, ${profile?.name?.split(' ')[0] || 'there'}!`} 
        subtitle="Welcome to your dashboard"
      />
      <View style={styles.container}>
        <DraggableFlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => setOrder(data.map(d => d.id))}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              tintColor={isDark ? '#1e90ff' : '#007aff'}
              colors={[isDark ? '#1e90ff' : '#007aff']}
            />
          }
          ListEmptyComponent={
            <Animated.View 
              entering={FadeIn.duration(400)} 
              style={styles.emptyContainer}
            >
              <Ionicons name="grid-outline" size={48} color={isDark ? '#555' : '#aaa'} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: isDark ? '#fff' : '#000' }]}>
                No widgets available
              </Text>
            </Animated.View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const SupportView: React.FC = () => {
  const { user, profile } = useAuth();
  const isDark = useColorScheme() === 'dark';
  const [partnerStats, setPartnerStats] = useState<PartnerStats>({ loading: true, partners: [] });
  const [refreshing, setRefreshing] = useState(false);
  
  const refreshData = React.useCallback(async () => {
    setRefreshing(true);
    // In a real implementation, you might want to re-fetch the data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribe = listenToPartnerStats(user.uid, stats => {
      console.log('Partner stats updated:', stats);
      setPartnerStats(stats);
    });
    
    return unsubscribe;
  }, [user, profile]);

  if (partnerStats.loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
        <HomeHeader 
          title={`Hi, ${profile?.name?.split(' ')[0] || 'there'}!`} 
          subtitle="Support Dashboard"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#1e90ff' : '#007aff'} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
            Loading partner statistics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (partnerStats.error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
        <HomeHeader 
          title={`Hi, ${profile?.name?.split(' ')[0] || 'there'}!`} 
          subtitle="Support Dashboard"
        />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff3b30" style={styles.emptyIcon} />
          <Text style={styles.errorText}>{partnerStats.error}</Text>
          <TouchableOpacity onPress={refreshData}>
            <Text style={[styles.refreshText, { color: isDark ? '#1e90ff' : '#007aff' }]}>
              Tap to retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
      <HomeHeader 
        title={`Hi, ${profile?.name?.split(' ')[0] || 'there'}!`} 
        subtitle={`Support Dashboard${partnerStats.partners.length > 0 ? ` • ${partnerStats.partners.length} Partner${partnerStats.partners.length !== 1 ? 's' : ''}` : ''}`}
      />
      
      <View style={styles.container}>
        <FlatList
          data={partnerStats.partners}
          keyExtractor={(item) => item.uid}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={SlideInUp.delay(100 * index).springify()} 
              style={{ width: '100%' }}
            >
              <PartnerStatsCard partner={item} />
            </Animated.View>
          )}
          contentContainerStyle={styles.supportList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              tintColor={isDark ? '#1e90ff' : '#007aff'}
              colors={[isDark ? '#1e90ff' : '#007aff']}
            />
          }
          ListEmptyComponent={
            <Animated.View 
              entering={FadeIn.duration(400)} 
              style={styles.emptyContainer}
            >
              <Ionicons name="people-outline" size={48} color={isDark ? '#555' : '#aaa'} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: isDark ? '#fff' : '#000' }]}>
                No partners found yet. Partners who link their account to you will appear here.
              </Text>
            </Animated.View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const HomeScreen: React.FC = () => {
  const { user, profile } = useAuth();
  const isDark = useColorScheme() === 'dark';
  const isSupport = profile?.role === 'support';

  if (!user || !profile) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={isDark ? '#1e90ff' : '#007aff'} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
            Loading your dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return isSupport ? <SupportView /> : <PartnerView />;
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
  },
  // Header styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  // List styles
  list: { 
    padding: 8,
    paddingTop: 0,
  },
  supportList: { 
    padding: 16,
    paddingTop: 0, 
  },
  // Card styles
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Status containers
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Status text styles
  loadingText: { 
    marginTop: 16, 
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: { 
    fontSize: 16, 
    textAlign: 'center',
    color: '#ff3b30',
    marginTop: 8,
  },
  emptyText: { 
    fontSize: 16, 
    textAlign: 'center',
    marginTop: 16,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  refreshText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
});