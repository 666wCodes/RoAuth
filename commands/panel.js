const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, client, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Creates a message where users can get roles, etc when they linked their Roblox account')
    .addBooleanOption(option => option.setName('change_nickname').setDescription('Whether user\'s nicknames will be set as their Roblox username').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Role that will be given after linking').setRequired(false))
    .addChannelOption(option => option.setName('channel').setDescription('Where the message will be sent').setRequired(false)), 
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
    client.cache.channels.get(channel.id).send({ embeds: [embed], components: [row] })

    
  }
  }