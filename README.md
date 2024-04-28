# react-native-logger

Simple logger to wrap console and keep track of latest logs

## Installation

```sh
npm install react-native-logger
```

## Usage

```js
import { LoggerProvider, useLoggerActions, getLogger } from '@siteed/react-native-logger'

// To use outside react component, you can call getLogger directly
const outLogger = getLogger(`out`);
outLogger.debug(`This is a debug message`);
outLogger.info(`This is an info message`);
outLogger.warn(`This is a warning message`);
outLogger.error(`This is an error message`);

const App = () => {
  const { logger } = useLoggerActions('App')
  useEffect( () => {
    logger.log(`App mounted`)
  })

  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

const WithLogger = () => {
  return (
    <LoggerProvider>
      <App />
    </LoggerProvider>
  )
}
export default WithLogger
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Try it out
```bash
yarn example web
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
