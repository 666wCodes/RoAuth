const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, client, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'panel',
  description: 'a panel where users can get a role or their nickname changed when they linked a roblox account.',
  options: [
    {
      name: 'change_nickname',
      description: 'Changes user\'s nickname to their linked Roblox name',
      type: 'BOOLEAN',
      required: true,
    },
    {
      name: 'channel',
      description: 'Channel to send panel message (Will send to channel where you used this command by default)',
      type: 'ROLE',
      required: false,
    },
    {
      name: 'role',
      description: 'Role to add to linked users',
      type: 'ROLE',
      required: false,
    },
  ],
  async execute(interaction) {
    let role = interaction.options.getRole('role');
    let changeNick = interaction.options.getBoolean('change_nickname');
    let channel = interaction.options.getChannel('channel')
    if(!channel || channel === null) channel = interaction.channel


    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('link').setLabel('Link Roblox Account').setStyle('PRIMARY'))
    
    let embed = new MessageEmbed()
    .setTitle("link your Roblox Account")
    .setDescription("This server requires you to link your Roblox Account to gain access to additional features.\nClick the button below to start")
    .setColor("ORANGE")
    .setFooter(`${interaction.guild.name} | RoAuth`)
    client.channels.fetch(channel.id).send({ embeds: [embed], components: [row] })

    
  }
  }