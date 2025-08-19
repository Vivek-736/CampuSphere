import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type Club = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: 'tech' | 'sports' | 'arts' | 'gaming' | 'music' | 'study';
  isJoined: boolean;
  featured?: boolean;
  activity: 'high' | 'medium' | 'low';
  lastActive: string;
};

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Tech Innovators Hub',
    description: 'Exploring cutting-edge technology and building the future together',
    members: 2847,
    category: 'tech',
    isJoined: true,
    featured: true,
    activity: 'high',
    lastActive: '2h ago',
  },
  {
    id: '2',
    name: 'Creative Artists Collective',
    description: 'A space for artists to share, collaborate, and inspire each other',
    members: 1523,
    category: 'arts',
    isJoined: false,
    featured: true,
    activity: 'high',
    lastActive: '1h ago',
  },
  {
    id: '3',
    name: 'Gaming Legends',
    description: 'Unite with fellow gamers, share strategies, and compete together',
    members: 4521,
    category: 'gaming',
    isJoined: true,
    featured: false,
    activity: 'high',
    lastActive: '30m ago',
  },
  {
    id: '4',
    name: 'Study Buddies',
    description: 'Collaborative learning and academic support group',
    members: 892,
    category: 'study',
    isJoined: false,
    featured: false,
    activity: 'medium',
    lastActive: '4h ago',
  },
  {
    id: '5',
    name: 'Music Makers',
    description: 'Compose, collaborate, and create amazing music together',
    members: 1247,
    category: 'music',
    isJoined: false,
    featured: false,
    activity: 'medium',
    lastActive: '6h ago',
  },
  {
    id: '6',
    name: 'Sports Champions',
    description: 'Connect with athletes and sports enthusiasts from all disciplines',
    members: 3156,
    category: 'sports',
    isJoined: true,
    featured: false,
    activity: 'high',
    lastActive: '1h ago',
  },
];

