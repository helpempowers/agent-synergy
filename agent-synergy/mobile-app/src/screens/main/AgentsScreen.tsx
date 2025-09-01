import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { apiClient } from '../../services/api';
import { Agent, AgentCreate } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type AgentsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Agents'>;

interface Props {
  navigation: AgentsScreenNavigationProp;
}

const AgentsScreen: React.FC<Props> = ({ navigation }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    agentType: 'support',
    description: '',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await apiClient.getAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAgents();
    setRefreshing(false);
  };

  const handleCreateAgent = async () => {
    if (!createForm.name.trim()) {
      Alert.alert('Error', 'Please enter an agent name');
      return;
    }

    try {
      const agentData: AgentCreate = {
        user_id: 'current-user', // This will be set by the backend
        name: createForm.name,
        agent_type: createForm.agentType as any,
        description: createForm.description,
      };

      await apiClient.createAgent(agentData);
      setShowCreateModal(false);
      setCreateForm({ name: '', agentType: 'support', description: '' });
      fetchAgents();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create agent');
    }
  };

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    Alert.alert(
      'Delete Agent',
      `Are you sure you want to delete "${agentName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteAgent(agentId);
              fetchAgents();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete agent');
            }
          },
        },
      ]
    );
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

  const renderAgent = ({ item }: { item: Agent }) => (
    <TouchableOpacity
      style={styles.agentCard}
      onPress={() => navigation.navigate('AgentDetail', { agentId: item.id })}
    >
      <View style={styles.agentHeader}>
        <View style={styles.agentInfo}>
          <Icon name="smart-toy" size={24} color="#10b981" />
          <View style={styles.agentDetails}>
            <Text style={styles.agentName}>{item.name}</Text>
            <Text style={styles.agentType}>{getAgentTypeLabel(item.agent_type)}</Text>
          </View>
        </View>
        <View style={styles.agentStatus}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.agentDescription}>{item.description}</Text>
      )}

      <View style={styles.agentStats}>
        <View style={styles.stat}>
          <Icon name="chat" size={16} color="#6b7280" />
          <Text style={styles.statText}>{item.total_conversations || 0} conversations</Text>
        </View>
        <View style={styles.stat}>
          <Icon name="trending-up" size={16} color="#10b981" />
          <Text style={styles.statText}>{item.success_rate || 0}% success</Text>
        </View>
      </View>

      <View style={styles.agentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AgentDetail', { agentId: item.id })}
        >
          <Icon name="edit" size={16} color="#3b82f6" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAgent(item.id, item.name)}
        >
          <Icon name="delete" size={16} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Agents</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={agents}
        renderItem={renderAgent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="smart-toy" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No agents yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first AI agent to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.emptyButtonText}>Create Agent</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create Agent Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Agent</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Agent Name</Text>
              <TextInput
                style={styles.input}
                value={createForm.name}
                onChangeText={(text) => setCreateForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter agent name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Agent Type</Text>
              <View style={styles.pickerContainer}>
                {['support', 'qa', 'reporting', 'virtual_assistant', 'lead_prospector', 'custom'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pickerOption,
                      createForm.agentType === type && styles.pickerOptionSelected
                    ]}
                    onPress={() => setCreateForm(prev => ({ ...prev, agentType: type }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      createForm.agentType === type && styles.pickerOptionTextSelected
                    ]}>
                      {getAgentTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={createForm.description}
                onChangeText={(text) => setCreateForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter agent description"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateAgent}
            >
              <Text style={styles.createButtonText}>Create Agent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  agentType: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  agentDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  agentStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  agentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pickerOptionSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  createButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgentsScreen;
