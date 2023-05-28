const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet } = require('../symbols.json')
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates a message where users can get roles, etc when they linked their Roblox account')
    .addBooleanOption(option => option.setName('change_nickname').setDescription('Whether user\'s nicknames will be set as their Roblox username').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Role that will be given after linking').setRequired(false))
    .addChannelOption(option => option.setName('channel').setDescription('Where the message will be sent').setRequired(false)), 
    async execute(interaction, client) {
      
      
      let panels = db.get(`panel-${interaction.guild.id}`)
      if(panels !== null){
      let URLchannel = panels.split("-")[1]
      let URLmessage = panels.split("-")[0]
      let URL = `https://discord.com/channels/${interaction.guild.id}/${URLchannel}/${URLmessage}`
      }
      
      const link = new MessageActionRow().addComponents(new MessageButton().setUrl(URL).setLabel('Go to Panel').setStyle('LINK'))

      if(panels !== null) return interaction.reply({ content: `${info} | There is already a panel setup in this server, use \`/delete\` to delete the panel`, components: [link]})
    let role = interaction.options.getRole('role');
    let changeNick = interaction.options.getBoolean('change_nickname');
    let channel = interaction.options.getChannel('channel')
    if(!channel || channel === null) channel = interaction.channel

    if(!channel.isText() || channel.isVoice()) return interaction.reply({ content: `${error} | The mentioned channel must be a text channel!`, ephemeral: true})


    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('link').setLabel('Link Roblox Account').setStyle('SECONDARY'))
    
    let embed = new MessageEmbed()
    .setTitle("Link your Roblox Account")
    .setDescription("This server requires you to link your Roblox Account to gain access to additional features. Click the button below to start")
    .setColor("ORANGE")
    .setFooter(`${interaction.guild.name} | RoAuth`)
    console.log(channel.id)
    const sendc = client.channels.cache.get(channel.id); //console.log(channel.id)
      const msg = await sendc.send({ embeds: [embed], components: [row] })
      await db.set(`panel-${interaction.guild.id}`, `${msg.id}-${msg.channel.id}`)

    
    

    await interaction.reply({ content: `${success} | Created Panel in <#${channel.id}> with id: ${msg.id}`, ephemeral: true})

    
  }
  }