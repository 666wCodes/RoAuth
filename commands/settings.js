const db = require('quick.db');
const { discord, MessageActionRow, SelectMenuCollector, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View current server settings')
	.addSubcommand((subcommand) => subcommand.setName('linkrole').setDescription('Change role that is given to members after linking')).addRoleOption(option => option.setName('role').setDescription('(Not supplying a value will disable this setting) Change the role that will be given after linking').setRequired(true)),
	async execute(interaction, client) {
		if (!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true });
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
		  return interaction.reply({ content: `${restricted} ${bullet} You do not have permission to run this command`, ephemeral: true });
	  
		if (interaction.options.getSubcommand() === 'linkrole') {
		  const role = interaction.options.getRole('role');
		  if (!role) {
			return interaction.reply({ content: `${info} ${bullet} Because you didn't specify a role, this setting is now disabled`, ephemeral: true });
		  }
	  
		  db.set(`paneldata-role-${interaction.guild.id}`, `${role.id}`);
		  return interaction.reply({ content: `${success} ${bullet} \`link role\` is now set as <@&${role.id}>` });
		}
	  
		let panelc = db.get(`panel-${interaction.guild.id}`);
		let panelrole = db.get(`paneldata-role-${interaction.guild.id}`);
		let panelnick = db.get(`paneldata-nick-${interaction.guild.id}`);
		console.log(panelc);
	  
		if (panelc === null) {
		  panelc = `${error} Not set up yet, use \`/create\` to set up now`;
		} else {
		  panelc = `${success} Already set up in this server.`;
		}
	  
		if (panelrole === null) {
		  panelrole = `${error} Not set yet`;
		} else {
		  panelrole = `${success} Set as <@&${panelrole}>`;
		}
	  
		if (panelnick === null) {
		  panelnick = `${error} Disabled`;
		} else {
		  panelnick = `${success} Roblox Username`;
		}
	  
		let embed = new MessageEmbed()
		  .setTitle(`${interaction.guild.name}'s Settings`)
		  .addFields({ name: `Panel`, value: `${panelc}` })
		  .addFields({ name: `Link role`, value: panelrole })
		  .addFields({ name: `Nickname settings`, value: panelnick })
		  .setColor("#302c34")
		  //.setTimestamp()
		  .setFooter(`Use "/change [setting name]" to change your settings`)
		  .setImage(`https://media.tenor.com/ZNi18lLfqs4AAAAC/rainbow-line-line.gif`);
	  
		interaction.reply({ embeds: [embed] });
	  }
	  
}