const gamelink = "https://roblox.com/game/testworks"
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

const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

  const rest = new REST({ version: '9' }).setToken(process.env.token);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }

  })();

client.login(process.env.BOT_TOKEN);
