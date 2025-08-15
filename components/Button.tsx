import { Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/data/Colors";

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: object;
}

export default function Button({ text, onPress, style }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        marginTop: 15,
        marginHorizontal: 14,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}