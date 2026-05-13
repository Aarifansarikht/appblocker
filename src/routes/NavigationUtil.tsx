import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let isNavigationReady = false;

// Track navigation state changes
navigationRef.addListener('state', () => {
  isNavigationReady = navigationRef.isReady();
});

export function navigate(routeName: string, params?: object) {
  if (isNavigationReady) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  } else {
    // Poll for navigation readiness with immediate feedback
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.dispatch(CommonActions.navigate(routeName, params));
      }
    }, 16); // Check every frame (60fps)
  }
}

export function replace(routeName: string, params?: object) {
  if (isNavigationReady) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.dispatch(StackActions.replace(routeName, params));
      }
    }, 16);
  }
}

export function resetAndNavigate(routeName: string) {
  if (isNavigationReady) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: routeName }],
          }),
        );
      }
    }, 16);
  }
}

export function goBack() {
  if (isNavigationReady) {
    navigationRef.dispatch(CommonActions.goBack());
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.dispatch(CommonActions.goBack());
      }
    }, 16);
  }
}

export function push(routeName: string, params?: object) {
  if (isNavigationReady) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  } else {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        navigationRef.dispatch(StackActions.push(routeName, params));
      }
    }, 16);
  }
}

export function prepareNavigation() {
  return new Promise<void>((resolve) => {
    if (navigationRef.isReady()) {
      resolve();
    } else {
      const interval = setInterval(() => {
        if (navigationRef.isReady()) {
          clearInterval(interval);
          resolve();
        }
      }, 16);
    }
  });
}