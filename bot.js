const axios = require('axios');
// const jwt_decode = require('jwt-decode');
// const json = require('json');
// require('dotenv').config();
// const { Telegraf } = require('telegraf');

// axios.defaults.baseURL = `https://back-yipq.onrender.com`;

// const axiosLogin = async (email, password) => {
//   const { data } = await axios.post('api/user/login', { email, password });

//   return jwt_decode(data.token);
// };


// const bot = new Telegraf('6116692347:AAGTOsJBqS0Jn59E6XHSlOilxmLYp4FJhug');

// // bot.start((ctx) => ctx.reply('Что бы начать работу нажмите кнопку старт'));

// bot.on('message', async (ctx) => {
//   if (ctx.message?.text === '/MyId') {
//     const result = ctx.message?.from?.id;
//     return ctx.reply(`${result}`);
//   }

//   // const result = ctx.message?.text.split(' ')
//   // const login = result[0]
//   //const password = result[1]
//   //console.log(ctx);

//   // const weatherAPIUrl = `https://openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.OWEATHER_APIKEY}`;
//   // const response = await axios.get(weatherAPIUrl);
//   //ctx.reply(`${response.data.name}: ${response.data.weather[0].main} ${response.data.main.temp} °C`);
//   // const response = await axiosLogin(login, password);

//   //ctx.reply(`${response.email} ${response.role} ${response.score}`);
//   console.log(ctx)
//   ctx.reply(`${ctx.message?.text}`)
// });



// bot.launch();

const TelegramApi = require('node-telegram-bot-api');

const token = '6116692347:AAGTOsJBqS0Jn59E6XHSlOilxmLYp4FJhug';

const bot = new TelegramApi(token,{polling:true});
axios.default.baseURL = `https://back-yipq.onrender.com`;

// bot.on('message', async (ctx) => {
//     const chatId = ctx.chat.id;
//     bot.sendMessage(chatId, "Привет,получи id и начни следить за чатами", {
//       reply_markup: {
//         keyboard: [
//           [ { text: "Получить id",callback_data: "/MyId"} ]
//         ],
//         resize_keyboard: true
//       }
//     });

//     bot.on('callback_query', (query) => {
//       const chatId = query.message.chat.id;
//       const messageId = query.message.message_id;
//       const data = query.data;
    
//       if (data === "/MyId") {
//         bot.sendMessage(chatId, `твой id чата ${chatId}`);
//       }
//   });
// });


// Обработчик команды /start
bot.onText(/\/start/, async(msg) => {
  // Отправляем сообщение с кнопкой "Вход"
 await bot.sendMessage(msg.chat.id, "Для входа введите свой логин и пароль", {
    reply_markup: {
      keyboard: [
        [{ text: "Вход" }]
      ],
      resize_keyboard: true
    }
  });
});

// Обработчик нажатия кнопки "Вход"
bot.onText(/Вход/, async(msg) => {
  // Отправляем сообщение с просьбой ввести логин
  await bot.sendMessage(msg.chat.id, "Введите логин:");

  // Ожидаем ответа пользователя с логином
   bot.once('message', (loginMsg) => {
    const login = loginMsg.text;

    // Отправляем сообщение с просьбой ввести пароль
  bot.sendMessage(msg.chat.id, "Введите пароль:");

    // Ожидаем ответа пользователя с паролем
   bot.once('message', (passwordMsg) => {
      const password = passwordMsg.text;

      // Отправляем сообщение с логином и паролем
    bot.sendMessage(msg.chat.id, `Логин: ${login}\nПароль: ${password}`);
    });
  });
});

