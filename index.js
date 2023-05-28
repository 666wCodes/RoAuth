const gamelink = "https://roblox.com/game/testworks"
const db = require('quick.db');
const { error, warn, success, info, bullet } = require('./symbols.json')


//WHERE EXPRESS STARTS

const express = require("express");
const app = express();
const PORT = 9003

app.get("/", (req, res) => {
res.send("hello")
});

app.post("/github", (req, res) => {
  res.send("Done")
  res.status(200);
  process.exit();
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//WHERE EXPRESS END

const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: `${error} | An error occurred while executing the command. Please report this to our support server`, ephemeral: true });
  }
});

client.on('ready', async () => {
  console.clear()
  console.log(`${success} | ${client.user.tag} is online!`)
})

// Create a collection to store the slash commands
client.commands = new Collection();

// Read the contents of the /commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Dynamically register slash commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Bot token and client ID
const token = process.env.BOT_TOKEN
const clientId = '1106842998345568306'

// Create a REST client for registering slash commands


  const commands = [];

  // Place your client and guild ids here

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

  (async () => {
    try {
      console.log(`${info} | Started refreshing application (/) commands.`);

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(`${success} | Successfully reloaded application (/) commands.`);
    } catch (error) {
      console.error(error);
    }

  })();

client.login(process.env.BOT_TOKEN);
