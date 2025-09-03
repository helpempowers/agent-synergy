import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '../../services/api';
import { Agent, RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type AgentDetailRouteProp = RouteProp<RootStackParamList, 'AgentDetail'>;

const AgentDetailScreen: React.FC = () => {
  const route = useRoute<AgentDetailRouteProp>();
  const navigation = useNavigation();
  const { agentId } = route.params;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    try {
      const agentData = await apiClient.getAgent(agentId);
      setAgent(agentData);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      Alert.alert('Error', 'Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = () => {
    Alert.alert(
      'Delete Agent',
      'Are you sure you want to delete this agent? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteAgent(agentId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting agent:', error);
              Alert.alert('Error', 'Failed to delete agent');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Agent not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.agentIcon}>
          <Icon name="smart-toy" size={32} color="#10b981" />
        </View>
        <Text style={styles.agentName}>{agent.name}</Text>
        <Text style={styles.agentDescription}>{agent.description}</Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: agent.is_active ? '#dcfce7' : '#fef2f2' }]}>
            <Icon 
              name={agent.is_active ? 'check-circle' : 'pause-circle'} 
              size={16} 
              color={agent.is_active ? '#10b981' : '#ef4444'} 
            />
            <Text style={[styles.statusText, { color: agent.is_active ? '#10b981' : '#ef4444' }]}>
              {agent.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agent Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="category" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{agent.agent_type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="model-training" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Model</Text>
            <Text style={styles.infoValue}>{agent.model_name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="settings" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Configuration</Text>
            <Text style={styles.infoValue}>
              {agent.configuration ? 'Custom' : 'Default'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(agent.created_at).toLocaleDateString()}
            </Text>
          </View>

          {agent.updated_at && (
            <View style={styles.infoRow}>
              <Icon name="update" size={20} color="#6b7280" />
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {new Date(agent.updated_at).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        <View style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{agent.total_conversations || 0}</Text>
              <Text style={styles.metricLabel}>Conversations</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{agent.success_rate || 0}%</Text>
              <Text style={styles.metricLabel}>Success Rate</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{agent.avg_response_time || 0}s</Text>
              <Text style={styles.metricLabel}>Avg Response</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{agent.total_tokens_used || 0}</Text>
              <Text style={styles.metricLabel}>Tokens Used</Text>
            </View>
          </View>
        </View>
      </View>

      {agent.capabilities && agent.capabilities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capabilities</Text>
          
          <View style={styles.capabilitiesCard}>
            {agent.capabilities.map((capability, index) => (
              <View key={index} style={styles.capabilityItem}>
                <Icon name="check" size={16} color="#10b981" />
                <Text style={styles.capabilityText}>{capability}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditAgent', { agentId })}
        >
          <Icon name="edit" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit Agent</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAgent}
        >
          <Icon name="delete" size={20} color="white" />
          <Text style={styles.actionButtonText}>Delete Agent</Text>
        </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  agentIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  agentDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  metricsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  capabilitiesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  capabilityText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AgentDetailScreen;
