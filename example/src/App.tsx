import * as React from 'react';
import {
  LoggerProvider,
  getLogger,
  useLoggerActions,
} from '@siteed/react-native-logger';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StyleSheet, View, Text } from 'react-native';
import { LogViewer } from './log-viewer';
import { Button } from 'react-native-paper';

const outLogger = getLogger('out');
outLogger.log('outLogger.log');

const Other = () => {
  const { logger } = useLoggerActions('Other');
  return (
    <View>
      <Text>Other Component</Text>
      <Button mode="outlined" onPress={() => logger.log('Button pressed')}>
        Other Press Button
      </Button>
    </View>
  );
};
export function App() {
  const { logger } = useLoggerActions('App');

  React.useEffect(() => {
    logger.debug(`App mounted`, [1], 2, [3]);
  }, [logger]);

  return (
    <View style={styles.container}>
      <Text>Check logs...</Text>
      <Other />
      <Button mode="outlined" onPress={() => logger.debug('Button pressed')}>
        Press me
      </Button>
      <LogViewer />
    </View>
  );
}

export default function WithLogger() {
  return (
    <SafeAreaProvider>
      <LoggerProvider>
        <App />
      </LoggerProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
