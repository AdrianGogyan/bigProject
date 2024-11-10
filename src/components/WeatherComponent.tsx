import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaSearch  } from "react-icons/fa";
import weatherIcon64px from '../assets/weatherIcon64px.png';
import "./WeatherComponent.scss";

const WeatherComponent: React.FC = () => {
    const [toogleWeatherComponents, setToggleWeatherComponent] = useState<boolean>(false);
    const [savedCities, setSavedCities] = useState<string[]>([]);
    const [city, setCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<any>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const apiKey: string | undefined = import.meta.env.VITE_API_KEY;

    // Load cities from localStorage when component mounts
    useEffect(() => {
        const cities = JSON.parse(localStorage.getItem('cities') || '[]');
        setSavedCities(cities);
        console.log(savedCities);
    }, []);

    function saveCityToLocalStorage(city: string) {
        // Convert city to lowercase for consistent storage and comparison
        const lowerCaseCity = city.toLowerCase();

        // Check if city is already in savedCities to avoid duplicates
        if (!savedCities.includes(lowerCaseCity)) {
            const updatedCities = [...savedCities, lowerCaseCity];
            setSavedCities(updatedCities);
            localStorage.setItem('cities', JSON.stringify(updatedCities));
        }
    }

    function toogleWeatherAction() {
        setToggleWeatherComponent((e) => !e);
    }

    function resetComponent() {
        setCity('');
        setWeatherData(null);
        setSubmitted(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === 'Enter'){
            submitAction();
        }
    }

    async function submitAction() {
        if(!city)
            return(alert('Please enter a city name'))
        setSubmitted(true);
        // console.log(submitted);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setWeatherData(data);

            // Save city to localStorage if it is not already saved
            if (city) {
                saveCityToLocalStorage(city);
            }
        } catch (error) {
            console.error("Error fetching the data from the clouds:", error);
        }
    }

    return (
        <div className="WeatherComponent">
            {!toogleWeatherComponents ? (
                <img 
                    className="weatherComponentToggleButton" 
                    src={weatherIcon64px} 
                    alt="Weather toggle action button" 
                    onClick={toogleWeatherAction}    
                />
            ) : (
                <div className="displayWeather">
                    <div className="displayWeather-navbar">
                        <FaAngleLeft 
                            className="displayWeather-navbar-backButton"
                            onClick={toogleWeatherAction} />
                        <h3>Weather</h3>

                    </div>
                    
                    {!submitted &&
                        (<div className="displayWeather-search">
                            <input
                                className="displayWeather-search-input"
                                type="text"
                                placeholder="Type your city"
                                value={city}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setCity(e.target.value)}
                                
                            />
                            <FaSearch
                                onClick={submitAction}
                            />
                        </div>
                    )}

                    {submitted && !weatherData && (
                        <div className="loading-div">Loading...</div>
                    )}
                    {submitted && weatherData && (
                        <div className="displayWeather-weatherDetails">
                            <p>{city}</p>
                        
                            <p className="weatherDetails-temperature">
                                {weatherData.main.temp}°C
                            </p>
                            <p className="weatherDetails-description">
                                {weatherData.weather[0].description}
                            </p>
                            <p className="weatherDetails-wind">
                                Wind: {weatherData.wind.speed} km/h
                            </p>
                            <p onClick={resetComponent}>Search for another city</p>
                        </div>
                    )}
                    
                    
                </div>
            )}
        </div>
    );
};

export default WeatherComponent;
