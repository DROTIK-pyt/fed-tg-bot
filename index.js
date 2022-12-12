const path = require('path');
const { Telegraf } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard')
const bot = new Telegraf("5853447532:AAFgzhzHwiavkbrRZ44OX1ZJS1XdDCg9-iM") //сюда помещается токен, который дал botFather

bot.command('start', async (ctx) => {
    const keyboard = Keyboard.make([
        Key.callback('ООО', 'ООО'),
        Key.callback('НКО', 'НКО'),
        Key.callback('АО (ЗАО, ПАО, НАО, ОАО)', 'АО (ЗАО, ПАО, НАО, ОАО)'),
        Key.callback('Государственное или муниципальное предприятие', 'Государственное или муниципальное предприятие'),
    ], { pattern: [2, 1, 1] })

    // await ctx.telegram.sendMessage(ctx.message.chat.id, "Hello!", keyboard.reply())
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Добрый день, ${ctx.update.message.from.first_name}! Ответьте на вопросы, что бы получить консультацию`)
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Ваша оранизационно-правовая форма?`, keyboard.reply())
})

const result = []
  
bot.on('message', async (ctx) => {
    const { text } = ctx.message

    if(text === "ООО" ||
       text === "НКО" ||
       text === "АО (ЗАО, ПАО, НАО, ОАО)" ||
       text === "Государственное или муниципальное предприятие")
    {
        result.push({
            queston: "Ваша оранизационно-правовая форма?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('1', '1'),
            Key.callback('2-5', '2-5'),
            Key.callback('6-10', '6-10'),
            Key.callback('>10', '>10'),
        ], { pattern: [4] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Сколько у Вас лицензий?`, keyboard.reply())
    } else if(text === "1" ||
              text === "2-5" ||
              text === "6-10" ||
              text === ">10")
    {
        result.push({
            queston: "Сколько у Вас лицензий?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('Да, состоит', 'Да, состоит'),
            Key.callback('Нет, не состоит', 'Нет, не состоит'),
        ], { pattern: [2] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Ваша компания состоит в СРО?`, keyboard.reply())
    } else if(text === "Да, состоит" ||
              text === "Нет, не состоит")
    {
        result.push({
            queston: "Ваша компания состоит в СРО?",
            answer: text
        })
        const keyboard = Keyboard.make([
            Key.callback('Да', 'Да'),
            Key.callback('Нет', 'Нет'),
        ], { pattern: [2] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Вы проводите обязательный аудит?`, keyboard.reply())
    } else if(text === "Да" ||
              text === "Нет")
    {
        const keyboard = Keyboard.make([
            Key.callback('Да', 'Да'),
            Key.callback('Нет', 'Нет'),
        ], { pattern: [2] })
        result.push({
            queston: "Вы проводите обязательный аудит?",
            answer: text
        })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Введите свой номер телефона для связи!`, keyboard.remove())
    } else {
        result.push({
            queston: "Введите свой номер телефона для связи!",
            answer: text
        })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Спасибо, в ближайшее время с Вами свяжется оператор!`)
    }

    console.log(result)
})
  
bot.launch();
  
  // Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));