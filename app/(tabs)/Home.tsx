import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Home/Header';
import Category from '@/components/Home/Category';
import PostList from '@/components/Home/PostList';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollY = new Animated.Value(0);

  const fetchPosts = useCallback(async (force = false) => {
    if (!force && posts.length && !loading) return;

    setRefreshing(true);
    setError(null);

    const host = Constants.expoConfig?.hostUri
      ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:8081/post`
      : 'http://localhost:8081/post';

    try {
      console.log('Fetching posts from:', host);
      const res = await fetch(host, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      console.log('Posts response:', json);

      if (json.success) {
        setPosts(json.data ?? []);
        console.log(`Loaded ${json.data?.length || 0} posts`);
      } else {
        console.warn('API returned error:', json.error);
        setError(json.error || 'Failed to load posts');
        setPosts([]);
      }
    } catch (e: any) {
      console.error('Failed to load posts:', e);
      setError(e.message || 'Network error occurred');
      setPosts([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [posts.length, loading]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  const renderError = () => (
    <View style={styles.errorContainer}>
      <LinearGradient
        colors={['#ff6b6b', '#ee5a24']}
        style={styles.errorCard}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#FFF" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </LinearGradient>
    </View>
  );

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingCard}
      >
        <Animated.View
          style={[
            styles.loadingDot,
            {
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [0, 50, 100],
                    outputRange: [1, 1.2, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="refresh" size={32} color="#FFF" />
        </Animated.View>
        <Text style={styles.loadingText}>Loading amazing posts...</Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(248, 249, 251, 0.95)', 'rgba(248, 249, 251, 0.8)']}
          style={styles.headerGradient}
        >
          <Header />
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPosts(true)}
            colors={['#667eea', '#764ba2']}
            tintColor="#667eea"
            title="Pull to refresh"
            titleColor="#667eea"
            progressBackgroundColor="#FFF"
          />
        }
      >
        {/* Main Content */}
        <View style={styles.content}>
          {/* Category Section */}
          <View style={styles.categorySection}>
            <Category />
          </View>

          {/* Posts Section */}
          <View style={styles.postsSection}>
            {loading && renderLoadingIndicator()}
            {error && !loading && renderError()}
            {!loading && !error && (
              <>
                {posts.length > 0 ? (
                  <>
                    <View style={styles.postsHeader}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.postsHeaderGradient}
                      >
                        <Ionicons name="flame" size={20} color="#FFF" />
                        <Text style={styles.postsHeaderText}>
                          Latest Posts ({posts.length})
                        </Text>
                      </LinearGradient>
                    </View>
                    <PostList posts={posts} />
                  </>
                ) : (
                  <PostList posts={[]} />
                )}
              </>
            )}
          </View>
        </View>

        {/* Footer Spacer */}
        <View style={styles.footerSpacer} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // Animated Header
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 60,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Main Content
  content: {
    paddingTop: 120, // Account for fixed header
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  postsSection: {
    flex: 1,
  },
  postsHeader: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  postsHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postsHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },

  // Loading State
  loadingContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  loadingCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingDot: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },

  errorContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  errorCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerSpacer: {
    height: 100,
  },
});