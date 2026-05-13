import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { CONTAINER_SPACING } from '../../utils/constants';
import { Fonts } from '../../utils/typography';
import Button from '../../components/buttons/Button';

// ─── STEP DATA ──────────────────────────────────────────────────
const STEPS = [
  {
    title: 'Program Created',
    desc: 'Design a personalized plan to achieve your goals.',
    icon: 'checkmark',
  },
  {
    title: 'Today: Build Momentum',
    desc: 'Access over 40 Premium tools to kickstart your success.',
    icon: 'lock-closed-outline',
  },
  {
    title: 'Day 5: Start Seeing Progress',
    desc: "We'll remind you with an email that your trial is ending soon.",
    icon: 'notifications-outline',
  },
  {
    title: 'Day 7: Trial Ends',
    desc: 'Your subscription starts. Cancel beforehand to avoid payment.',
    icon: 'star-outline',
  },
];

const ACTIVE_STEP = 0;

// ─── COMPONENT ──────────────────────────────────────────────────
export default function SubscriptionScreen({ navigation }) {
  const [selected, setSelected] = useState('yearly');
  const { colors } = useTheme();

  // styles factory — called here so colors is always in scope
  const styles = makeStyles(colors);

  return (
    <Container>
      <BackButton
        title="Subscription"
        wrapperStyle={{ padding: CONTAINER_SPACING }}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PAGE TITLE ── */}
        <Text style={styles.pageTitle}>How Your Free Trial Works</Text>

        {/* ── STEPPER PILL CARD ── */}
        <View style={styles.stepperCard}>
          {STEPS.map((step, index) => {
            const isActive = index === ACTIVE_STEP;
            const isPast = index < ACTIVE_STEP;
            const isLast = index === STEPS.length - 1;
            const isHighlighted = isActive || isPast;

            return (
              <View key={index} style={styles.stepRow}>
                {/* Left col: icon circle + vertical connector */}
                <View style={styles.iconCol}>
                  {/* Soft glow behind the active icon */}
                  {isActive && <View style={styles.glowRing} />}

                  {/* Circle icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      isActive && styles.iconCircleActive,
                      isPast && styles.iconCirclePast,
                    ]}
                  >
                    <Icon
                      name={step.icon}
                      size={15}
                      color={
                        isHighlighted ? colors.whitePrimary : colors.tabInactive
                      }
                    />
                  </View>

                  {/* Connector line to next step */}
                  {!isLast && (
                    <View
                      style={[
                        styles.connector,
                        isHighlighted && styles.connectorHighlighted,
                      ]}
                    />
                  )}
                </View>

                {/* Right col: title + description */}
                <View
                  style={[styles.stepTextWrap, isLast && { paddingBottom: 0 }]}
                >
                  <Text
                    style={[
                      styles.stepTitle,
                      isActive && styles.stepTitleActive,
                      isPast && styles.stepTitlePast,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── PLAN CARDS ── */}
        <View style={styles.planRow}>
          {/* Monthly */}
          <TouchableOpacity
            onPress={() => setSelected('monthly')}
            activeOpacity={0.8}
            style={[
              styles.planCard,
              selected === 'monthly' && styles.planCardSelected,
            ]}
          >
            <Text
              style={[
                styles.planLabel,
                selected === 'monthly' && styles.planLabelSelected,
              ]}
            >
              Monthly
            </Text>
            <Text
              style={[
                styles.planPrice,
                selected === 'monthly' && styles.planPriceSelected,
              ]}
            >
              ₹99/mo
            </Text>
          </TouchableOpacity>

          {/* Yearly */}
          <TouchableOpacity
            onPress={() => setSelected('yearly')}
            activeOpacity={0.8}
            style={[
              styles.planCard,
              selected === 'yearly' && styles.planCardSelected,
            ]}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>7 days free</Text>
            </View>
            <Text
              style={[
                styles.planLabel,
                selected === 'yearly' && styles.planLabelSelected,
              ]}
            >
              Yearly
            </Text>
            <Text
              style={[
                styles.planPrice,
                selected === 'yearly' && styles.planPriceSelected,
              ]}
            >
              ₹999/yr
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── NO PAYMENT ROW ── */}
        <View style={styles.noPaymentRow}>
          <Icon
            name="checkmark-circle-outline"
            size={18}
            color={colors.paragraphLight}
          />
          <Text style={styles.noPaymentText}>No Payment Due Now</Text>
        </View>

        {/* ── CTA BUTTON ── */}
      
        <Button
          title="Start my 7-day free trial"
          wrapperStyle={{ marginTop: 'auto' }}
          buttonStyle={{
            borderRadius: 12,
            height: 50,
          }}
          labelStyle={{
            fontFamily: Fonts.primary_Bold,
            color: colors.whitePrimary,
            fontSize: 14,
          }}
        />

        {/* Fine print */}
        <Text style={styles.finePrint}>
          7 days free, then $X per year ($Y/mo)
        </Text>
      </ScrollView>
    </Container>
  );
}

// ─── STYLES FACTORY ─────────────────────────────────────────────
// Accepts colors at call-time so theme values resolve correctly.
// Never call StyleSheet.create() at module level with dynamic values.
const makeStyles = colors =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 36,
      gap: 15,
    },

    /* Page title */
    pageTitle: {
      fontSize: 22,
      fontFamily: Fonts.primary_SemiBold,
      color: colors.blackPrimary,
      lineHeight: 28,
    },

    /* ── STEPPER CARD ── */
    stepperCard: {
      backgroundColor: colors.grayLight,
      borderRadius: 24,
      paddingTop: 22,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },

    stepRow: {
      flexDirection: 'row',
    },

    iconCol: {
      width: 52,
      alignItems: 'center',
    },

    /* Soft glow ring behind active icon */
    glowRing: {
      position: 'absolute',
      top: -6,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.accent + '22', // ~13% opacity
      zIndex: 0,
    },

    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    iconCircleActive: {
      backgroundColor: colors.accent,
    },
    iconCirclePast: {
      backgroundColor: colors.accent + 'AA', // ~67% opacity
    },

    /* Vertical connector line */
    connector: {
      width: 2.5,
      flex: 1,
      minHeight: 24,
      backgroundColor: colors.borderColor,
      borderRadius: 2,
      marginVertical: 5,
    },
    connectorHighlighted: {
      backgroundColor: colors.accent,
    },

    /* Step text */
    stepTextWrap: {
      flex: 1,
      paddingLeft: 10,
      paddingTop: 6,
      paddingBottom: 20,
    },
    stepTitle: {
      fontFamily: Fonts.primary_Medium,
      color: colors.paragraphLight,
      lineHeight: 19,
    },
    stepTitleActive: {
      color: colors.blackPrimary,
      fontFamily: Fonts.primary_SemiBold,
    },
    stepTitlePast: {
      color: colors.paragraph,
      fontFamily: Fonts.primary_Medium,
    },
    stepDesc: {
      fontSize: 12,
      color: colors.paragraphLight,
      marginTop: 3,
      lineHeight: 17,
      fontFamily: Fonts.primary_Regular,
    },

    /* ── PLAN CARDS ── */
    planRow: {
      flexDirection: 'row',
      gap: 10,
    },
    planCard: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 12,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
    },
    planCardSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accent + '0D', // ~5% tint
    },
    planLabel: {
      fontSize: 12,
      fontFamily: Fonts.primary_Medium,
      color: colors.paragraphLight,
      marginBottom: 6,
    },
    planLabelSelected: {
      color: colors.accent,
    },
    planPrice: {
      fontSize: 18,
      fontFamily: Fonts.primary_SemiBold,
      color: colors.blackPrimary,
    },
    planPriceSelected: {
      color: colors.accent,
    },

    /* "7 days free" floating badge */
    badge: {
      position: 'absolute',
      top: -11,
      backgroundColor: colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
    },
    badgeText: {
      color: colors.whitePrimary,
      fontSize: 10,
      fontFamily: Fonts.primary_SemiBold,
    },

    /* ── NO PAYMENT ROW ── */
    noPaymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 11,
      backgroundColor: colors.grayLight,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    noPaymentText: {
      fontSize: 13,
      fontFamily: Fonts.primary_Medium,
      color: colors.paragraphLight,
    },

  

    /* Fine print */
    finePrint: {
      textAlign: 'center',
      fontSize: 11,
      color: colors.paragraphLight,
      fontFamily: Fonts.primary_Regular,
    },
  });
