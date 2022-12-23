const path = require('path');
const { Telegraf } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard')
const bot = new Telegraf("5681948554:AAGFJQPtjlcR-5sgCtfJNO26GNkO5mvXxhs") //сюда помещается токен, который дал botFather
const request = require('request');

const result = {}

async function sendData2B24API(answers, phone) {
    if(!answers || !phone) return false

    let requestPromise = new Promise((resolve, reject) => {
        request.post({
            url: "http://bot.fed-bd.ru",
            form: {
                answers, phone
            }
        },
        (err, response, body) => {
            if (err) reject(err)
        
            resolve(body)
        })
    })

    await requestPromise
}

bot.command('start', async (ctx) => {
    const keyboard = Keyboard.make([
        Key.callback('Не более 1 месяца', 'Не более 1 месяца'),
        Key.callback('Не более 6 месяцев', 'Не более 6 месяцев'),
        Key.callback('Не более 1 года', 'Не более 1 года'),
        Key.callback('Более 1 года', 'Более 1 года'),
    ], { pattern: [ 1, 1, 1, 1 ] })
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
        const keyboard = Keyboard.make([ "1 лицензия", "До 5 лицензий", "5 и более лицензий" ], { pattern: [2, 1] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Сколько лицензий у Вашей медицинской организации?`, keyboard.reply())
    } else if(text === "1 лицензия" ||
              text === "До 5 лицензий" ||
              text === "5 и более лицензий")
    {
        result[`${ctx.message.chat.id}`].push({
            queston: "Сколько лицензий у Вашей медицинской организации?",
            answer: text
        })
        const keyboard = Keyboard.make([ "Да", "Нет" ], { pattern: [2] })
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Вы уже получили предупреждение от надзорных органов (Прокуратуры/ФНС)?`, keyboard.reply())
    } else if(text === "Да" ||
              text === "Нет")
    {
        result[`${ctx.message.chat.id}`].push({
            queston: "Вы уже получили предупреждение от надзорных органов (Прокуратуры/ФНС)?",
            answer: text
        })
        const keyboard = Keyboard.make([ Key.contact('Отправить свой номер телефона') ], { pattern: [1] } )
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Для получения БЕСПЛАТНОЙ КОНСУЛЬТАЦИИ о том, как устранить нарушения и избежать предписаний ФНС, Прокуратуры и штрафа 50 000 рублей - введите Ваш номер телефона или нажмите "Отправить контакт"`, keyboard.reply())
    } else if(text != "")
    {
        // console.log(ctx.message.text, ctx.message.contact)
        const keyboard = Keyboard.make([
            Key.contact('Отправить свой номер телефона')
        ], { pattern: [1] })

        if(ctx.message?.contact?.phone_number)
            await sendData2B24API(result[`${ctx.message.chat.id}`], ctx.message.contact.phone_number)
        else
            await sendData2B24API(result[`${ctx.message.chat.id}`], text)

        await ctx.telegram.sendMessage(ctx.message.chat.id, `Спасибо, в ближайшее время с Вами свяжется оператор!`, keyboard.remove())
        result[`${ctx.message.chat.id}`] = []
    } else {
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Неверный ввод: если кнопок нет - напишите свой вариант ответа иначе выберите его. Повторите ввод.`)
    }
})
  
bot.launch();
  
  // Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));