# react-native-logger

Simple logger to wrap console and keep track of latest logs

## Installation

```sh
npm install react-native-logger
```

## Usage

```js
const App = () => {
  const { logger } = useLogger('App')
  useEffect( () => {
    logger.debug(`App mounted`)
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

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
