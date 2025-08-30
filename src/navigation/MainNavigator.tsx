import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/DashboardScreen';
import AgentsScreen from '../screens/AgentsScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import IntegrationsScreen from '../screens/IntegrationsScreen';
import AgentDetailScreen from '../screens/AgentDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AgentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AgentsList" 
      component={AgentsScreen}
      options={{ title: 'AI Agents' }}
    />
    <Stack.Screen 
      name="AgentDetail" 
      component={AgentDetailScreen}
      options={{ title: 'Agent Details' }}
    />
  </Stack.Navigator>
);

const ConversationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ConversationsList" 
      component={ConversationsScreen}
      options={{ title: 'Conversations' }}
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{ title: 'Chat' }}
    />
  </Stack.Navigator>
);

const AnalyticsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Analytics" 
      component={AnalyticsScreen}
      options={{ title: 'Analytics' }}
    />
  </Stack.Navigator>
);

const IntegrationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Integrations" 
      component={IntegrationsScreen}
      options={{ title: 'Integrations' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Agents':
              iconName = 'robot';
              break;
            case 'Conversations':
              iconName = 'chat';
              break;
            case 'Analytics':
              iconName = 'chart-line';
              break;
            case 'Integrations':
              iconName = 'puzzle';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Agents" 
        component={AgentsStack}
        options={{ title: 'Agents' }}
      />
      <Tab.Screen 
        name="Conversations" 
        component={ConversationsStack}
        options={{ title: 'Chat' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsStack}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name="Integrations" 
        component={IntegrationsStack}
        options={{ title: 'Integrations' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
