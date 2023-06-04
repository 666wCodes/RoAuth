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
      commandString = commandString + `\n**${bullet} [${commandList[i].name}](https://printer.discord.com)**\n<:arrow:1114860819881144390> ${commandList[i].desc}`
      }

        //const line = `<a:line:1114860744765354065>`
        //const linelist = `${line}${line}${line}${line}${line}${line}${line}${line}${line}${line}`
        const link = new MessageActionRow().addComponents(new MessageButton().setURL("https://discord.com/").setLabel('Join Support Server').setStyle('LINK'))
        let guide = `
1 ${bullet} Create a panel with \`/create\` with your desired options
2 ${bullet} Enable or set settings with \`/settings\`
3 ${bullet} After all is done, your server should already be configured!`
        let embed = new MessageEmbed()
        .setTitle("Help Center")
        //.setDescription(linelist)
        .addFields({ name: `<:info:1114861006502498376> ${bullet} List of commands`, value: `${commandString}` })
        .addFields({ name: `${success} ${bullet} Setup guide`, value: guide})
        .addFields({ name: `🗒️ ${bullet} Important things to note`, value: `We will **never** ask for your account passwords! Only visit urls that start with \`roauth.xyz\` we will never redirect you anywhere else! The real Roauth bot will always have <:verif:1114867801312731146> next to its name!`})
        .setColor("RANDOM")
        .setImage("https://media.tenor.com/ZNi18lLfqs4AAAAC/rainbow-line-line.gif")
        .setTimestamp()
        interaction.reply({ embeds: [embed], components: [link] })
    }
}