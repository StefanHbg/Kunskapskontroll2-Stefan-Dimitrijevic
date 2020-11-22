// här deklarerar jag globala variablar som jag kan komma åt i mina funktioner
let divContainer = document.querySelector('.div-container');
let form = document.querySelector('form');
let input = document.querySelector('input');
let btn = document.querySelector('button');
let renderCity = document.createElement('p');
// Jag skapar en textcontent så att jag kan ha text i min ruta innan sökning sker av användare.
divContainer.textContent = 'Prognosen kommer att visas här så fort du klickat på "Kolla vädret"';

//här skapar jag en funktion som lyssnar på input av användare och som dynamiskt hämtar vädret för denna specifika stad användare skriver.
function userCity(){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        divContainer.textContent = '';
        renderCity.textContent = '';
        if (input.value !== ''){ // Jag skriver en if för att kolla om användaren inte skrivit in något i inputfältet. Om inte något anges ska appen skriva ut ett felmeddelande. 
            url = `http://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=f46cbe4f7d3ba71b80de6d97287f353d&lang=sv`;
            fetchWeather(url);
            renderCityFunc(input.value); // här kallar jag på renderCityFunc med input.value för att rendera ut staden till användaren.
        } else divContainer.textContent = 'Du har inte angett någon stad. Vänligen skriv in en stad!';
        input.value = ''; // tömmer input fältet. 
    })
}  
userCity();

// här skapar jag en funktion där jag Fetchar URL:en sen kör jag en funktion som tar response och returnar den med json().
function fetchWeather(url) {
  fetch(url).then(function(reponse){
        return reponse.json();
    }
    // jag tar parameter data med i denna funktion och deklarerar sedan allt jag vill hämta ut i en array för att enklare loopa igenom det senare i min kod. 
    ).then(function(data){
        const array = [data.weather[0].description, data.main.temp, data.wind.speed, data.main.humidity];
        let icon = data.weather[0].icon;

        presentData(array, icon); // här skickar jag med arrayen och iconen
    }
    ).catch(function(error){ // detta är min felhantering som skriver ut ett felmeddelande ifall användare skriver in en stad som inte existerar.
        let errorMessage = document.createElement('h1');
        errorMessage.textContent = '404. Den här staden existerar inte.';
        divContainer.appendChild(errorMessage);
    })    
}
// Här skapar jag en function som ska presentera data och som tar det som jag vill presentera i parameter. 
function presentData(array, icon){    
    let weatherLabelArr = ['Väder beskrivning: ', 'Väder temperatur: ', 'Vindhastighet: ', 'Luftfuktighet: '];
    let iconImg = document.createElement('img');
    iconImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    iconImg.classList.add('weather-img');
    let divIcon = document.createElement('div');
    divIcon.classList.add('icon-container');
    divContainer.appendChild(divIcon);
    divIcon.appendChild(iconImg)
    let weatherUnits = ['', 'grader C', 'km/h', '%'];
    for (let i = 0; i < array.length; i++) {
        let div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        divContainer.appendChild(div);
        let weatherLabel = document.createElement('span');
        weatherLabel.textContent = weatherLabelArr[i];
        div.appendChild(weatherLabel);

        let spanVal = document.createElement('span');
        spanVal.innerHTML = `${array[i]} ${weatherUnits[i]}`;
        div.appendChild(spanVal);
    }
    let colorWeatherLine = document.createElement('hr'); // gör en hr för att göra en liten linje i min divContainer för att kunna displaya den med olika färger beroende på om det är - grader, kallt, varmt och jätte varm med hjälp av en if sats. 
    colorWeatherLine.classList.add('weather-line');
    if (array[1] <= 0){
        colorWeatherLine.style.borderColor = 'lightblue';
    } else if (array[1] < 10){
        colorWeatherLine.style.borderColor = 'blue';
    } else if ((array[1] >= 10) && (array[1] <= 16)){
        colorWeatherLine.style.borderColor = 'yellow';
    } else if (array[1] >= 25){
        colorWeatherLine.style.borderColor = 'orange';
    }
    divContainer.appendChild(colorWeatherLine);
}
// skapar en function för att rendera vilken stad användaren sökt på. 
function renderCityFunc(city){
    renderCity.textContent = city;
    renderCity.classList.add('city');
    document.body.appendChild(renderCity);
}