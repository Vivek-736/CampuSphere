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

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: 'music' | 'tech' | 'sports' | 'art' | 'food';
  price: string;
  featured?: boolean;
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    date: '2025-09-15',
    time: '09:00 AM',
    location: 'Convention Center, Hyderabad',
    attendees: 450,
    category: 'tech',
    price: '₹2,500',
    featured: true,
  },
  {
    id: '2',
    title: 'Music Festival Night',
    date: '2025-08-28',
    time: '07:00 PM',
    location: 'Outdoor Arena, Vizag',
    attendees: 1200,
    category: 'music',
    price: '₹1,800',
    featured: true,
  },
  {
    id: '3',
    title: 'Art Gallery Opening',
    date: '2025-08-25',
    time: '06:30 PM',
    location: 'Modern Art Museum',
    attendees: 80,
    category: 'art',
    price: 'Free',
  },
  {
    id: '4',
    title: 'Cricket Championship',
    date: '2025-09-02',
    time: '02:00 PM',
    location: 'Sports Complex',
    attendees: 2500,
    category: 'sports',
    price: '₹500',
  },
  {
    id: '5',
    title: 'Food & Wine Tasting',
    date: '2025-08-30',
    time: '07:00 PM',
    location: 'Luxury Hotel, Guntur',
    attendees: 150,
    category: 'food',
    price: '₹3,200',
  },
];

export default function Events() {
  const [activeFilter, setActiveFilter] = useState('all');

  const showComingSoon = () => {
    Alert.alert(
      'Coming Soon! 🚀',
      'This feature is under development and will be available in the next update. Stay tuned!',
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      music: '#e53e3e',
      tech: '#3182ce',
      sports: '#38a169',
      art: '#805ad5',
      food: '#d69e2e',
    };
    return colors[category as keyof typeof colors] || '#718096';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      music: '🎵',
      tech: '💻',
      sports: '⚽',
      art: '🎨',
      food: '🍽️',
    };
    return emojis[category as keyof typeof emojis] || '📅';
  };

  const filteredEvents = activeFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === activeFilter);

  const featuredEvents = mockEvents.filter(event => event.featured);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4C51BF" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Discover Events</Text>
            <Text style={styles.headerSubtitle}>Find amazing experiences near you</Text>
          </View>
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Featured Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredEvents.map((event) => (
              <TouchableOpacity 
                key={event.id}
                style={styles.featuredCard}
                onPress={showComingSoon}
                activeOpacity={0.8}
              >
                <View style={styles.featuredHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                    <Text style={styles.categoryEmoji}>{getCategoryEmoji(event.category)}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{event.price}</Text>
                </View>
                
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                
                <View style={styles.featuredDetails}>
                  <Text style={styles.featuredDate}>
                    {formatDate(event.date)} • {event.time}
                  </Text>
                  <Text style={styles.featuredLocation} numberOfLines={1}>
                    📍 {event.location}
                  </Text>
                  <Text style={styles.featuredAttendees}>
                    👥 {event.attendees.toLocaleString()} attending
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'music', 'tech', 'sports', 'art', 'food'].map((filter) => (
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

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {filteredEvents.map((event) => (
            <TouchableOpacity 
              key={event.id}
              style={styles.eventCard}
              onPress={showComingSoon}
              activeOpacity={0.8}
            >
              <View style={styles.eventHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateDay}>
                    {new Date(event.date).getDate()}
                  </Text>
                  <Text style={styles.dateMonth}>
                    {formatDate(event.date).split(' ')[0]}
                  </Text>
                </View>
                
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventTime}>
                    🕒 {event.time}
                  </Text>
                  <Text style={styles.eventLocation} numberOfLines={1}>
                    📍 {event.location}
                  </Text>
                </View>
                
                <View style={styles.eventRight}>
                  <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(event.category) }]}>
                    <Text style={styles.categoryEmoji}>{getCategoryEmoji(event.category)}</Text>
                  </View>
                  <Text style={styles.eventPrice}>{event.price}</Text>
                </View>
              </View>
              
              <View style={styles.eventFooter}>
                <Text style={styles.attendeesText}>
                  👥 {event.attendees.toLocaleString()} people interested
                </Text>
                <TouchableOpacity style={styles.joinButton} onPress={showComingSoon}>
                  <Text style={styles.joinButtonText}>Join Event</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Event Button */}
        <TouchableOpacity style={styles.createEventButton} onPress={showComingSoon}>
          <Text style={styles.createEventText}>✨ Create Your Event</Text>
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
    backgroundColor: '#4C51BF',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerContent: {
    paddingHorizontal: 20,
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

  featuredCard: {
    width: screenWidth * 0.8,
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
    marginBottom: 12,
  },

  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryEmoji: {
    fontSize: 18,
  },

  featuredPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
  },

  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 12,
    lineHeight: 26,
  },

  featuredDetails: {
    gap: 6,
  },

  featuredDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
  },

  featuredLocation: {
    fontSize: 14,
    color: '#718096',
  },

  featuredAttendees: {
    fontSize: 14,
    color: '#38a169',
    fontWeight: '500',
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
    backgroundColor: '#4C51BF',
    borderColor: '#4C51BF',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },

  activeFilterText: {
    color: '#ffffff',
  },

  eventsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },

  eventCard: {
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

  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  dateContainer: {
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    minWidth: 60,
  },

  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
  },

  dateMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 6,
  },

  eventTime: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
  },

  eventLocation: {
    fontSize: 13,
    color: '#718096',
  },

  eventRight: {
    alignItems: 'center',
  },

  categoryTag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  eventPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3748',
  },

  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  attendeesText: {
    fontSize: 13,
    color: '#718096',
  },

  joinButton: {
    backgroundColor: '#4C51BF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  joinButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  createEventButton: {
    backgroundColor: '#38a169',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#38a169',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  createEventText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpacing: {
    height: 60,
  },
});