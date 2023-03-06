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
  reply_markup: {
    keyboard: [
      [{ text: 'Чаты поддержки' }, { text: 'Чаты сделок' }, { text: 'Мой ид' }, { text: "Вход" }],
    ],
    resize_keyboard: true
  }
}

bot.setMyCommands([
  { command: '/start', description: 'Меню функционала' },
])

bot.on('message', async (ctx) => {
  const chatId = ctx.from?.id;
  const data = ctx.data;
  // if (ctx.text === 'Шо') {
  //   return bot.sendMessage(chatId, "Шо ты хуесос", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [{ text: "Получить id", callback_data: "/MyId" }]
  //       ],
  //       resize_keyboard: true
  //     }
  //   });
  //}
  if (ctx.text === "Мой ид") {
    return bot.sendMessage(chatId, `Твой id чата ${chatId}`);
  }
  if (ctx.text === '/start') {
    return bot.sendMessage(chatId, "Меню", buttonForm)
  }
  if (ctx.text === 'Чаты поддержки') {
    bot.sendMessage(chatId, `Ожидайте, выполняется запрос`)
    const result = await axiosGetChatID();
    const checkAccess = result.filter(item => item.chatid === String(chatId))[0]
    console.log('result', result, checkAccess)
    if (checkAccess) {
      return bot.sendMessage(chatId, `${result.reduce((acc, item) => `${acc}
${item.name} ${item.chatid}`, '')}`)
    } else {
      return bot.sendMessage(chatId, `Пошел нахуй чмо без доступа`)
    }
  }
  if (ctx.text === "Вход") {
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
            return bot.sendMessage(chatId, `Успешно`);
          } catch (e) {
            bot.sendMessage(chatId, `Пошел нахуй, ${e.response.data.message.toLowerCase()}`)
          }
        });
      });
    });
  }
});




bot.on('callback_query', (query) => {

});
