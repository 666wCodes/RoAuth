const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
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

      let ChangeNickRow = new MessageActionRow()
      ChangeNickRow.addComponents(new MessageButton().setCustomId('placeholder').setLabel('Change Nickname').setStyle('SECONDARY').setDisabled(true))
      ChangeNickRow.addComponents(new MessageButton().setCustomId('Scn0').setEmoji(error).setStyle('DANGER').setDisabled(false))
      ChangeNickRow.addComponents(new MessageButton().setCustomId('Scn1').setEmoji(success).setStyle('SUCCESS').setDisabled(false))

      interaction.reply({ content: `Test`, components: [ChangeNickRow]})
    }
}