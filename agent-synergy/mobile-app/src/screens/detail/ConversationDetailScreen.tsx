import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { apiClient } from '../../services/api';
import { Conversation, RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ConversationDetailRouteProp = RouteProp<RootStackParamList, 'ConversationDetail'>;

const ConversationDetailScreen: React.FC = () => {
  const route = useRoute<ConversationDetailRouteProp>();
  const { conversationId } = route.params;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversationDetails();
  }, [conversationId]);

  const fetchConversationDetails = async () => {
    try {
      const conversationData = await apiClient.getConversation(conversationId);
      setConversation(conversationData);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.agentMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.agentBubble]}>
          <View style={styles.messageHeader}>
            <Icon 
              name={isUser ? 'person' : 'smart-toy'} 
              size={16} 
              color={isUser ? '#3b82f6' : '#10b981'} 
            />
            <Text style={[styles.messageRole, { color: isUser ? '#3b82f6' : '#10b981' }]}>
              {isUser ? 'You' : 'AI Agent'}
            </Text>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={[styles.messageText, { color: isUser ? 'white' : '#111827' }]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.conversationInfo}>
          <Text style={styles.conversationTitle}>
            Conversation with {conversation.agent_name}
          </Text>
          <Text style={styles.conversationDate}>
            {new Date(conversation.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: conversation.status === 'completed' ? '#dcfce7' : '#fef3c7' }]}>
            <Icon 
              name={conversation.status === 'completed' ? 'check-circle' : 'pending'} 
              size={16} 
              color={conversation.status === 'completed' ? '#10b981' : '#f59e0b'} 
            />
            <Text style={[styles.statusText, { color: conversation.status === 'completed' ? '#10b981' : '#f59e0b' }]}>
              {conversation.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{conversation.message_count || 0}</Text>
          <Text style={styles.metricLabel}>Messages</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{conversation.duration || 0}s</Text>
          <Text style={styles.metricLabel}>Duration</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{conversation.token_count || 0}</Text>
          <Text style={styles.metricLabel}>Tokens</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>${conversation.cost || 0}</Text>
          <Text style={styles.metricLabel}>Cost</Text>
        </View>
      </View>

      <View style={styles.messagesContainer}>
        <Text style={styles.sectionTitle}>Messages</Text>
        {conversation.messages && conversation.messages.length > 0 ? (
          <FlatList
            data={conversation.messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
          />
        ) : (
          <View style={styles.noMessages}>
            <Icon name="chat" size={48} color="#9ca3af" />
            <Text style={styles.noMessagesText}>No messages in this conversation</Text>
          </View>
        )}
      </View>

      {conversation.feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackRow}>
              <Icon name="star" size={20} color="#f59e0b" />
              <Text style={styles.feedbackLabel}>Rating</Text>
              <Text style={styles.feedbackValue}>{conversation.feedback.rating}/5</Text>
            </View>
            {conversation.feedback.comment && (
              <View style={styles.feedbackComment}>
                <Text style={styles.feedbackCommentText}>{conversation.feedback.comment}</Text>
              </View>
            )}
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  conversationDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  agentMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
  },
  agentBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noMessagesText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  feedbackContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  feedbackCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  feedbackValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  feedbackComment: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  feedbackCommentText: {
    fontSize: 14,
    color: '#111827',
    fontStyle: 'italic',
  },
});

export default ConversationDetailScreen;
