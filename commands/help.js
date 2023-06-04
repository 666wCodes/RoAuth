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
     //console.log(command.data.options)
      commandList.push({ name: command.data.name, desc: command.data.description})
      //String(command.data.name).charAt(0).toUpperCase() + String(command.data.name).slice(1)
      }

        
      commandList.sort((a, b) => a.name.localeCompare(b.name));

      let commandString = "";
      for (let i = 0; i < commandList.length; i++) {
      commandString = commandString + `**${bullet} [${commandList[i].name}](https://printer.discord.com)**\n<:arrow:1114860819881144390> ${commandList[i].desc}\n<:WatchuDoinMyGuy:1114864975874367519>`
      }

        //const line = `<a:line:1114860744765354065>`
        //const linelist = `${line}${line}${line}${line}${line}${line}${line}${line}${line}${line}`
        let embed = new MessageEmbed()
        .setTitle("Help Center")
        //.setDescription(linelist)
        .addFields({ name: `<:info:1114861006502498376> ${bullet} List of commands`, value: commandString })
        .setColor("RANDOM")
        .setImage("https://media.tenor.com/ZNi18lLfqs4AAAAC/rainbow-line-line.gif")
        .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
}