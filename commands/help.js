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
\`/help 
>>> This command.\`
\`/create 
>>> Creates a panel where users can go and link their Roblox account for roles\`
\`/delete 
>>> Delete a panel from the server\`
\`/link 
>>> Link your Roblox account\`
\`/settings 
>>> View your current server\'s settings\`
\`/askonjoin 
>>> Dm new members to link their Roblox account when they join\`
\`/autokick 
>>> Kick members after a certain time if they haven\'t linked yet\`
\`/listmode 
>>> Change between blacklist or whitelist mode\`
\`/blacklist 
>>> Prevents verifying if Roblox account is on blacklisted\`
\`/blacklistadd 
>>> Add an account on the blacklist\`
\`/blacklistremove 
>>> Remove an account on the blacklist\`
\`/blacklistadd 
>>> Prevents verifying if Roblox account is on blacklisted\`
\`/whitelist 
>>> Prevents verifying if Roblox account is not on whitelisted\`
\`/whitelistadd 
>>> Add an account on the whitelist\`
\`/whitelistremove 
>>> Remove an account on the whitelist\`
\`/donate 
>>> Donate to keep the bot running\``
        let embed = new MessageEmbed()
        .setTitle("RoAuth Help Center")
        .addFields({ name: "List of commands", value: commandList })
        .setColor("RANDOM")
        .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
}