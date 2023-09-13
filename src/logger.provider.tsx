import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

interface LogEntry {
  message: string;
  context: string;
  timestamp: Date;
}

interface AddLogParams {
  context: string;
  level: string;
  message: string;
  params?: unknown[];
}

interface LoggerMethods {
  log: (message: string, ...params: unknown[]) => void;
  info: (message: string, ...params: unknown[]) => void;
  debug: (message: string, ...params: unknown[]) => void;
  warn: (message: string, ...params: unknown[]) => void;
  error: (message: string, ...params: unknown[]) => void;
}

const LoggerActionsContext = createContext<
  | {
      getLogger: (context: string) => LoggerMethods;
      clearLogs: () => void;
    }
  | undefined
>(undefined);

const LoggerStateContext = createContext<
  | {
      logs: LogEntry[];
      refreshLogs: () => void;
    }
  | undefined
>(undefined);

interface LoggerProviderProps {
  children: ReactNode;
}

export const LoggerProvider: React.FC<LoggerProviderProps> = ({ children }) => {
  const logsRef = useRef<LogEntry[]>([]);
  const [, forceUpdate] = useState({});
  const loggersMap = useRef(new Map<string, LoggerMethods>());

  const addLog = ({ context, level, message, params = [] }: AddLogParams) => {
    const fullMessage = `[${level.toUpperCase()}] ${message} ${
      JSON.stringify(params) ?? ''
    }`;
    const newLog: LogEntry = {
      message: fullMessage,
      context,
      timestamp: new Date(),
    };
    logsRef.current = [newLog, ...logsRef.current];

    if (__DEV__) {
      const messageWithContext = `[${context}] ${message}`;
      switch (level) {
        case 'debug':
          console.debug(messageWithContext, params.length > 0 ? params : '');
          break;
        case 'info':
          console.info(messageWithContext, params.length > 0 ? params : '');
          break;
        case 'warn':
          console.warn(messageWithContext, params.length > 0 ? params : '');
          break;
        case 'error':
          console.error(messageWithContext, params.length > 0 ? params : '');
          break;
        default:
          console.log(messageWithContext, params.length > 1 ? params : '');
          break;
      }
    }
  };

  const getLogger = (context: string) => {
    if (loggersMap.current.has(context)) {
      return loggersMap.current.get(context)!;
    }

    const logger = {
      log: (message: string, ...params: unknown[]) =>
        addLog({ context, level: 'log', message, params }),
      info: (message: string, ...params: unknown[]) =>
        addLog({ context, level: 'info', message, params }),
      debug: (message: string, ...params: unknown[]) =>
        addLog({ context, level: 'debug', message, params }),
      warn: (message: string, ...params: unknown[]) =>
        addLog({ context, level: 'warn', message, params }),
      error: (message: string, ...params: unknown[]) =>
        addLog({ context, level: 'error', message, params }),
    };

    loggersMap.current.set(context, logger);
    return logger;
  };

  const refreshLogs = useCallback(() => {
    forceUpdate({});
  }, []);

  const clearLogs = () => {
    logsRef.current = [];
    refreshLogs(); // Trigger a re-render after clearing logs
  };

  return (
    <LoggerActionsContext.Provider value={{ getLogger, clearLogs }}>
      <LoggerStateContext.Provider
        value={{ logs: logsRef.current, refreshLogs }}
      >
        {children}
      </LoggerStateContext.Provider>
    </LoggerActionsContext.Provider>
  );
};

export const useLoggerActions = (
  context: string
): {
  logger: LoggerMethods;
  clearLogs: () => void;
} => {
  const loggerContext = useContext(LoggerActionsContext);
  if (!loggerContext) {
    throw new Error('useLoggerActions must be used within a LoggerProvider');
  }
  const logger = loggerContext.getLogger(context);
  return {
    logger,
    clearLogs: loggerContext.clearLogs,
  };
};

export const useLoggerState = (): {
  logs: LogEntry[];
  refreshLogs: () => void;
} => {
  const stateContext = useContext(LoggerStateContext);
  if (!stateContext) {
    throw new Error('useLoggerState must be used within a LoggerProvider');
  }
  return {
    logs: stateContext.logs,
    refreshLogs: stateContext.refreshLogs,
  };
};
