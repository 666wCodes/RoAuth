const gamelink = "https://roblox.com/game/test"
const db = require('quick.db');

//WHERE EXPRESS STARTS

const express = require("express");
const app = express();
const PORT = 9003

app.get("/", (req, res) => {
res.send("hello")
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//WHERE EXPRESS ENDS

const { Client, Collection, Intents, Discord } = require('discord.js');
const fs = require('fs');
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
});

// Create a collection to store the slash commands
client.commands = new Collection();

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  registerSlashCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isModalSubmit()){
const roblox = interaction.fields.getTextInputValue('roblox');
    let isverified = db.get(`roblox-verified-${roblox}`)
	if(isverified !== null) return interaction.reply({ content: "This Roblox account is already connected to another user, or yours, to change it, do "})
    let robloxusername = db.get(`roblox-name-${interaction.member.id}`)
    let robloxuserid = db.get(`roblox-id-${interaction.member.id}`)
	let session = db.get(`discord-session-${interaction.member.id}`)
    let robloxsession = db.get(`roblox-session-${roblox}`)
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`Hello ${roblox}`)
        .addFields({ name: "Please verify your discord account by joining the roblox game below with your roblox account", value: `**${gamelink}**`})
		.setTimestamp()
        .setFooter("If you need support, don\'t be afraid to join our Discord Server")
        await interaction.reply({ content: `This session expires in 10 minutes.`, embeds: [embed], ephemeral: true });
    }
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Find and execute the matching slash command
  const command = client.commands.get(commandName);
  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      await interaction.reply({
        content: 'Something happened when you use this command, try again?',
        ephemeral: true,
      });
    }
  }
});

// Function to register all slash commands globally
async function registerSlashCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    // Create the global slash command
    const commandData = {
      name: command.name,
      description: command.description,
      options: command.options,
    };

    await client.application.commands.create(commandData);
    console.log(`Created command ${command.name}`);
  }
}

client.login('MTEwNjg0Mjk5ODM0NTU2ODMwNg.GUY9Rl.x1sRIebe6o4cazanOixNwl3GdoPONwl4-ockcE');