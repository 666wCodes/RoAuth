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

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const gamelink = "https://roblox.com/game/testworks"
const db = require('quick.db');
const { error, warn, success, info, bullet, restricted } = require('./symbols.json')
require('dotenv').config()


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


app.get(`/v1/codeget`, async (req, res) => {
  let authcode = String(req.query.auth)
  if(!authcode || authcode === null || authcode.toUpperCase() != `${process.env.AUTH_CODE}`){
    await res.status(401);
    return res.json({ error: "Access denied" })
  }
  let querycode = String(req.query.code).toUpperCase()
  let getcodedata = await db.get(`verif-codes-${querycode}`)
  if(getcodedata === null){
    await res.status(400);
    return res.json({ error: "Invalid code"})
  }

  let dataguild = getcodedata.split("-")[0]
  let datauser = getcodedata.split("-")[1]
  const codeuser = await client.users.fetch(datauser);
let gsession = db.get(`session-${dataguild}-${datauser}`)
        let gcreated = String(gsession).split("-")[0]
        let gexpires = String(gsession).split("-")[1]
    
    if(Date.now() >= gexpires){
          db.delete(`session-${dataguild}-${datauser}`)
          db.delete(`sessioncode-${dataguild}-${datauser}`)
          db.delete(`verif-codes-${querycode}`)
        await res.status(400);
        return res.json({ error: "Invalid code"})
        }

  await res.status(200);
  res.json({ user: `${codeuser.tag}`, id: `${codeuser.id}`, guild: `${dataguild}`})
  

  //res.json({
  //process.exit();
})

app.post('/v1/codepost', async (req, res) => {
  let postcode = req.headers.code
  let postauth = req.headers.auth
  let rblxName = req.headers.name
  let rblxId = req.headers.id

  //if(!postcode || !postauth || !rbslxName || !rblxId || postcode === null || postauth === null || rblxName === null || rblxId === null){
    //await res.status(400)
    //return res.json({ error: "You need to specify auth, code, roblox username & roblox id!"})
  //}

  if(String(postauth).toUpperCase() != `${process.env.AUTH_CODE}`){
    await res.status(401);
    return res.json({ error: "Access denied" })
  }

  let getpostcodedata = await db.get(`verif-codes-${postcode}`)
  if(!getpostcodedata || getpostcodedata === null){
    await res.status(400);
    return res.json({ error: "Invalid code", errcode: "0"})
  }


  let postdataguild = getpostcodedata.split("-")[0]
  let postdatauser = getpostcodedata.split("-")[1]

        const roleid = db.get(`paneldata-role-${postdataguild}`)
        const changenick = db.get(`paneldata-nick-${postdataguild}`)
        
        const GuildDiscord = await client.guilds.fetch(postdataguild);
        const UserDiscord = await GuildDiscord.members.fetch(postdatauser);
        const UserDisc = await client.users.fetch(postdatauser);

        const StartTime = Date.now()

        let postsession = db.get(`session-${postdataguild}-${postdatauser}`)
        let postcreated = String(postsession).split("-")[0]
        let postexpires = String(postsession).split("-")[1]

        if(Date.now() >= postexpires){
          db.delete(`session-${postdataguild}-${postdatauser}`)
          db.delete(`sessioncode-${postdataguild}-${postdatauser}`)
          db.delete(`verif-codes-${postcode}`)
        await res.status(400);
        return res.json({ error: "Invalid code"})
        }

        let accrobloxAlrV = db.get(`rblx-verified-${rblxId}`)
        if(accrobloxAlrV !== null){
          await res.status(400);
        return res.json({ error: "This Roblox Account is already linked!!!", errcode: "1" })
        }

        if(roleid !== null && !UserDiscord.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
      const role = await GuildDiscord.roles.fetch(roleid)
      if(role){
        try {
        await UserDiscord.roles.add(role)
        } catch {
        await res.status(400);
        return res.json({ error: "Unable to assign role: no perms", errcode: "2"})
        }
      } else {
        await res.status(400);
        return res.json({ error: "Unable to assign role: no role?", errcode: "3"})
      }
        }

      if(changenick === 'true' && !UserDiscord.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
        try {
        await UserDiscord.setNickname(String(rblxName))
        } catch {
          await res.status(400);
        return res.json({ error: "Unable to change nick: no perms", errcode: "4"})
        }
      }

      if(roleid === null && changenick === null){
        await res.status(400);
        return res.json({ error: "Misconfiguration", errcode: "5"})
      }

      const EndTime = Date.now()
      const timeTook = Math.round(EndTime - StartTime)

      await db.delete(`session-${postdataguild}-${postdatauser}`)
      await db.delete(`sessioncode-${postdataguild}-${postdatauser}`)
      await db.delete(`verif-codes-${postcode}`)
      await db.set(`verified-${postdataguild}-${postdatauser}`, `true-${postdataguild}`)
      await db.set(`profile-${postdataguild}-${postdatauser}`, `${rblxName}-${rblxId}`)
      await db.set(`rblx-verified-${rblxId}`, `true`)


      let strText = ".";
      if(UserDiscord.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) strText = ", because you are a server admin, you have not been granted roles or had your nickname changed."
      try{
      await UserDisc.send(`You are now linked as **${rblxName}** in **${GuildDiscord.name}**${strText}`)
      } catch {
        await res.status(200);
        return res.json({ warn: "Cannot send dm to that user, make sure he has DMs enabled, it is very important", success: "true", time: `${timeTook}ms`})
      }

      await res.status(200);
      await res.json({ success: "true", time: `${timeTook}ms`})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//WHERE EXPRESS END

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('interactionCreate', async (interaction) => {
  //console.log("Slash command triggered")
  let i = interaction

  if (!interaction.isSelectMenu()){
    
}
  if (interaction.isButton()){
    
    if(i.customId === 're'){
      //if(i.member.permissions.has(Permiessions.FLAGS.ADMINISTRATOR)) return interaction.editReply({ content: `${warn} ${bullet} You are an admin, you do not need to link your account here.`, ephemeral: true })
      
      let ReVerID = String(await db.get(`profile-${i.guild.id}-${i.user.id}`)).split("-")[1]
      await db.delete(`verified-${i.guild.id}-${i.user.id}`)
      await db.delete(`rblx-verified-${ReVerID}`)
      await db.delete(`profile-${i.guild.id}-${i.user.id}`)
      await interaction.update({ content: `${success} ${bullet} Unlinked, please continute linking by pressing the button below the panel or using \`/link\`.`, components: [], ephemeral: true })
    }
    if(i.customId === "link"){
      //if(i.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({ content: `${warn} ${bullet} You are an admin, you do not need to link your account here.`, ephemeral: true })
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
  console.log(`${success} ${bullet} ${client.user.tag} is online!`)
  client.user.setPresence({
    activities: [{ name: '/help & /link', type: 'WATCHING' }],
    status: 'dnd',
  });
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
      console.log(`${info} ${bullet} Started refreshing application (/) commands.`);

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(`${success} ${bullet} Successfully reloaded application (/) commands.`);
    } catch (error) {
      console.error(error);
    }

  })();

client.login(process.env.BOT_TOKEN);
