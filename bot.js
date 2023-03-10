const axios = require('axios');
const jwt_decode = require('jwt-decode');
const json = require('json');
require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const sharp = require('sharp');

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
const axiosGetAdminChats = async (chatid) => {
  const { data } = await axios.post('api/tg/getAdminChats', { chatid });
  if (data) {
    return data;
  }
};
const axiosGetAdminMessages = async (chatid, email) => {
  const { data } = await axios.post('api/tg/getAdminMessages', { chatid, email });
  if (data) {
    return data;
  }
};
const axiosGetDeals = async (chatid) => {
  const { data } = await axios.post('api/tg/getDeals', { chatid });
  if (data) {
    return data;
  }
};
const axiosGetDealMessages = async (chatid, dealId) => {
  const { data } = await axios.post('api/tg/getDealMessages', { chatid, dealId });
  if (data) {
    return data;
  }
};
const axiosDeleteChat = async (name, deleteName) => {
  const { data } = await axios.post('api/tg/delete', { chatid: String(name), deleteName });
  if (data) {
    return data;
  }
};
const token = '6149778778:AAFPlXbrTIXD_zDG4LLaeeqTH8fbKJM7kmA';
const bot = new TelegramApi(token, { polling: true });
const buttonForm = {
  reply_markup: {
    keyboard: [
      [{ text: "Админ чаты" }, { text: "Чаты сделок" }, { text: 'Мой ид' }, { text: "Вход" }, { text: "Доступ" }],
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
    if (checkAccess) {
      return bot.sendMessage(chatId, `${result.reduce((acc, item) => `${acc}
${item.name} ${item.chatid}`, '')}`)
    } else {
      return bot.sendMessage(chatId, `Пошел нахуй чмо без доступа`)
    }
  }
  if (ctx.text === 'Доступ') {
    bot.sendMessage(chatId, `Ожидайте, выполняется запрос`)
    const result = await axiosGetChatID();
    const checkAccess = result.filter(item => item.chatid === String(chatId))[0]
    if (checkAccess) {
      return bot.sendMessage(chatId, 'Доступ:', {
        reply_markup: {
          inline_keyboard: result.map(item => [{ text: `${item.name} ${item.chatid}`, callback_data: `/deleteuser ${item.name}` }]),
          resize_keyboard: true
        }
      })
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
  if (ctx.text === 'Админ чаты') {
    bot.sendMessage(chatId, "Ожидайте, выполняется запрос");
    try {
      const response = await axiosGetAdminChats(String(chatId))
      return bot.sendMessage(chatId, 'Чаты:', {
        reply_markup: {
          inline_keyboard: response.map(item => [{ text: `${item.nickname}`, callback_data: `/adminChat ${item.email}` }]),
          resize_keyboard: true
        }
      })
    } catch (e) {
      console.log('error', e?.response?.data)
      bot.sendMessage(chatId, `Ошибка, ${e.response.data.message.toLowerCase()}`)
    }
  }
  if (ctx.text === 'Чаты сделок') {
    bot.sendMessage(chatId, "Ожидайте, выполняется запрос");
    try {
      const response = await axiosGetDeals(String(chatId))
      return bot.sendMessage(chatId, 'Сделки:', {
        reply_markup: {
          inline_keyboard: response.map(item => [{
            text: `${item.buyerNickname} / ${item.sellerNickname} / ${item.createdAt}`, callback_data: `/dealChat ${item.id}`
          }]),
          resize_keyboard: true
        }
      })
    } catch (e) {
      console.log('error', e?.response?.data)
      bot.sendMessage(chatId, `Ошибка, ${e.response.data.message.toLowerCase()}`)
    }
  }
});




bot.on('callback_query', async (query) => {
  const chatId = query.from?.id
  const data = query.data;
  if (data.includes('deleteuser')) {
    bot.sendMessage(chatId, "Вы уверены?", {
      reply_markup: {
        inline_keyboard: [[{ text: `Да`, callback_data: `Да` }, { text: `Нет`, callback_data: `Нет` }]],
        resize_keyboard: true
      }
    });
    return bot.once('callback_query', async (check) => {
      const answer = check.data;
      if (answer === 'Да') {
        bot.sendMessage(chatId, `Ожидайте, выполняется запрос`);
        const deleteUser = data.split(' ')[1]
        if (deleteUser) {
          try {
            const deleteCheck = await axiosDeleteChat(chatId, deleteUser);
            if (deleteCheck) {
              return bot.sendMessage(chatId, `Успешно удалено`)
            }
          } catch (e) {
            console.log('error', e?.response?.data)
            bot.sendMessage(chatId, `Пошел нахуй, ${e.data.message.toLowerCase()}`)
          };
        } else {
          return bot.sendMessage(chatId, `Имя не найдено(перезапустите бота)`);
        }
      } else {
        return bot.sendMessage(chatId, `Отменено`);
      }
    })
  }

  if (data.includes('adminChat')) {
    bot.sendMessage(chatId, `Ожидайте, выполняется запрос`)
    const email = data.split(' ')[1]
    if (email) {
      try {
        const messages = await axiosGetAdminMessages(chatId, email);
        if (messages) {
          const checkPhoto = messages?.filter(item => !item.message)[0]?.image || ''
          bot.sendMessage(chatId, `${messages.reduce((acc, item) => `${acc}
${item.nickname} ${item.time} ${item.message || 'Изображение, нажмите кнопку ниже чтобы увидеть'}`, '')}`, checkPhoto ? {
            reply_markup: {
              inline_keyboard: [[{ text: `Отправить фото`, callback_data: `Да` }, { text: `Не отправлять`, callback_data: `Нет` }]],
              resize_keyboard: true
            }
          } : {})
          if (checkPhoto) return bot.once('callback_query', async (check) => {
            const answer = check.data;
            if (answer === 'Да') {
              //  const base64Image = messages.filter(item => !item.message)[0].image;
              // const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');
              messages.filter(item => !item.message).map(el => bot.sendPhoto(chatId, Buffer.from(el.image.split(',')[1], 'base64')));
            } else {
              return bot.sendMessage(chatId, `Отменено`);
            }
          })
        }
      } catch (e) {
        console.log('error', e)
        bot.sendMessage(chatId, `Ошибка, ${e.data.message.toLowerCase()}`)
      };
    } else {
      return bot.sendMessage(chatId, `Email не найден (перезапустите бота)`);
    }
  }

  if (data.includes('dealChat')) {
    bot.sendMessage(chatId, `Ожидайте, выполняется запрос`)
    const dealId = data.split(' ')[1]
    if (dealId) {
      try {
        const messages = await axiosGetDealMessages(chatId, dealId);
        if (messages) {
          return bot.sendMessage(chatId, `${messages.reduce((acc, item) => `${acc}
${item.nickname} ${item.time} ${item.message}`, '')}`)
        }
      } catch (e) {
        console.log('error', e)
        bot.sendMessage(chatId, `Ошибка, ${e.data.message.toLowerCase()}`)
      };
    } else {
      return bot.sendMessage(chatId, `Id не найдено (перезапустите бота)`);
    }
  }

});
