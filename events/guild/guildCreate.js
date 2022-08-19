const Event = require('../../structures/Event');
const Discord = require('discord.js');
const logger = require('../../utils/logger');
const Guild = require('../../database/schemas/Guild');
const metrics = require('datadog-metrics');
const Logging = require('../../database/schemas/logging');
const config = require('../../config.json');
const welcomeClient = new Discord.WebhookClient(config.webhook_id, config.webhook_url);
const webhookClient = new Discord.WebhookClient(config.webhook_id, config.webhook_url);

module.exports = class extends Event {

  async run(guild) {
    logger.info(`Joined to "${guild.name}" (${guild.id})`, { label: 'Guilds' })

    const find = await Guild.findOne({
      guildId: guild.id,
    })

    if(!find){
          const guildConfig = await Guild.create({
      guildId: guild.id,
      language: "english"
    })
    await guildConfig.save().catch(()=>{})
    }
    
    
  var textChats = guild.channels.cache
        .find(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']))

const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

 let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch {
    
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text') 
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable) // 
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
       
      }
    }
  }
  
  const logging = await Logging.findOne({
    guildId: guild.id
  })
  if(!logging){
    const newL = await Logging.create({
      guildId: guild.id
    })
    await newL.save().catch(()=>{})
  }

  const logging2 = await Logging.findOne({
    guildId: guild.id
  })

  if(logging2){
    if(muteRole){
logging2.moderation.mute_role = muteRole.id
    }

    if(modLog){
      logging2.moderation.channel = modLog.id
    }
    await logging2.save().catch(()=>{})
    

  }

    
}
};
