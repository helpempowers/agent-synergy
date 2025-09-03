import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#3b82f6" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Profile</Text>
            <Text style={styles.settingDescription}>Update your account information</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="security" size={24} color="#10b981" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Security</Text>
            <Text style={styles.settingDescription}>Change password and security settings</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="notifications" size={24} color="#f59e0b" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Notifications</Text>
            <Text style={styles.settingDescription}>Manage notification preferences</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <TouchableOpacity style={styles.settingCard}>
          <Icon name="language" size={24} color="#8b5cf6" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Language</Text>
            <Text style={styles.settingDescription}>Change app language</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="dark-mode" size={24} color="#6b7280" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Theme</Text>
            <Text style={styles.settingDescription}>Light or dark mode</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="help" size={24} color="#3b82f6" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Help & Support</Text>
            <Text style={styles.settingDescription}>Get help and contact support</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="info" size={24} color="#6b7280" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>About</Text>
            <Text style={styles.settingDescription}>App version and information</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.settingCard, styles.logoutCard]} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#ef4444" />
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, styles.logoutText]}>Logout</Text>
            <Text style={styles.settingDescription}>Sign out of your account</Text>
          </View>
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
  settingCard: {
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
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutCard: {
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
  },
});

export default SettingsScreen;
