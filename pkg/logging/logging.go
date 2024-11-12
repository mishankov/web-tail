package logging

import (
	"fmt"
	"os"
	"runtime"
	"time"

	"github.com/mishankov/go-utlz/cliutils"
)

type Logger struct {
	name     string
	logLevel LogLevel
	parent   *Logger
}

func NewLogger(name string) Logger {
	l := Logger{name: name}
	l.logLevel = l.GetLogLevelFromEnv()
	return l
}

func NewLoggerFromParent(name string, parent *Logger) Logger {
	l := Logger{name: name, parent: parent}
	l.logLevel = l.GetLogLevelFromEnv()
	return l
}

func (l *Logger) FullLoggerName() string {
	if l.parent == nil {
		return l.name
	}

	return l.parent.FullLoggerName() + "." + l.name
}

func (l *Logger) CallLocation() string {
	pc := make([]uintptr, 15)
	n := runtime.Callers(4, pc)
	frames := runtime.CallersFrames(pc[:n])
	frame, _ := frames.Next()

	return frame.Function
}

func (l *Logger) GetLogLevelFromEnv() LogLevel {
	currentLoggerLevel := cliutils.GetEnvOrDefault("LOG_LEVEL_"+l.FullLoggerName(), "None")

	switch currentLoggerLevel {
	case "None":
	case logLevels.Debug.name:
		return logLevels.Debug
	case logLevels.Info.name:
		return logLevels.Info
	case logLevels.Warn.name:
		return logLevels.Warn
	case logLevels.Error.name:
		return logLevels.Error
	case logLevels.Fatal.name:
		return logLevels.Fatal
	}

	globalLoggerLevel := cliutils.GetEnvOrDefault("LOG_LEVEL", "None")

	switch globalLoggerLevel {
	case "None":
	case logLevels.Debug.name:
		return logLevels.Debug
	case logLevels.Info.name:
		return logLevels.Info
	case logLevels.Warn.name:
		return logLevels.Warn
	case logLevels.Error.name:
		return logLevels.Error
	case logLevels.Fatal.name:
		return logLevels.Fatal
	}

	return logLevels.Info
}

func (l *Logger) ShouldWriteLog(logLevel LogLevel) bool {
	return logLevel.level >= l.logLevel.level
}

type LogLevel struct {
	name  string
	level int
}

type LogLevels struct {
	Debug LogLevel
	Info  LogLevel
	Warn  LogLevel
	Error LogLevel
	Fatal LogLevel
}

var logLevels LogLevels = LogLevels{
	Debug: LogLevel{"Debug", 0},
	Info:  LogLevel{"Info", 1},
	Warn:  LogLevel{"Warn", 2},
	Error: LogLevel{"Error", 3},
	Fatal: LogLevel{"Fatal", 4},
}

func (l *Logger) Logf(logLevel LogLevel, message string, a ...any) {
	message = fmt.Sprintf(message, a...)
	fmt.Printf("[%s] [%s] [%s] [%s] - %s\n", time.Now().Format("2006-01-02 15:04:05 GMT-0700"), l.FullLoggerName(), l.CallLocation(), logLevel.name, message)
}

func (l *Logger) Log(logLevel LogLevel, message ...any) {
	// TODO: got to do something better
	prefix := fmt.Sprintf("[%s] [%s] [%s] [%s] - ", time.Now().Format("2006-01-02 15:04:05 GMT-0700"), l.FullLoggerName(), l.CallLocation(), logLevel.name)
	fmt.Print(prefix)
	fmt.Println(message...)
	// fmt.Printf("[%s] [%s] [%s] [%s] - %s\n", time.Now().Format("2006-01-02 15:04:05 GMT-0700"), l.CallLocation(), l.FullLoggerName(), logLevel.name, message)
}

func (l *Logger) Debug(message ...any) {
	if l.ShouldWriteLog(logLevels.Debug) {
		l.Log(logLevels.Debug, message...)
	}
}
func (l *Logger) Debugf(message string, a ...any) {
	if l.ShouldWriteLog(logLevels.Debug) {
		l.Logf(logLevels.Debug, message, a...)
	}
}

func (l *Logger) Info(message ...any) {
	if l.ShouldWriteLog(logLevels.Info) {
		l.Log(logLevels.Info, message...)
	}
}
func (l *Logger) Infof(message string, a ...any) {
	if l.ShouldWriteLog(logLevels.Info) {
		l.Logf(logLevels.Info, message, a...)
	}
}

func (l *Logger) Warn(message ...any) {
	if l.ShouldWriteLog(logLevels.Warn) {
		l.Log(logLevels.Warn, message...)
	}
}
func (l *Logger) Warnf(message string, a ...any) {
	if l.ShouldWriteLog(logLevels.Warn) {
		l.Logf(logLevels.Warn, message, a...)
	}
}

func (l *Logger) Error(message ...any) {
	if l.ShouldWriteLog(logLevels.Error) {
		l.Log(logLevels.Error, message...)
	}
}
func (l *Logger) Errorf(message string, a ...any) {
	if l.ShouldWriteLog(logLevels.Error) {
		l.Logf(logLevels.Error, message, a...)
	}
}

func (l *Logger) Fatal(message ...any) {
	if l.ShouldWriteLog(logLevels.Fatal) {
		l.Log(logLevels.Fatal, message...)
	}
	os.Exit(1)
}
func (l *Logger) Fatalf(message string, a ...any) {
	if l.ShouldWriteLog(logLevels.Fatal) {
		l.Logf(logLevels.Fatal, message, a...)
	}
	os.Exit(1)
}
