// Get your API key from WeatherAPI (https://www.weatherapi.com/)
const apiKey = '8115c57301e44dd9b4f204402232406';
// Get the necessary elements
const weatherElement = document.getElementById('weather');
const forecastItemsElement = document.getElementById('forecastItems');

// Function to fetch weather data
function getWeatherData(city) {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Extract weather information from the response
      const { current } = data;
      const { temp_c, humidity} = current;

      // Update main weather section
      weatherElement.innerHTML = `
        <h1>Weather in ${city}</h1>
        <p>Temperature: ${Math.round(temp_c)}°C</p>
        <p>Humidity: ${humidity}%</p>
      `;
    })
    .catch(error => {
      console.log('An error occurred while fetching the weather data:', error);
    });
}

// Function to fetch forecast data
function getForecastData(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear previous forecast items
      forecastItemsElement.innerHTML = '';

      // Extract forecast information from the response
      const { forecast } = data;
      const forecastDays = forecast.forecastday;

      // Create forecast table
      const forecastTable = document.createElement('table');
      forecastTable.classList.add('forecast-table');

      // Create table header
      const tableHeader = document.createElement('tr');
      tableHeader.innerHTML = `
        <th>Day</th>
        <th>Max(°C)</th>
        <th>Min(°C)</th>
        <th>Rain(%)</th>
      `;
      forecastTable.appendChild(tableHeader);

      // Create forecast items for each day
      forecastDays.forEach(day => {
        const { date, day: forecastData } = day;
        const { maxtemp_c, mintemp_c, daily_chance_of_rain } = forecastData;

        // Get the day of the week from the date
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

        // Round the temperatures to the nearest integer
        const maxTemp = Math.round(maxtemp_c);
        const minTemp = Math.round(mintemp_c);

        // Create table row for the day
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
          <td>${dayOfWeek}</td>
          <td>${maxTemp}</td>
          <td>${minTemp}</td>
          <td>${daily_chance_of_rain}</td>
        `;

        // Add a title attribute to show the full date as a tooltip
        tableRow.title = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // Append the row to the table
        forecastTable.appendChild(tableRow);
      });

      // Append forecast table to forecast items container
      forecastItemsElement.appendChild(forecastTable);
    })
    .catch(error => {
      console.log('An error occurred while fetching the forecast data:', error);
    });
}
// Handle form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('cityInput').value;
  getWeatherData(city);
  getForecastData(city);
});

