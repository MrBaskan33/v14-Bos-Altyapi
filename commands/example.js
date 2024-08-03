const Discord = require("discord.js")
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})
const settings = require("../settings.json")

module.exports = {
  data: new Discord.SlashCommandBuilder()    
    .setName("example")
    .setDescription("Example command.")
    .setDMPermission(false),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()

    await interaction.followUp({content: `Example command.`})
    
  }
}
