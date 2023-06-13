const db = require('quick.db');
const { discord, MessageActionRow, SelectMenuCollector, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Set or change server settings'),
    async execute(interaction, client) {
      if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
      if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `${restricted} ${bullet} You do not have permission to run this command`, ephemeral: true})

      let panelc = await db.get(`panel-${interaction.guild.id}`)
      let panelrole = await db.get(`paneldata-role-${interaction.guild.id}`)
      let panelnick = await db.get(`paneldata-nick-${interaction.guild.id}`)

	  if(panelc === null) panelc = `${error} Not setup yet, use \`/create\` to setup now.`
	  if(panelc !== null) panelc = `${success} Already setup in this server.`

	  if(panelrole === null) panelrole = `${error} Not setup yet`
	  if(panelrole !== null) panelrole = `${success} Set as <@${panelrole}>`

	  if(panelnick === null) panelnick = `${error} Disabled`
	  if(panelnick !== null) panelnick = `${success} Enabled, set to Roblox username`

	  let embed = new MessageEmbed()
	  .setTitle(`${interaction.guild.name}\'s Settings`)
	  .addFields({ name: `Panel`, value: `${panelc}`})
	  .addFields({ name: `Link role`, value: panelrole})
	  .addFields({ name: `User Nickname`, value: panelnick})
	  .setColor("#302c34")
	  //.setTimestamp()
	  .setFooter(`Use \"/change [name]\" to change your settings`)
	  .setImage(`https://media.tenor.com/ZNi18lLfqs4AAAAC/rainbow-line-line.gif`)
	  

	interaction.reply({ embeds: [embed] })

      
    }
}