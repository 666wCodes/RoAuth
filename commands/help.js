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
        let commandList = [
          { name: "help", desc: "View command list or find information on how to setup the bot" },
          { name: "2", desc: "Test command 2" }
      ]

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