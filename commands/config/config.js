const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'settings',
        aliases: [ 'cfg'],
        description: 'Show\'s the current settings for this guild',
        category: 'Config',
        guildOnly: true,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      });
      const guildDB = await Guild.findOne({
        guildId: message.guild.id
    });


      const language = require(`../../data/language/${guildDB.language}.json`)
      await message.channel.send(new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`${language.serversettings1}`)
      .addField(`Settings`, `This is not set up`, true)
  

      .setFooter(`${message.guild.name}`)

      
      )
      
    }
};