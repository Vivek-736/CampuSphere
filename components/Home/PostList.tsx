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
    const ms = now - new Date(iso).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
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

  const publicPosts = posts.filter(p => p.visiblein === 'public');

  return (
    <View style={styles.container}>
      {publicPosts.map((p, index) => {
        const isMe = userData?.email === p.createdby;
        const avatar = isMe && userData?.image
          ? { uri: userData.image }
          : require('@/assets/images/user.png');

        const isLastPost = index === publicPosts.length - 1;

        return (
          <View 
            key={p.id} 
            style={[
              styles.card,
              isLastPost && styles.lastCard
            ]}
          >
            <View style={styles.header}>
              <Image source={avatar} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.name} numberOfLines={1}>
                  {isMe ? userData?.name : p.createdby.split('@')[0]}
                </Text>
                <Text style={styles.time}>{timeAgo(p.createdon)}</Text>
              </View>
            </View>

            <Text style={styles.content}>{p.content}</Text>

            {p.imageurl && (
              <View style={styles.mediaContainer}>
                <Image
                  source={{ uri: p.imageurl }}
                  style={styles.media}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 10
  },
  
  center: { 
    alignItems: 'center', 
    marginTop: 40,
    paddingHorizontal: 16,
  },
  
  muted: { 
    fontSize: 16, 
    color: '#7f8c8d',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f2f5',
  },

  lastCard: {
    marginBottom: 60,
  },

  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
  },

  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginRight: 12, 
    backgroundColor: '#e1e8ed',
    borderWidth: 2,
    borderColor: '#f0f2f5',
  },

  userInfo: {
    flex: 1,
  },

  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1a202c',
    marginBottom: 2,
  },

  time: { 
    fontSize: 13, 
    color: '#718096',
  },

  content: { 
    fontSize: 15, 
    lineHeight: 22, 
    color: '#2d3748',
    marginBottom: 16,
  },

  mediaContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f7fafc',
  },

  media: {
    width: '100%',
    height: 240,
    backgroundColor: '#e2e8f0',
  },
});