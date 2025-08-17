import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Header from '@/components/Home/Header';
import Category from '@/components/Home/Category';
import PostList from '@/components/Home/PostList';

export default function Home() {
  const [posts, setPosts]         = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [firstLoad, setFirstLoad]   = useState(true);

  const fetchPosts = useCallback(async (force = false) => {
    if (!force && posts.length) return;

    setRefreshing(true);

    const host =
      Constants.expoConfig?.hostUri
        ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:8081/post`
        : 'http://localhost:8081/post';

    try {
      const res  = await fetch(host);
      const json = await res.json();
      setPosts(json.data ?? []);
    } catch (e) {
      console.warn('fetch posts error', e);
    } finally {
      setRefreshing(false);
      setFirstLoad(false);
    }
  }, [posts]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <ScrollView
      style={styles.wrapper}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchPosts(true)}
          colors={['#667eea']}
          tintColor="#667eea"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      <Header />
      <Category />
      <PostList posts={posts} loading={firstLoad && refreshing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 60, backgroundColor: '#f8f9fb' },
});