const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Your linked account data')
    .addBooleanOption(option => option.setName('private').setDescription('Whether the message is hidden to others').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
        let profile = await db.get(`profile-${i.guild.id}-${i.user.id}`)
        if(!profile || profile === null) return interaction.reply({ content: `${error} ${bullet} You have not linked your account yet`})
        let username = profile.split("-")[0]
        let id = profile.split("-")[1]

        let link = `https://www.roblox.com/users/${id}/profile`
        const embed = new MessageEmbed()
        .setTitle(`${username}`)
        .setThumbnail(link)
        .setDescription(`[${username}](${link}) is linked to Discord account: ${interaction.user.tag}`)
        .setTimestamp()
        .setColor("RANDOM")

        let emp = interaction.options.getBoolean('private');
        interaction.reply({ embeds: [embed], ephemeral: emp})
        
    }
}