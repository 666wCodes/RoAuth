const db = require('quick.db');
const { MessageManager, discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes the link panel in this server'),
    async execute(interaction, client) {
        if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `${restricted} ${bullet} You do not have permission to run this command`, ephemeral: true})
        let panels = db.get(`panel-${interaction.guild.id}`)
        if(panels === null) return interaction.reply({ content: `${error} ${bullet} Please create a panel first with \`/create\`, if you wanna delete a panel...`, ephemeral: true})
        let channelid = panels.split("-")[1]
        let messageid = panels.split("-")[0]
        await db.delete(`panel-${interaction.guild.id}`)
        await db.delete(`paneldata-role-${interaction.guild.id}`)
        await db.delete(`paneldata-nick-${interaction.guild.id}`)
        interaction.channel.messages.delete(messageid)
        .then(() => {
        interaction.reply({ content: `${success} ${bullet} Panel was deleted from the Database and from Discord`, ephemeral: true})
        })
        .catch((err) => {
        interaction.reply({ content: `${warn} ${bullet} This is wierd: The panel was deleted from our Database but I was not able to delete the Panel message...`, ephemeral: true})
        console.log(err)
    });
    }
}