import { env } from '@/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * 로거 유틸
 * - 환경변수로 로그 레벨 제어
 * - 프로덕션에서는 debug 로그 제외
 */
class Logger {
  private minLevel: number;

  constructor(level: LogLevel = 'info') {
    this.minLevel = LOG_LEVELS[level];
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data !== undefined) {
      return [prefix, message, data];
    }
    return [prefix, message];
  }

  debug(message: string, data?: unknown) {
    if (this.shouldLog('debug')) {
      console.debug(...this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: unknown) {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', message, data));
    }
  }

  error(message: string, data?: unknown) {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', message, data));
    }
  }
}

export const logger = new Logger(env.NEXT_PUBLIC_LOG_LEVEL);
