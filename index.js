import express from 'express'
import dotenv from 'dotenv'
import ejs from 'ejs'
import axios from 'axios' // <-- Não esqueça de importar o axios!

dotenv.config();
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('home', { weather: null, error: null })
})

app.post('/', async (req, res) => {
  const city = encodeURIComponent(req.body.city); // <-- Aqui está o erro original

  try {
    const response = await axios.get(`https://wttr.in/${city}?format=j1&lang=pt`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;

    const weather = {
      city: req.body.city,
      description: translateWeatherDesc(data.current_condition[0].weatherDesc[0].value),
      temperature: data.current_condition[0].temp_C,
      feelsLike: data.current_condition[0].FeelsLikeC,
      humidity: data.current_condition[0].humidity,
      wind: data.current_condition[0].windspeedKmph
    };

    res.render('home', { weather, error: null });
  } catch (error) {
    console.error('Erro ao obter o clima:', error.message);
    res.render('home', { weather: null, error: 'Cidade não encontrada ou erro ao buscar clima.' });
  }
});

//Func 

const translateWeatherDesc = (desc) => {
  const translations = {
    'Partly cloudy': 'Parcialmente nublado',
    'Sunny': 'Ensolarado',
    'Cloudy': 'Nublado',
    'Overcast': 'Encoberto',
    'Mist': 'Névoa',
    'Patchy rain possible': 'Possibilidade de chuva isolada',
    'Moderate rain': 'Chuva moderada',
    'Heavy rain': 'Chuva forte',
    'Thunderstorm': 'Trovoada',
    'Clear':'Limpo',
    'Thundery outbreaks in nearby': 'Surtos de trovoadas nas proximidades',
    'Rain, mist': 'Chuva e névoa',
    'Fog':'Névoa'
    // ...adicione mais conforme necessidade
  };

  return translations[desc] || desc; // Retorna original se não encontrar tradução
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


