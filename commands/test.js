const db = require('quick.db');
const { discord, MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = {
  name: 'connect',
  description: 'Connects Roblox with Discord.',
  async execute(interaction) {

	let robloxusername = db.get(`roblox-name-${interaction.member.id}`)
    let robloxuserid = db.get(`roblox-id-${interaction.member.id}`)
    
    if(robloxusername !== null && robloxuserid !== null) return interaction.reply({ content: `Hello! You are already connected as ${robloxusername}(${robloxuserid})/nYou can get your role(s) in any server by clicking the button!`, ephemeral: true})

    //db.set(`coderoblox.${code}`)
     const modal = new Modal()
			.setCustomId('auth')
			.setTitle('Connect your Roblox account');
      
      const roblox = new TextInputComponent()
			.setCustomId('roblox')
			.setLabel("Enter your Roblox username")
			.setStyle('SHORT');
		

const firstActionRow = new MessageActionRow().addComponents(roblox);
		modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
  },
};