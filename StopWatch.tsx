import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

function Timer({ interval }: { interval: string }) {
  return <Text style={styles.timer}>{interval}</Text>;
}

function Timer2({ interval, visible }: { interval: string, visible: boolean }) {
  if (!visible) {
    return null;
  }
  return <Text style={styles.timer2}>{interval}</Text>;
}

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null); // Thời gian bắt đầu của stop watch
  const [showTimer2, setShowTimer2] = useState(false); // Kiểm soát việc hiển thị của Timer2
  const [showLapTime, setShowLapTime] = useState(false); // Kiểm soát việc hiển thị của lapTime

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
    setShowTimer2(true); // Hiển thị Timer2 khi bấm nút Start
    setShowLapTime(true); // Hiển thị lapTime khi bấm nút Start
    if (!isRunning) {
      const currentTime = Date.now();
      setStartTimestamp(currentTime); // Lưu thời gian bắt đầu của stop watch
    }
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setShowTimer2(false); // Ẩn Timer2 khi reset
    setShowLapTime(false); // Ẩn lapTime khi reset
  };

  const lapTimer = () => {
    if (isRunning) {
      const currentTime = Date.now(); // Thời gian bấm lap hiện tại
      let lapTime: number;
      if (startTimestamp) {
        lapTime = currentTime - startTimestamp;
      } else {
        lapTime = 0;
      }
      setLaps((prevLaps) => [...prevLaps, lapTime]);
      setStartTimestamp(currentTime); // Cập nhật thời gian bắt đầu của lap mới
      setShowTimer2(true); // Hiển thị Timer2 khi bấm nút Lap
    }
  };

  const formatTime = (time: number) => {
    const date = new Date(time);
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = Math.floor(date.getMilliseconds() / 10)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds},${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Timer interval={formatTime(time)} />
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={isRunning ? lapTimer : resetTimer}
          >
            <Text style={styles.buttonText}>
              {isRunning ? "Lap" : "Reset"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>
              {isRunning ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lapsContainer}>
          {laps.map((lap, index) => (
            <View style={styles.lapRow} key={index}>
              <Text style={styles.lapText}>Lap {index + 1}</Text>
              <Timer2 interval={formatTime(time)} visible={index === laps.length - 1 && showTimer2} />
              <Text style={styles.lapTime}>{formatTime(lap)}</Text>
            </View>
          ))}
          {showLapTime && (
            <View style={styles.lapRow}>
              <Text style={styles.lapText}>Current Lap</Text>
              <Timer2 interval={formatTime(time)} visible={showTimer2} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  timerContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    color: "white",
    fontSize: 70,
  },
  timer2: {
    color: "white",
    fontSize: 18,
  },
  controlsContainer: {
    flex: 6,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  lapsContainer: {
    flex: 5,
  },
  lapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lapText: {
    color: "white",
    fontSize: 18,
  },
  lapTime: {
    color: "white",
    fontSize: 18,
  },
});

export default StopWatch;
