import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TodoScreen({ navigation }) {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [city, setCity] = useState("");

  // Загрузка данных из AsyncStorage при запуске приложения
  useEffect(() => {
    loadTaskList();
  }, []);

  // Сохранение данных в AsyncStorage при изменении списка задач
  useEffect(() => {
    saveTaskList();
  }, [taskList]);

  const addTask = () => {
    if (task) {
      const newTaskList = [
        { id: Date.now(), task, completed: false },
        ...taskList,
      ];
      setTaskList(newTaskList);
      setTask("");
    }
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTaskList = taskList.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    setTaskList(updatedTaskList);
  };

  const deleteTask = (taskId) => {
    const updatedTaskList = taskList.filter((item) => item.id !== taskId);
    setTaskList(updatedTaskList);
  };

  // Загрузка данных из AsyncStorage
  const loadTaskList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("taskList");
      const savedTaskList = JSON.parse(jsonValue);
      if (savedTaskList) {
        setTaskList(savedTaskList);
      }
    } catch (error) {
      console.log("Error loading task list from AsyncStorage:", error);
    }
  };

  // Сохранение данных в AsyncStorage
  const saveTaskList = async () => {
    try {
      const jsonValue = JSON.stringify(taskList);
      await AsyncStorage.setItem("taskList", jsonValue);
    } catch (error) {
      console.log("Error saving task list to AsyncStorage:", error);
    }
  };

  const handleWeatherPress = () => {
    if (city) {
      // Замена тире на %20, если есть
      const formattedCity = city.replaceAll("-", "%20");
      // Приведение первой буквы города к верхнему регистру
      const capitalizedCity =
        formattedCity.charAt(0).toUpperCase() + formattedCity.slice(1);
      // Поиск тире и установка буквы после тире в верхний регистр
      const finalCity = capitalizedCity
        .trim()
        .replace(/-([a-z])/g, (match, letter) => {
          return "-" + letter.toUpperCase();
        });
      // Переход на экран погоды с отформатированным городом
      navigation.navigate("Weather", { city: finalCity });
    } else {
      // Оповещение пользователя о необходимости заполнить инпут
      alert("Please enter a city");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>MultyApp</Text>
      <Text style={styles.title}>Weather for your plans</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a city"
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleWeatherPress}>
          <Text style={styles.addButtonText}>Weather</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>add</Text>
        </TouchableOpacity>
      </View>
      {taskList.length === 0 ? (
        <Text style={styles.taskText}>No ToDo</Text>
      ) : (
        taskList.map((item) => (
          <View key={item.id} style={styles.taskContainer}>
            <TouchableOpacity
              style={styles.taskButton}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}
              >
                {item.task}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  mainTitle: {
    color: "#557EFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  title: {
    color: "#3D4F88",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#3D4F88",
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 10,
    // outlineColor: "transparent",
  },
  addButton: {
    color: "#fff",
    backgroundColor: "#3D4F88",
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    borderColor: "#FEC7FF",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
  },
  taskButton: {
    flex: 1,
  },
  taskText: {
    color: "#557EFF",
    fontSize: 18,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#3D4F88",
  },
  deleteButton: {
    backgroundColor: "#FEC7FF",
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
