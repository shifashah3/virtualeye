import React from "react";
import { View, StyleSheet, I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
// import * as Updates from "expo-updates";
import { Platform } from "react-native";


import { AccessibleButton } from "@/components/AccessibleButton";
import { AccessibleText } from "@/components/AccessibleText";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";

const languages = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو" },
];

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const colors = useAccessibleColors();

const changeLanguage = async (code: string) => {
  const isRTL = code === "ur";

  // 1️⃣ Change language
  await i18n.changeLanguage(code);

  // 2️⃣ Handle RTL
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // 3️⃣ Reload safely
    if (Platform.OS === "web") {
      window.location.reload();
    } else {
      console.log("Restart app to apply RTL");
    }
  }
};


  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AccessibleText style={styles.title} level={1}>
        {t("settings.language")}
      </AccessibleText>

      {languages.map((lang) => {
        const isSelected = i18n.language === lang.code;

        return (
          <AccessibleButton
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            style={[
              styles.langButton,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.secondary,
              },
            ]}
            accessibilityLabel={lang.label}
          >
            <AccessibleText
              style={{
                color: colors.textInverse,
                fontSize: 18,
                fontWeight: "700",
                textAlign: I18nManager.isRTL ? "right" : "left",
              }}
            >
              {lang.label}
            </AccessibleText>
          </AccessibleButton>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 24,
  },
  langButton: {
    minHeight:64,
    paddingVertical:14,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems:"center"
  },
});

export default SettingsScreen;

