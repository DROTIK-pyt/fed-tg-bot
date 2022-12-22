const path = require('path');
const { Telegraf } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard')
const bot = new Telegraf("5853447532:AAFgzhzHwiavkbrRZ44OX1ZJS1XdDCg9-iM") //сюда помещается токен, который дал botFather

const result = {}

bot.command('start', async (ctx) => {
    const keyboard = Keyboard.make([
        Key.callback('Не более 1 месяца', 'Не более 1 месяца'),
        Key.callback('Не более 6 месяцев', 'Не более 6 месяцев'),
        Key.callback('Не более 1 года', 'Не более 1 года'),
        Key.callback('Более 1 года', 'Более 1 года'),
    ])
    result[`${ctx.message.chat.id}`] = []

    // await ctx.telegram.sendMessage(ctx.message.chat.id, "Hello!", keyboard.reply())
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Сколько времени прошло с момента получения лицензии? Как давно Вы нарушили срок публикации в ЕФРСФДЮЛ?`, keyboard.reply())
})
  
bot.on('message', async (ctx) => {
    const { text } = ctx.message

    if(text === "Не более 1 месяца" ||
       text === "Не более 6 месяцев" ||
       text === "Не более 1 года" ||
       text === "Более 1 года")
    {
        result[`${ctx.message.chat.id}`].push({
            queston: "Сколько времени прошло с момента получения лицензии? Как давно Вы нарушили срок публикации в ЕФРСФДЮЛ?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('Не более 1 месяца', 'Не более 1 месяца'),
            Key.callback('Не более 6 месяцев', 'Не более 6 месяцев'),
            Key.callback('Не более 1 года', 'Не более 1 года'),
            Key.callback('Более 1 года', 'Более 1 года'),
        ])
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Сколько лицензий у Вашей медицинской организации?`, keyboard.remove())
    } else if(text != "" && result[`${ctx.message.chat.id}`].length == 1)
    {
        result[`${ctx.message.chat.id}`].push({
            queston: "Сколько лицензий у Вашей медицинской организации?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('Да', 'Да'),
            Key.callback('Нет', 'Нет'),
        ], { pattern: [2] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Вы уже получили предупреждение от надзорных органов (Прокуратуры/ФНС)?`, keyboard.reply())
    } else if(text === "Да" ||
              text === "Нет")
    {
        result[`${ctx.message.chat.id}`].push({
            queston: "Вы уже получили предупреждение от надзорных органов (Прокуратуры/ФНС)?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('Да', 'Да'),
            Key.callback('Нет', 'Нет'),
        ], { pattern: [2] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Для получения БЕСПЛАТНОЙ КОНСУЛЬТАЦИИ о том, как устранить нарушения и избежать предписаний ФНС, Прокуратуры и штрафа 50 000 рублей - введите Ваш номер телефона`, keyboard.remove())
    } else if(text != "" && result[`${ctx.message.chat.id}`].length > 1)
    {
        const keyboard = Keyboard.make([
            Key.callback('Да', 'Да'),
            Key.callback('Нет', 'Нет'),
        ], { pattern: [2] })
        result[`${ctx.message.chat.id}`].push({
            queston: "Для получения БЕСПЛАТНОЙ КОНСУЛЬТАЦИИ о том, как устранить нарушения и избежать предписаний ФНС, Прокуратуры и штрафа 50 000 рублей - введите Ваш номер телефона",
            answer: text
        })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Спасибо, в ближайшее время с Вами свяжется оператор!`, keyboard.remove())
    } else {
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Неверный ввод: если кнопок нет - напишите свой вариант ответа иначе выберите его. Повторите ввод.`)
    }
    console.log(result)
})
  
bot.launch();
  
  // Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));