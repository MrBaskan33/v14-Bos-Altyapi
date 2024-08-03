const Discord = require("discord.js")
const settings = require("../settings.json")

module.exports = {
  name: 'ready',
  async execute(client) {
    
    setInterval(function () {
      client.user.setPresence({
        activities: [
          {
            name: `Sunucuyu`, 
            type: Discord.ActivityType.Watching
          }
        ],
        "status": "idle"
      })
     }, 10000)
  
    console.log(`[${client.user.tag}] active.`)
    
  }
}
