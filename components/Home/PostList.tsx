import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

type PostListProps = {
  posts: any[];
};

interface Post {
  id: string;
  content: string;
  imageurl?: string;
  createdon: string;
  createdby: string;
  visiblein: string;
}

export default function PostList({ posts = [] }: PostListProps) {
  if (!posts.length) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.emptyCard}
        >
          <Ionicons name="chatbubbles-outline" size={48} color="#FFF" />
          <Text style={styles.emptyTitle}>No Posts Yet</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to share something amazing!
          </Text>
        </LinearGradient>
      </View>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return diffInMins < 1 ? "Just now" : `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return postDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          postDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getUserDisplayName = (email: string) => {
    if (!email || email === "anon") return "Anonymous User";
    return email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getAvatarGradient = (email: string) => {
    const gradients = [
      ["#667eea", "#764ba2"],
      ["#f093fb", "#f5576c"],
      ["#4facfe", "#00f2fe"],
      ["#43e97b", "#38f9d7"],
      ["#fa709a", "#fee140"],
      ["#a8edea", "#fed6e3"],
      ["#ffecd2", "#fcb69f"],
      ["#ff9a9e", "#fecfef"],
    ];
    const hash = email.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <View style={styles.container}>
      {posts.map((post: Post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <LinearGradient
                colors={getAvatarGradient(post.createdby)}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {getUserDisplayName(post.createdby).charAt(0)}
                </Text>
              </LinearGradient>

              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {getUserDisplayName(post.createdby)}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.userHandle}>
                    @{post.createdby.split("@")[0]}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={styles.timeAgo}>
                    {formatTimeAgo(post.createdon)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <View style={styles.postContent}>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>
          
          {post.imageurl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: post.imageurl }}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Post Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={[
                  "rgba(102, 126, 234, 0.1)",
                  "rgba(118, 75, 162, 0.05)",
                ]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="heart-outline" size={20} color="#667eea" />
              </LinearGradient>
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["rgba(52, 152, 219, 0.1)", "rgba(41, 128, 185, 0.05)"]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#3498db" />
              </LinearGradient>
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["rgba(46, 204, 113, 0.1)", "rgba(39, 174, 96, 0.05)"]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="repeat-outline" size={20} color="#2ecc71" />
              </LinearGradient>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <View style={styles.actionSpacer} />

            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="bookmark-outline" size={20} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          {/* Visibility Badge */}
          <View style={styles.visibilityBadge}>
            <Ionicons name="earth" size={12} color="#27ae60" />
            <Text style={styles.visibilityText}>{post.visiblein}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  postCard: {
    backgroundColor: "#FFF",
    marginBottom: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userHandle: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#bdc3c7",
    marginHorizontal: 8,
  },
  timeAgo: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(149, 165, 166, 0.1)",
  },
  postContent: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2c3e50",
    fontWeight: "400",
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionButtonGradient: {
    padding: 8,
    borderRadius: 20,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  actionSpacer: {
    flex: 1,
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(149, 165, 166, 0.1)",
  },
  visibilityBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visibilityText: {
    fontSize: 10,
    color: "#27ae60",
    fontWeight: "600",
    marginLeft: 4,
    textTransform: "uppercase",
  },
});