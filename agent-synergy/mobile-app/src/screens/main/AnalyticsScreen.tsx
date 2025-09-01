import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../../services/api';
import { AnalyticsOverview } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnalyticsScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await apiClient.getAnalyticsOverview();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Performance insights and metrics</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="smart-toy" size={24} color="#10b981" />
          <Text style={styles.statValue}>{analytics?.total_agents || 0}</Text>
          <Text style={styles.statLabel}>Total Agents</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="play-circle" size={24} color="#3b82f6" />
          <Text style={styles.statValue}>{analytics?.active_agents || 0}</Text>
          <Text style={styles.statLabel}>Active Agents</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="chat" size={24} color="#8b5cf6" />
          <Text style={styles.statValue}>{analytics?.total_conversations || 0}</Text>
          <Text style={styles.statLabel}>Total Conversations</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statValue}>{analytics?.successful_conversations || 0}</Text>
          <Text style={styles.statLabel}>Successful</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color="#10b981" />
          <Text style={styles.statValue}>{analytics?.success_rate || 0}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="schedule" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{analytics?.time_saved_hours || 0}h</Text>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="savings" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>${analytics?.cost_savings || 0}</Text>
          <Text style={styles.statLabel}>Cost Savings</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="calendar-today" size={24} color="#6b7280" />
          <Text style={styles.statValue}>{analytics?.period || '30d'}</Text>
          <Text style={styles.statLabel}>Period</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.performanceCard}>
          <Text style={styles.performanceText}>
            Your AI agents have processed {analytics?.total_conversations || 0} conversations
            with a {analytics?.success_rate || 0}% success rate, saving you {analytics?.time_saved_hours || 0} hours
            and ${analytics?.cost_savings || 0} in operational costs.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
