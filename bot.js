const axios = require('axios');
const jwt_decode = require('jwt-decode');
const json = require('json');
require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');

axios.defaults.baseURL = `https://back-yipq.onrender.com`;

// const axiosLogin = async (email, password) => {
//   const { data } = await axios.post('api/user/login', { email, password });
//   return jwt_decode(data.token);
// };
const axiosGetChatID = async () => {
  const { data } = await axios.get('api/tg/get');
  if (data.telegramUsers) {
    console.log(data.telegramUsers)
    return data.telegramUsers;
  }
};


const axiosCreateChat = async (name, chatid, email, password) => {
  const { data } = await axios.post('api/tg/create', { name, chatid, email, password });
  if (data) {
    return data;
  }
};
const axiosDeleteChat = async (name, email, password) => {
  const { data } = await axios.post('api/tg/delete', { name, email, password });
  if (data) {
    return data;
  }
};
const token = '6149778778:AAFPlXbrTIXD_zDG4LLaeeqTH8fbKJM7kmA';
const bot = new TelegramApi(token, { polling: true });
const buttonForm = {
  reply_markup: JSON.stringify({
    inline_keyboard:[
      [ {text: 'Чаты поддержки', callback_data: 'sdadas'} ],
      [ {text: 'Чаты сделок', callback_data: 'eqweqwewq'} ],
    ]
  })
}

bot.setMyCommands([
  {command: '/start', description: 'Запустить или перезапустить бота'},
  {command: '/id', description: 'Получить id'},
  {command: '/dostup', description: 'Функционал'},
])

bot.on('message', async (ctx) => {
  const chatId = ctx.from?.id;
  if (ctx.text === '/id') {
    return bot.sendMessage(chatId, `твой id чата ${chatId}`);
  }
  if (ctx.text === 'Шо') {
    return bot.sendMessage(chatId, "Шо ты хуесос", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Получить id", callback_data: "/MyId" }]
        ],
        resize_keyboard: true
      }
    });
  }

  if (ctx.text === '/start') {
    return bot.sendMessage(chatId, "Для входа введите свой логин и пароль", {
      reply_markup: {
        keyboard: [
          [{ text: "Вход", callback_data: "/login" }]
        ],
        
      }
    });
  }
  if (ctx.text === '/dostup') {
    return bot.sendMessage(chatId, "Меню", buttonForm)
  }
});




bot.on('callback_query', (query) => {
  const chatId = query.from?.id
  const data = query.data;
  if (data === "/MyId") {
    return bot.sendMessage(chatId, `твой id чата ${chatId}`);
  }
  if (data === "/login") {
    bot.sendMessage(chatId, "Введите имя для записи в базу данных:");
    return bot.once('message', async (nameMsq) => {
      const name = nameMsq.text;

      bot.sendMessage(chatId, "Введите email:");
      bot.once('message', (loginMsg) => {
        const login = loginMsg.text;

        bot.sendMessage(chatId, "Введите пароль:");

        bot.once('message', async (passwordMsg) => {
          const password = passwordMsg.text;
          bot.sendMessage(chatId, `Ожидайте, выполняется запрос`);
          try {
            const response = await axiosCreateChat(name, String(chatId), login, password)
            axiosGetChatID()
            return bot.sendMessage(chatId, `Успешно`);
          } catch (e) {
            bot.sendMessage(chatId, `Пошел нахуй, ${e.response.data.message.toLowerCase()}`)
            axiosGetChatID()
          }
        });
      });
    });
  }
});
