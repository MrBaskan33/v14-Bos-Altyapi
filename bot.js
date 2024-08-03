const Discord = require('discord.js')
const { readdirSync } = require("fs")
const { createCanvas, loadImage } = require('canvas')
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})
const settings = require("./settings.json")
const client = new Discord.Client({
  intents: [98303, 
    Discord.GatewayIntentBits.Guilds, 
    Discord.GatewayIntentBits.GuildMessages, 
    Discord.GatewayIntentBits.GuildPresences, 
    Discord.GatewayIntentBits.GuildMessageReactions, 
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent   
  ]
})
client.login(settings.token)

client.commands = new Discord.Collection()

readdirSync('./events').forEach(async file => {
  const event = await require(`./events/${file}`)
  if(event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
  console.log(`[${file}] Event loaded.`)
})

const commands = []
readdirSync('./commands').forEach(async file => {
  if(file.endsWith('.js')) {
    const command = await require(`./commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
    console.log(`[${file}] command loaded.`)
  }
})

const rest = new Discord.REST({version: '10'}).setToken(settings.token)
setTimeout(async () => {
  rest.put(Discord.Routes.applicationCommands(settings.bot), {body: commands}).catch(console.error)
}, 500)
