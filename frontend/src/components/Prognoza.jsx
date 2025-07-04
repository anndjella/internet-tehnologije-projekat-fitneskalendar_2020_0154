import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './Prognoza.css'; 
import api from "../ApiService";

const WeatherForecast = () => {
    const [city, setCity] = useState('');
    const [forecastData, setForecastData] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null); 
    const [showChart, setShowChart] = useState(false); 
    const [fetchedCity, setFetchedCity] = useState('');

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeatherForecast = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.vratiPrognozu(city);
            setForecastData(response.data);
            setFetchedCity(city);
            setError('');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather forecast:', error);
            setLoading(false);
            setError('Neispravan naziv grada. Molimo pokušajte ponovo.');
            setForecastData({});
            setChartData(null);
        }
    };

    const handleShowChart = () => {
        if (forecastData && Object.keys(forecastData).length > 0) {
            const currentDayData = forecastData[Object.keys(forecastData)[currentPage]];
            const chartData = currentDayData.map(item => [item.time, item.temperature]);
            setChartData(chartData);
            setShowChart(true); 
        }
    };

    const handlePrevDay = () => {
        setCurrentPage(prevPage => {
            setChartData(null); 
            setShowChart(false);
            return Math.max(prevPage - 1, 0);
        });
    };

    const handleNextDay = () => {
        setCurrentPage(prevPage => {
            setChartData(null); 
            setShowChart(false); 
            return Math.min(prevPage + 1, Object.keys(forecastData).length - 1);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeatherForecast();
    };

    const renderForecastForCurrentPage = () => {
        const dates = Object.keys(forecastData);
        if (dates.length === 0) return null;

        const date = dates[currentPage];
        const data = forecastData[date];

        return (
            <div key={date} className="forecast-day">
                 <h3>{new Date(date).toLocaleDateString('sr-RS')} {fetchedCity && `in ${fetchedCity}`}</h3>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <b><div>{item.time}</div></b>
                            <div>Temperature: {item.temperature} °C</div>
                            <div>Description: {item.description}</div>
                            <div>Min temperature: {item.min_temperature} °C</div>
                            <div>Max temperature: {item.max_temperature} °C</div>
                            <div>Subjective feeling: {item.feels_like} °C</div>
                            <div>humidity : {item.humidity}%</div>
                            <div className="forecast-icon">
                                <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="Weather icon" />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button onClick={handlePrevDay} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <button onClick={handleNextDay} disabled={currentPage === dates.length - 1}>
                        Next
                    </button>
                    <button onClick={handleShowChart}>Show temperature change</button>
                </div>
                
                {showChart && chartData && (
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType="LineChart"
                        loader={<div>Loading chart...</div>}
                        data={[
                            ['Time', 'Temperature'],
                            ...chartData
                        ]}
                        options={{
                            title: `Temperature change for ${new Date(date).toLocaleDateString('sr-RS')}`,
                            hAxis: {
                                title: 'Time'
                            },
                            vAxis: {
                                title: 'Temperature (°C)'
                            }
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                )}
            </div>
        );
    };
  
    // return (
    //     <div className="weather-forecast">
    //         <form onSubmit={handleSubmit}>
    //             <label htmlFor="cityInput">Unesite grad:</label>
    //             <input
    //                 type="text"
    //                 id="cityInput"
    //                 value={city}
    //                 onChange={handleCityChange}
    //                 required
    //             />
    //             <button type="submit">Prognoza</button>
    //         </form>
    //         {loading ? (
    //             <div>Učitava se...</div>
    //         ) : (
    //             <>
    //                 {error && <div className="error-message">{error}</div>}
    //                 {renderForecastForCurrentPage()}
    //             </>
    //         )}
    //     </div>
    // );
    return (
        <div className="weather-forecast">
            <div className="kontejner">
            <form onSubmit={handleSubmit} className="input-form">
                <div className="input-container">
                    <label htmlFor="cityInput">Enter a location:</label>
                    <input
                        type="text"
                        id="cityInput"
                        value={city}
                        onChange={handleCityChange}
                        required
                    />
                    <button type="submit">Forecast</button>
                </div>
            </form>
            {/* <button className="location-button"  onClick={fetchCurrentLocation}>Dobavi moju lokaciju</button> */}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {error && <div className="error-message">{error}</div>}
                    {renderForecastForCurrentPage()}
                </>
            )}
        </div>
    );
    
};

export default WeatherForecast;

