import  {Client, GatewayIntentBits, Message}  from 'discord.js';

const client = new Client({ intents: [
GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages , 
GatewayIntentBits.MessageContent , GatewayIntentBits.GuildMembers,
] });

import { connectToMongoDB } from './connection.js';
import { URL } from "./models/modelurl.js"
import shortid from "shortid";
import express from "express";
const app = express()
const PORT = 8000;

const TOKEN = '' // find your token id in discord developer portal

await connectToMongoDB("mongodb://127.0.0.1:27017/Discord-Links").then(()=>{
  console.log("mongoDB connected")
})

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne(
    {
      shortId,
    },
  );
  res.redirect("https://"+entry.redirectURL);
});

async function handleGenerateNewShortURL(url) {
  if (!url) return "URL is required";

  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: url,
  });

  return shortID;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

  client.on('guildMemberAdd', (member) => {
    // Replace 'YOUR_WELCOME_CHANNEL_ID' with the actual ID of the channel where you want to send the welcome message
    const welcomeChannel = member.guild.channels.cache.get('1193851343165718609');

    welcomeChannel.send(`Welcome to the server, ${member.user.username}! 🎉`);
  });


  client.on('messageCreate',async(message)=>{
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('create')) {
      const req = message.content.split('create')[1].trim();
      
      const shorturl = await handleGenerateNewShortURL(req);
      // console.log(shorturl)
      try {
        message.reply({
          content: "Short link created:" + `http://localhost:${PORT}/${shorturl}`,
        });
      } catch (error) {
        message.reply({
          content: `Error creating short link: ${error.message}`,
        });
        console.error(error);
      }
    }
    
    if(message.author.username.toLowerCase() === 'sophisticated_kj' && message.content.toLowerCase().startsWith('hii')){
      message.reply(`Welcome Owner😎`)
      return;
    }else if(message.content.toLowerCase().startsWith('hii')){
      message.reply(`hello ${message.author.username}`)
      return;
    }
      
  })

  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }

  });



client.login(TOKEN);