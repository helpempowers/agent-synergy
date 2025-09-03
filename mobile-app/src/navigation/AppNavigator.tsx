import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from '../types';
import { authService } from '../services/auth';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import AgentsScreen from '../screens/main/AgentsScreen';
import ConversationsScreen from '../screens/main/ConversationsScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import IntegrationsScreen from '../screens/main/IntegrationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Detail Screens
import AgentDetailScreen from '../screens/detail/AgentDetailScreen';
import ConversationDetailScreen from '../screens/detail/ConversationDetailScreen';

// Icons
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Agents':
            iconName = 'smart-toy';
            break;
          case 'Conversations':
            iconName = 'chat';
            break;
          case 'Analytics':
            iconName = 'analytics';
            break;
          case 'Integrations':
            iconName = 'integration-instructions';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#10b981',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Agents" component={AgentsScreen} />
    <Tab.Screen name="Conversations" component={ConversationsScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Integrations" component={IntegrationsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Main" 
      component={MainTabNavigator} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AgentDetail" 
      component={AgentDetailScreen}
      options={{ title: 'Agent Details' }}
    />
    <Stack.Screen 
      name="ConversationDetail" 
      component={ConversationDetailScreen}
      options={{ title: 'Conversation' }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authService.checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const unsubscribe = authService.addListener(({ user }) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
