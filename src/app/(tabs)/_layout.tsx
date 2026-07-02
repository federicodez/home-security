import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useProfile } from "@/api/profiles";

export default function TabLayout() {
  const { data: user } = useProfile();
  const canManageRoster = user?.role === "admin";
  const GOLD = "#D4BE8F";
  const TAB_BG = "#111111";
  const ACTIVE_BG = "rgba(212,190,143,0.14)";
  const INACTIVE = "#8A90A3";
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 1,
          borderTopColor: "rgba(212,190,140,0.15)",
          height: 92,
          paddingTop: 8,
          paddingBottom: 22,
        },

        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: INACTIVE,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
        },

        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 6,
          marginVertical: 6,
          paddingHorizontal: 12,
        },

        tabBarActiveBackgroundColor: ACTIVE_BG,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "8 AM",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="shield-outline"
              size={size + 5}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="second"
        options={{
          title: "9:30",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="shield-outline"
              size={size + 5}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="third"
        options={{
          title: "11 AM",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="shield-outline"
              size={size + 5}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="volunteers"
        options={{
          title: canManageRoster ? "Roster" : "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={canManageRoster ? "account-group-outline" : "account-outline"}
              size={size + 6}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
