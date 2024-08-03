const Discord = require("discord.js")
const cooldown = new Discord.Collection()
const settings = require("../settings.json")
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
   
    let client = interaction.client
    const command = client.commands.get(interaction.commandName)
    if(!command) return
    
    if(!settings.owners.includes(interaction.user.id)) {
      if(!cooldown.has(interaction.commandName)) {
        cooldown.set(interaction.commandName, new Discord.Collection())
      }

      const now = Date.now()
      const timestampt = cooldown.get(interaction.commandName)
      const cooldownAmount = (command.cooldown) * 1000

      if(timestampt.has(interaction.user.id)) {
        const expiration = timestampt.get(interaction.user.id) + cooldownAmount

        if(now < expiration) {
          const timeleft = Math.round((expiration - now) / 1000)
          const now2 = Math.floor(Date.now() / 1000)
          const time = expiration / 1000 - now2
      
          const no = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`- ❌ Tekrar komut kullanabilmek için kalan süre: **${timeleft} saniye**`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          await interaction.reply({embeds: [no]})
          setTimeout(() => { interaction.deleteReply() }, expiration - now)
          return
        }
      } else {
        timestampt.set(interaction.user.id, now)
        setTimeout(() => timestampt.delete(interaction.user.id), cooldownAmount)
      }
    }
    
    
    try {
      command.execute(client, interaction)
    } catch (error) {
      console.error(error)
    }
    
  }
}
