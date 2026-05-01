import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../layout/Container';
import {
  CONTAINER_SPACING,
  SCREEN_FONT_SCALE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../utils/constants';
import { Fonts } from '../../utils/typography';
import Icon from '../../utils/icons';
import { useTheme } from '../../context/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Navigate_Accessibility } from '../../routes/path';
import { markOnboardingComplete } from '../../routes/RootNavigation';
const IMAGE_WIDTH = SCREEN_WIDTH - CONTAINER_SPACING * 2;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.6;

const data = [
  {
    image:
      'https://images.unsplash.com/vector-1753200161285-4d8af2394bd7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    heading: 'From Watching to Learning',
    description:
      'ScreenToSkill turns your screen time into skill time — helping you grow smarter every day.',
  },
  {
    image:
      'https://img.freepik.com/free-vector/men-teamwork-corporate-with-hourglass-leaves_24877-54787.jpg?t=st=1777383701~exp=1777387301~hmac=c824468bddd05bf4f8be82a516d47bc348d52af5a1a87fc797cb01f5e664e909&w=1480',
    heading: 'Use Your Time Intentionally',
    description:
      'Shift from passive scrolling to purposeful usage with tools designed to build better habits.',
  },
  {
    image:
      'https://img.freepik.com/free-vector/flat-illustration-safer-internet-day_23-2151127494.jpg?t=st=1777383801~exp=1777387401~hmac=74e89d7f62b0d9c21b9cc6a37361625e2a22eb95e7855938ff82c22a86fee2bb&w=1480',
    heading: 'Unlock Growth, Not Distractions',
    description:
      'Complete quick challenges to unlock apps — turning every unlock into a moment of learning.',
  },
];
const OnBoarding = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const ref = React.useRef(null);

  const onMomentumScrollEnd = event => {
    const index = Math.floor(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );
    if (index === -1) {
      return;
    }
    setCurrentSlideIndex(index);
  };

// ✅ Fixed — only mark complete when actually finishing onboarding
const goToNextSlide = async () => {
  if (currentSlideIndex === data?.length - 1) {
    await markOnboardingComplete(); // ← here, only on last slide
    navigation.replace(Navigate_Accessibility);
    return;
  }
  setCurrentSlideIndex(currentSlideIndex + 1);
};
  const skipSlide = async () => {
    await markOnboardingComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: Navigate_Accessibility }],
    });
  };

  useEffect(() => {
    ref?.current?.scrollToIndex({
      animated: true,
      index: currentSlideIndex,
      viewPosition: 0.5,
    });
    return () => {};
  }, [currentSlideIndex]);

  const renderBoardingItems = () => {
    return (
      <FlatList
        data={data}
        ref={ref}
        horizontal
        snapToAlignment="center"
        pagingEnabled
        snapToInterval={SCREEN_WIDTH}
        showsHorizontalScrollIndicator={false}
        decelerationRate={'fast'}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View
              key={index}
              style={{
                width: SCREEN_WIDTH,
                paddingHorizontal: CONTAINER_SPACING,
              }}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item?.image }} style={styles.image} />
              </View>
              <View style={styles.contentContainer}>
                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={[styles.heading, { color: colors.blackPrimary }]}
                  >
                    {item.heading}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.paragraph, { color: colors.paragraph }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    );
  };
  const indicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {data?.map((item, index) => {
          const indicatorStyle = {
            backgroundColor:
              currentSlideIndex === index
                ? colors.accent
                : colors.paragraphLight,
            width: currentSlideIndex === index ? 20 : 5,
          };
          return (
            <View key={index} style={[styles.indicator, indicatorStyle]} />
          );
        })}
      </View>
    );
  };

  return (
    <Container>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: CONTAINER_SPACING,
          }}
        >
          <View>{indicator()}</View>
          <TouchableOpacity onPress={skipSlide}>
            <Text
              style={{
                fontFamily: Fonts.primary_Bold,
                color: colors.accent,
                fontSize: 14,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        {renderBoardingItems()}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: CONTAINER_SPACING,
          }}
        >
          <TouchableOpacity
            onPress={goToNextSlide}
            style={[styles.nextButton, { backgroundColor: colors.accent }]}
          >
            {currentSlideIndex === data.length - 1 ? (
              <Text
                style={{
                  fontFamily: Fonts.primary_Bold,
                  color: colors.whitePrimary,
                  fontSize: 14,
                }}
              >
                Start
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: Fonts.primary_Bold,
                  color: colors.whitePrimary,
                  fontSize: 14,
                }}
              >
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '7%',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 14,
  },

  mask: {
    width: IMAGE_WIDTH,
    backgroundColor: '#fff',
    height: 100,
    borderTopLeftRadius: 10,
  },

  container: {
    // padding: CONTAINER_SPACING,
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: '10%',
    flex: 1,
  },

  heading: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontFamily: Fonts.primary_Bold,
    textAlign: 'center',
  },

  paragraph: {
    fontFamily: Fonts.secondary_Regular,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicator: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#f00',
  },
  nextButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#f00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
