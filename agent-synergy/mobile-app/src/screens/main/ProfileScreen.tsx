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
import { authService } from '../../services/auth';
import { User } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
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
        <View style={styles.avatarContainer}>
          <Icon name="person" size={48} color="#10b981" />
        </View>
        <Text style={styles.userName}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userCompany}>{user?.company_name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>
              {user?.first_name} {user?.last_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="business" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>{user?.company_name || 'Not specified'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="group" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>Company Size</Text>
            <Text style={styles.infoValue}>{user?.company_size || 'Not specified'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Status</Text>
        
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.statusLabel}>Account Status</Text>
            <Text style={styles.statusValue}>
              {user?.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Icon name="verified" size={20} color="#10b981" />
            <Text style={styles.statusLabel}>Verification</Text>
            <Text style={styles.statusValue}>
              {user?.is_verified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Icon name="calendar-today" size={20} color="#6b7280" />
            <Text style={styles.statusLabel}>Member Since</Text>
            <Text style={styles.statusValue}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>

          {user?.last_login && (
            <View style={styles.statusRow}>
              <Icon name="schedule" size={20} color="#6b7280" />
              <Text style={styles.statusLabel}>Last Login</Text>
              <Text style={styles.statusValue}>
                {new Date(user.last_login).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.actionCard}>
          <Icon name="edit" size={24} color="#3b82f6" />
          <View style={styles.actionInfo}>
            <Text style={styles.actionName}>Edit Profile</Text>
            <Text style={styles.actionDescription}>Update your account information</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="security" size={24} color="#10b981" />
          <View style={styles.actionInfo}>
            <Text style={styles.actionName}>Change Password</Text>
            <Text style={styles.actionDescription}>Update your password</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
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
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  userCompany: {
    fontSize: 14,
    color: '#9ca3af',
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
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  statusValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});

export default ProfileScreen;
