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
        let commandList = `
> **help**
- This command

> **create**
- Creates a panel where users can go and link their Roblox account for roles

> **delete** 
- Delete a panel from the server

> **link**
- Link your Roblox account

> **/unlink**
Unlink your Roblox account`
        let embed = new MessageEmbed()
        .setTitle("RoAuth Help Center")
        .addFields({ name: "List of commands", value: commandList })
        .setColor("RANDOM")
        .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
}