const https = require('https');

function getRobloxProfilePicture(robloxId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'thumbnails.roblox.com',
      path: `/v1/users/avatar?userIds=${robloxId}&size=720x720&format=Png&isCircular=false`,
      method: 'GET',
    };

    const request = https.request(options, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        const parsedData = JSON.parse(data);

        if (parsedData.data.length > 0) {
          const imageUrl = parsedData.data[0].imageUrl;
          console.log(`Profile Picture URL: ${imageUrl}`);
          resolve(imageUrl);
        } else {
          console.log(`No profile picture found for Roblox ID: ${robloxId}`);
          resolve(null);
        }
      });
    });

    request.on('error', error => {
      console.error('Error retrieving profile picture:', error.message);
      reject(error);
    });

    request.end();
  });
}

const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Your linked Roblox account data')
    .addBooleanOption(option => option.setName('private').setDescription('Whether the message is hidden to others').setRequired(true)),
    async execute(interaction, client) {
        const i = interaction
        if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
        let profile = await db.get(`profile-${i.guild.id}-${i.user.id}`)
        if(!profile || profile === null) return interaction.reply({ content: `${error} ${bullet} You have not linked your account yet`})
        let username = profile.split("-")[0]
        let id = profile.split("-")[1]

        let link = `https://www.roblox.com/users/${id}/profile`
        const embed = new MessageEmbed()
        .setTitle(`${username}`)
        .setThumbnail(getRobloxProfilePicture(id))
        .setDescription(`[${username}](${link}) is linked to Discord account: ${interaction.user.tag}`)
        .setTimestamp()
        .setColor("RANDOM")

        let emp = interaction.options.getBoolean('private');
        interaction.reply({ embeds: [embed], ephemeral: emp})
        
    }
}