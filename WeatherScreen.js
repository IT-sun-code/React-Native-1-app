import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

const WeatherScreen = ({ route, navigation }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Получение погодных данных при загрузке страницы
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${route.params.city}&appid=a60c0a08e6c8cfa38839a32d9ccc8f33&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log("Error fetching weather data:", error);
      setError(true);
    }
  };

  const weather = weatherData?.weather[0].main.toLowerCase();
  const formattedCity = route.params.city.replaceAll("%20", "-");

  const getWeatherImage = () => {
    if (error) return require("./images/404.png");
    if (!weather) return null;
    switch (weather) {
      case "clear":
        return require("./images/clear.png");
      case "clouds":
        return require("./images/cloud.png");
      case "mist":
        return require("./images/mist.png");
      case "rain":
        return require("./images/rain.png");
      case "snow":
        return require("./images/snow.png");
      default:
        return require("./images/404.png");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{error ? "Not Found" : formattedCity}</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"\u2190"} Back to To-Do List</Text>
      </TouchableOpacity>
      <View style={styles.weatherContainer}>
        {getWeatherImage() && (
          <Image source={getWeatherImage()} style={styles.weatherImage} />
        )}
        {weatherData && !error && (
          <View>
            <Text style={styles.temperatureText}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.temperatureText}>{weather}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    color: "#3D4F88",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    marginTop: 20,
    fontSize: 18,
    color: "#FEC7FF",
  },
  weatherContainer: {
    alignItems: "center",
  },
  weatherImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  temperatureText: {
    textAlign: "center",
    fontSize: 24,
  },
});

export default WeatherScreen;
