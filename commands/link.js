function createCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const db = require('quick.db');
const { MessageManager, discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Roblox account!'),
    async execute(interaction, client) {
        const i = interaction
        if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
//eif(i.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({ content: `${warn} ${bullet} You are an admin, you do not need to link your account here.`, ephemeral: true })
const link = new MessageActionRow().addComponents(new MessageButton().setURL("https://www.roblox.com/games/13596282742/RoAuth-Verification-Place").setLabel('Join Roblox Game').setStyle('LINK')).addComponents(new MessageButton().setURL("https://discord.com/").setLabel('Support Server').setStyle('LINK'))
let session = db.get(`session-${i.guild.id}-${i.user.id}`)
let sessioncode = db.get(`sessioncode-${i.guild.id}-${i.user.id}`)
let created = String(session).split("-")[0]
let expires = String(session).split("-")[1]
let verifiedAlr = db.get(`verified-${i.guild.id}-${i.user.id}`)

let getpanelstats = await db.get(`panel-${i.guild.id}`)
if(getpanelstats === null || !getpanelstats) return interaction.reply({ content: `${warn} ${bullet} A panel is not setup in this server, therefore linking is disabled`, ephemeral: true })


if(verifiedAlr !== null){
  const reVer = new MessageActionRow().addComponents(new MessageButton().setCustomId('re').setLabel('Unlink Roblox Account').setStyle('SECONDARY'))
  return interaction.reply({ content: `${warn} ${bullet} Your account is already linked in this server, BUT you can unlink and link again using the button below.`, components: [reVer], ephemeral: true })
}

if(Date.now() >= expires){
  db.delete(`session-${i.guild.id}-${i.user.id}`)
  db.delete(`sessioncode-${i.guild.id}-${i.user.id}`)
  db.delete(`verif-codes-${sessioncode}`)
  session = null
  sessioncode = null
}

if(session !== null && sessioncode !== null){
  let sessionExpiresTimestamp = Math.floor(expires / 1000)
  let embed2 = new MessageEmbed()
.setTitle("How to link your Roblox Account")
.setColor("ORANGE")
.addFields({ name: "Your authentication code", value: `\`${sessioncode}\` (Expires <t:${sessionExpiresTimestamp}:R>)`})
.setDescription(`
Here are the steps to link your Roblox Account

1 ${bullet} Join the Roblox game using the button below
2 ${bullet} Once in the game, enter in your authentication code
3 ${bullet} Verify that everything is entered correctly and submit
4 ${bullet} Your Roblox account is now linked

If you need help or have an issue, seek help in our Support Server.`)
.setTimestamp();

  
  return interaction.reply({ content: `${warn} ${bullet} You already have a session.`, embeds: [embed2], components: [link], ephemeral: true })
}

// Session
let vcode = createCode(12)
let times = Math.floor(Date.now() / 1000)
times = times + 600

let timestampExpire = Math.floor(Date.now() + 600000)

db.set(`session-${i.guild.id}-${i.user.id}`, `${Date.now()}-${timestampExpire}`)
db.set(`sessioncode-${i.guild.id}-${i.user.id}`, vcode)
db.set(`verif-codes-${vcode}`, `${i.guild.id}-${i.user.id}`)

let embed1 = new MessageEmbed()
.setTitle("How to link your Roblox Account")
.setColor("ORANGE")
.addFields({ name: "Your authentication code", value: `\`${vcode}\` (Expires <t:${times}:R>)`})
.setDescription(`
Here are the steps to link your Roblox Account

1 ${bullet} Join the Roblox game using the button below
2 ${bullet} Once in the game, enter in your authentication code
3 ${bullet} Verify that everything is entered correctly and submit
4 ${bullet} Your Roblox account is now linked

If you need help or have a problem, join our Support Server.`)
.setTimestamp();
    await i.reply({ embeds: [embed1], components: [link], ephemeral: true });
    }
}