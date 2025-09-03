import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { apiClient } from '../../services/api';
import { Integration } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IntegrationsScreen: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const data = await apiClient.getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Integrations</Text>
        <Text style={styles.subtitle}>Connect with external services</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Integrations</Text>
        
        <TouchableOpacity style={styles.integrationCard}>
          <Icon name="chat" size={24} color="#3b82f6" />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationName}>Slack</Text>
            <Text style={styles.integrationDescription}>
              Connect your AI agents to Slack for real-time notifications
            </Text>
          </View>
          <Icon name="add" size={24} color="#10b981" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.integrationCard}>
          <Icon name="table-chart" size={24} color="#10b981" />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationName}>Google Sheets</Text>
            <Text style={styles.integrationDescription}>
              Export conversation data and analytics to Google Sheets
            </Text>
          </View>
          <Icon name="add" size={24} color="#10b981" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.integrationCard}>
          <Icon name="email" size={24} color="#f59e0b" />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationName}>Email</Text>
            <Text style={styles.integrationDescription}>
              Send email notifications and reports
            </Text>
          </View>
          <Icon name="add" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      {integrations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Integrations</Text>
          {integrations.map((integration) => (
            <View key={integration.id} style={styles.integrationCard}>
              <Icon name="integration-instructions" size={24} color="#8b5cf6" />
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>{integration.platform}</Text>
                <Text style={styles.integrationDescription}>
                  Connected on {new Date(integration.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(integration.status) }]} />
            </View>
          ))}
        </View>
      )}
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
  integrationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  integrationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  integrationDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default IntegrationsScreen;
