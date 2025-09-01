import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { apiClient } from '../../services/api';
import { authService } from '../../services/auth';
import { AnalyticsOverview, Agent, Conversation } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsData, agentsData, conversationsData] = await Promise.all([
        apiClient.getAnalyticsOverview(),
        apiClient.getAgents(),
        apiClient.getConversations({ limit: 5 })
      ]);

      setAnalytics(analyticsData);
      setAgents(agentsData);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'training':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getAgentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      support: 'Customer Support',
      qa: 'Quality Assurance',
      reporting: 'Reporting',
      virtual_assistant: 'Virtual Assistant',
      lead_prospector: 'Lead Prospector',
      custom: 'Custom',
    };
    return labels[type] || type;
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
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back, {user?.first_name || 'User'}!
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="smart-toy" size={24} color="#10b981" />
          <Text style={styles.statValue}>{analytics?.total_agents || 0}</Text>
          <Text style={styles.statLabel}>Total Agents</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="chat" size={24} color="#3b82f6" />
          <Text style={styles.statValue}>{analytics?.total_conversations || 0}</Text>
          <Text style={styles.statLabel}>Conversations</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color="#10b981" />
          <Text style={styles.statValue}>{analytics?.success_rate || 0}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="savings" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>${analytics?.cost_savings || 0}</Text>
          <Text style={styles.statLabel}>Cost Savings</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="add" size={24} color="#10b981" />
            <Text style={styles.actionText}>Create Agent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="chat" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Start Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="analytics" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>View Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="integration-instructions" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Add Integration</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Agents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Agents</Text>
        {agents.slice(0, 3).map((agent) => (
          <TouchableOpacity
            key={agent.id}
            style={styles.agentCard}
            onPress={() => navigation.navigate('AgentDetail', { agentId: agent.id })}
          >
            <View style={styles.agentInfo}>
              <Icon name="smart-toy" size={24} color="#10b981" />
              <View style={styles.agentDetails}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentType}>{getAgentTypeLabel(agent.agent_type)}</Text>
              </View>
            </View>
            <View style={styles.agentStats}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(agent.status) }]} />
              <Text style={styles.agentStatus}>{agent.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {agents.length === 0 && (
          <Text style={styles.emptyText}>No agents created yet.</Text>
        )}
      </View>

      {/* Recent Conversations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        {conversations.slice(0, 3).map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationCard}
            onPress={() => navigation.navigate('ConversationDetail', { conversationId: conversation.id })}
          >
            <View style={styles.conversationInfo}>
              <Icon name="chat" size={24} color="#3b82f6" />
              <View style={styles.conversationDetails}>
                <Text style={styles.conversationTitle}>
                  {conversation.title || 'Untitled Conversation'}
                </Text>
                <Text style={styles.conversationType}>{conversation.conversation_type}</Text>
              </View>
            </View>
            <View style={styles.conversationStats}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(conversation.status) }]} />
              <Text style={styles.conversationStatus}>{conversation.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {conversations.length === 0 && (
          <Text style={styles.emptyText}>No conversations yet.</Text>
        )}
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
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
  actionText: {
    fontSize: 12,
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  agentType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  agentStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  agentStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  conversationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  conversationType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  conversationStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default DashboardScreen;
