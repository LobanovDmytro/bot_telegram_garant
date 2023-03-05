const axios = require('axios');
const jwt_decode = require('jwt-decode');
const json = require('json');
require('dotenv').config();
const { Telegraf } = require('telegraf');

axios.defaults.baseURL = `https://back-yipq.onrender.com`;

const axiosLogin = async (email, password) => {
  const { data } = await axios.post('api/user/login', { email, password });

  return jwt_decode(data.token);
};


const bot = new Telegraf('6116692347:AAGTOsJBqS0Jn59E6XHSlOilxmLYp4FJhug');

bot.start((ctx) => ctx.reply('send me ur geolocation'));

bot.on('message', async (ctx) => {
  if (ctx.message?.text === '/MyId') {
    const result = ctx.message?.from?.id;
    return ctx.reply(`${result}`);
  }
  // const result = ctx.message?.text.split(' ')
  // const login = result[0]
  //const password = result[1]
  //console.log(ctx);

  // const weatherAPIUrl = `https://openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.OWEATHER_APIKEY}`;
  // const response = await axios.get(weatherAPIUrl);
  //ctx.reply(`${response.data.name}: ${response.data.weather[0].main} ${response.data.main.temp} °C`);
  // const response = await axiosLogin(login, password);

  //ctx.reply(`${response.email} ${response.role} ${response.score}`);
  console.log(ctx)
  ctx.reply(`${ctx.message?.text}`)
});

bot.launch();
