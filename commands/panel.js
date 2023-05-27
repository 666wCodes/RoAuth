const db = require('quick.db');
const { discord, MessageActionRow, Modal, TextInputComponent } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'panel',
  description: 'Create a panel where users can get a role or nickname change when they connected their roblox account.',
  options: [
    {
      name: 'channel',
      description: 'Channel to send panel message',
      type: 'ROLE',
      required: false,
    },
    {
      name: 'role',
      description: 'Role to add to Connected users',
      type: 'ROLE',
      required: false,
    },
    {
      name: 'change_nickname',
      description: 'Changes user\'s nickname to their connected Roblox name',
      type: 'BOOLEAN',
      required: true,
    },
  ],
  async execute(interaction) {
    let role = interaction.options.getRole('role');
    let changeNick = interaction.options.getBoolean('change_nickname');
    
    
  }
  }