export default function Clubs() {
  const [activeFilter, setActiveFilter] = useState('all');

  const showComingSoon = () => {
    Alert.alert(
      'Coming Soon! 🚀',
      'This awesome feature is being crafted with love and will be available soon. Get ready for an amazing club experience!',
      [{ text: 'Exciting!', style: 'default' }]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      tech: '#3B82F6',
      sports: '#10B981',
      arts: '#8B5CF6',
      gaming: '#EF4444',
      music: '#F59E0B',
      study: '#6366F1',
    };
    return colors[category as keyof typeof colors] || '#718096';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      tech: '💻',
      sports: '⚽',
      arts: '🎨',
      gaming: '🎮',
      music: '🎵',
      study: '📚',
    };
    return emojis[category as keyof typeof emojis] || '🌟';
  };

  const getActivityColor = (activity: string) => {
    const colors = {
      high: '#10B981',
      medium: '#F59E0B',
      low: '#EF4444',
    };
    return colors[activity as keyof typeof colors] || '#718096';
  };

  const filteredClubs = activeFilter === 'all' 
    ? mockClubs 
    : mockClubs.filter(club => club.category === activeFilter);

  const featuredClubs = mockClubs.filter(club => club.featured);
  const joinedClubs = mockClubs.filter(club => club.isJoined);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Explore Clubs</Text>
            <Text style={styles.headerSubtitle}>Connect with like-minded people</Text>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{joinedClubs.length}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockClubs.length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        </View>

        {/* My Clubs */}
        {joinedClubs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 My Clubs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {joinedClubs.map((club) => (
                <TouchableOpacity 
                  key={club.id}
                  style={styles.myClubCard}
                  onPress={showComingSoon}
                  activeOpacity={0.8}
                >
                  <View style={[styles.clubIcon, { backgroundColor: getCategoryColor(club.category) }]}>
                    <Text style={styles.clubEmoji}>{getCategoryEmoji(club.category)}</Text>
                  </View>
                  <Text style={styles.myClubName} numberOfLines={2}>
                    {club.name}
                  </Text>
                  <Text style={styles.myClubMembers}>
                    👥 {club.members.toLocaleString()}
                  </Text>
                  <View style={[styles.activityDot, { backgroundColor: getActivityColor(club.activity) }]} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Clubs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Featured Clubs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredClubs.map((club) => (
              <TouchableOpacity 
                key={club.id}
                style={styles.featuredCard}
                onPress={showComingSoon}
                activeOpacity={0.8}
              >
                <View style={styles.featuredHeader}>
                  <View style={[styles.featuredIcon, { backgroundColor: getCategoryColor(club.category) }]}>
                    <Text style={styles.featuredEmoji}>{getCategoryEmoji(club.category)}</Text>
                  </View>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                </View>
                
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {club.name}
                </Text>
                
                <Text style={styles.featuredDescription} numberOfLines={3}>
                  {club.description}
                </Text>
                
                <View style={styles.featuredFooter}>
                  <Text style={styles.featuredMembers}>
                    👥 {club.members.toLocaleString()} members
                  </Text>
                  <Text style={styles.featuredActivity}>
                    🔥 {club.activity} activity
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.joinFeaturedButton,
                    club.isJoined && styles.joinedButton
                  ]}
                  onPress={showComingSoon}
                >
                  <Text style={[
                    styles.joinFeaturedText,
                    club.isJoined && styles.joinedText
                  ]}>
                    {club.isJoined ? '✓ Joined' : 'Join Club'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'tech', 'sports', 'arts', 'gaming', 'music', 'study'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  activeFilter === filter && styles.activeFilterTab
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText
                ]}>
                  {filter === 'all' ? '🌟 All' : `${getCategoryEmoji(filter)} ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Clubs List */}
        <View style={styles.clubsContainer}>
          {filteredClubs.map((club) => (
            <TouchableOpacity 
              key={club.id}
              style={styles.clubCard}
              onPress={showComingSoon}
              activeOpacity={0.8}
            >
              <View style={styles.clubHeader}>
                <View style={[styles.clubAvatar, { backgroundColor: getCategoryColor(club.category) }]}>
                  <Text style={styles.clubAvatarEmoji}>{getCategoryEmoji(club.category)}</Text>
                </View>
                
                <View style={styles.clubInfo}>
                  <View style={styles.clubTitleRow}>
                    <Text style={styles.clubTitle} numberOfLines={1}>
                      {club.name}
                    </Text>
                    {club.isJoined && (
                      <View style={styles.joinedIndicator}>
                        <Text style={styles.joinedIndicatorText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.clubDescription} numberOfLines={2}>
                    {club.description}
                  </Text>
                  <View style={styles.clubMeta}>
                    <Text style={styles.clubMembers}>
                      👥 {club.members.toLocaleString()}
                    </Text>
                    <Text style={styles.clubActivity}>
                      • Last active {club.lastActive}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.clubFooter}>
                <View style={[styles.activityIndicator, { backgroundColor: getActivityColor(club.activity) }]}>
                  <Text style={styles.activityText}>
                    {club.activity.charAt(0).toUpperCase() + club.activity.slice(1)} Activity
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.joinButton,
                    club.isJoined && styles.joinedButtonSmall
                  ]}
                  onPress={showComingSoon}
                >
                  <Text style={[
                    styles.joinButtonText,
                    club.isJoined && styles.joinedButtonTextSmall
                  ]}>
                    {club.isJoined ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Club Button */}
        <TouchableOpacity style={styles.createClubButton} onPress={showComingSoon}>
          <Text style={styles.createClubText}>🎉 Start Your Own Club</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },

  header: {
    backgroundColor: '#7C3AED',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerContent: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  section: {
    marginTop: 24,
    paddingLeft: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },

  myClubCard: {
    width: 120,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: 'relative',
  },

  clubIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  clubEmoji: {
    fontSize: 24,
  },

  myClubName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },

  myClubMembers: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },

  activityDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  featuredCard: {
    width: screenWidth * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  featuredIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featuredEmoji: {
    fontSize: 24,
  },

  featuredBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  featuredBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 12,
    lineHeight: 26,
  },

  featuredDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },

  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  featuredMembers: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },

  featuredActivity: {
    fontSize: 14,
    color: '#38a169',
    fontWeight: '500',
  },

  joinFeaturedButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  joinedButton: {
    backgroundColor: '#10B981',
  },

  joinFeaturedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  joinedText: {
    color: '#ffffff',
  },

  filterContainer: {
    marginTop: 24,
    paddingLeft: 20,
  },

  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },

  activeFilterTab: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },

  activeFilterText: {
    color: '#ffffff',
  },

  clubsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },

  clubCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  clubHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  clubAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  clubAvatarEmoji: {
    fontSize: 28,
  },

  clubInfo: {
    flex: 1,
  },

  clubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  clubTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
  },

  joinedIndicator: {
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  joinedIndicatorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  clubDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 8,
  },

  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  clubMembers: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '500',
  },

  clubActivity: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 8,
  },

  clubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  activityIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  activityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  joinButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  joinedButtonSmall: {
    backgroundColor: '#10B981',
  },

  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  joinedButtonTextSmall: {
    color: '#ffffff',
  },

  createClubButton: {
    backgroundColor: '#F59E0B',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  createClubText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpacing: {
    height: 60,
  },
})