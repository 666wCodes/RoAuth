const db = require('quick.db');
const { discord, MessageActionRow, Modal, TextInputComponent, client } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'panel',
  description: 'Create a panel where users can get a role or nickname change when they connected their roblox account.',
  options: [
    {
      name: 'channel',
      description: 'Channel to send panel message (Will send to channel where you used this command by default)',
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
    let channel = interaction.options.getChannel('channel')
    if(!channel || channel === null) channel = interaction.channel

    const button = new discord.MessageButton()
      .setCustomId('connect')
      .setLabel('Connect Roblox Account')
      .setStyle('PRIMARY');

    const row = new discord.MessageActionRow().addComponents(button);
    
    let embed = new discord.MessageEmbed()
    .setTitle("Connect your Roblox Account")
    .setDescription("This server requires you to connect your Roblox Account to gain access to additional features.\nClick the button below to start")
    .setColor("ORANGE")
    .setFooter(`${interaction.guild.name} | RoAuth`)
    client.channels.cache.get(channel.id).send({ embeds: [embed], components: [row] })

    
  }
  }