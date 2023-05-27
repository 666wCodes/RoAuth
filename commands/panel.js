const db = require('quick.db');
const { discord, MessageActionRow, Modal, TextInputComponent } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'panel',
  description: 'Create a panel where users can get a role or nickname change when they connected their roblox account.',
  addChannelOption(option => option.setName('channel').setDescription('Where the panel will send to')),
  addRoleOption(option => option.setName('role').setDescription('The role that will be given to users who connected their roblox account')),
  addBooleanOption(option => option.setName('change_nickname').setDescription('Changes user\'s nickname to their Roblox account name')),
  async execute(interaction) {
  }
  }