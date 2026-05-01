import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { useAppBlocker } from '../../context/AppBlockerContext';

import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';
import { LockIcon } from '../../utils/svg';
import { useNavigation } from '@react-navigation/native';

export default function AppsListScreen() {
  const { colors } = useTheme();
  const state = useAppBlocker();
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => {
    const isBlocked = state.isBlocking;
    const isLocked = state.selected.includes(item.package);
    const timer = state.timers[item.package] || 10;
    console.log('isBlocked', isBlocked);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('BlockingConditions', {
            app: item,
            isLocked,
            timer
          });
        }}
        style={[
          styles.item,
          {
            borderBottomWidth: index !== state.apps.length - 1 ? 1 : 0,
            borderColor: colors.borderColor,
          },
        ]}
      >
        {/* LEFT */}
        <View style={styles.left}>
          {item.icon ? (
            <Image source={{ uri: item.icon }} style={styles.appIcon} />
          ) : (
            <View
              style={[
                styles.placeholderIcon,
                { backgroundColor: colors.placeholder },
              ]}
            />
          )}

          <Text
            style={[styles.appName, { color: colors.blackPrimary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>

        {/* RIGHT STATUS */}
        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor:
                isLocked && !state.unlocked.includes(item.package)
                  ? 'rgba(11,218,81,0.15)'
                  : colors.placeholder,
            },
          ]}
        >
          <LockIcon
            color={
              isLocked && !state.unlocked.includes(item.package)
                ? 'rgb(11,218,81)'
                : colors.paragraphLight
            }
            size={18}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={{ paddingHorizontal: CONTAINER_SPACING }}>
          <BackButton
            title="Blocked Apps"
            wrapperStyle={{ padding: CONTAINER_SPACING }}
          />
        </View>

        {/* LIST CONTAINER (LIKE QUICK ACTIONS) */}
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <FlatList
            data={state.apps}
            keyExtractor={item => item.package}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Container>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  appIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12,
  },

  placeholderIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12,
  },

  appName: {
    fontSize: 14,
    fontFamily: Fonts.primary_Medium,
    flex: 1,
  },

  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
