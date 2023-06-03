const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Don\'t Worry i\'ll help you'),
    async execute(interaction, client) {
      let commandList = [];
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    // Dynamically register slash commands
    for (const file of commandFiles) {
     const command = require(`../commands/${file}`);
      commandList.push({ name: command.data.name, desc: command.data.desc})
      }

        

      let commandString = "";
      for (let i = 0; i < commandList.length; i++) {
      commandString = commandString + `\n\n> **${commandList[i].name}**\n[${commandList[i].desc}]`
      }

        let embed = new MessageEmbed()
        .setTitle("RoAuth Help Center")
        .addFields({ name: "List of commands", value: commandString })
        .setColor("RANDOM")
        .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
}