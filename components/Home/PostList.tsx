import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUser } from '@/context/UserContext';

type Post = {
  id: string;
  content: string;
  imageurl?: string;
  createdon: string;
  createdby: string;
  visiblein: string;
};

export default function PostList({
  posts = [],
  loading = false,
}: {
  posts: Post[];
  loading?: boolean;
}) {
  const { userData } = useUser();

  const timeAgo = (iso: string) => {
    const now = Date.now();
    const ms  = now - new Date(iso).getTime();
    const m   = Math.floor(ms / 60000);
    if (m < 1)        return 'Just now';
    if (m < 60)       return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)       return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)        return `${d}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (loading)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Loading posts…</Text>
      </View>
    );

  if (!posts.length)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No posts yet</Text>
      </View>
    );

  return (
    <View style={{ marginTop: 24 }}>
      {posts.map(p => {
        if (p.visiblein !== 'public') return null;

        const isMe   = userData?.email === p.createdby;
        const avatar = isMe && userData?.image
          ? { uri: userData.image }
          : require('@/assets/images/user.png');

        return (
          <View key={p.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={avatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {isMe ? userData?.name : p.createdby.split('@')[0]}
                </Text>
                <Text style={styles.time}>{timeAgo(p.createdon)}</Text>
              </View>
            </View>

            <Text style={styles.content}>{p.content}</Text>

            {p.imageurl && (
              <Image
                source={{ uri: p.imageurl }}
                style={styles.media}
                resizeMode="cover"
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: 40 },
  muted:  { fontSize: 16, color: '#7f8c8d' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  row:   { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar:{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#e1e8ed' },
  name:  { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  time:  { fontSize: 12, color: '#7f8c8d', marginTop: 2 },

  content: { fontSize: 15, lineHeight: 22, color: '#34495e' },

  media:   { width: '100%', height: 200, borderRadius: 12, marginTop: 12 },
});