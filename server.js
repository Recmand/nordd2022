const discord = require("discord.js");
const client = new discord.Client({disableMentions:"everyone"})
const db = new Map()
const fs = require("fs")
const snek = require("node-superfetch")

const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log("Pinging");
  response.sendStatus(200);
})
app.listen(process.env.PORT);

client.on("ready", async () => {
  console.log(`${client.user.tag} Bot ready to use`);

  const status = [
    `n- help`,
    `${client.users.cache.size} Users | n- help`, //gunanya untuk count user
    `${client.guilds.cache.size} Servers | n- help` //gunanya untuk count server yang dimasuki oleh bot
    ]
  setInterval(() => {
    client.user.setActivity(status[Math.floor(Math.random() * status.length)], {type : "LISTENING"}) //watching bisa kalian ganti sama playing dan semacamnya
  }, 5000)
});

client.on('guildCreate', guild => {
  guild.systemChannel.send(`Hello, I'm Nordd bot. Thanks for inviting me, I hope you enjoy:)`)
});

const { prefix } = require("./config.json")
client.aliases = new discord.Collection();
client.commands = new discord.Collection();
client.prefix = prefix
client.queue = new Map()
client.hastebin = async(text) => {
  const { body } = await snek.post("https://bin-clientdev.glitch.me/documents")
  .send(text);
  return `https://bin-clientdev.glitch.me/${body.key}`
}


const commandFile = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
commandFile.forEach(file => {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command);
  if(command.alias) {
  command.alias.forEach(alias => {
  client.aliases.set(alias, command);
  })
  }
  console.log(`Loaded command ${command.name} with alias(es) => ${command.alias}`)
  })

client.on('message', msg => {
  if(msg.author.bot) return;
  if(!msg.guild) return;
  
  if(msg.content == `<@${client.user.id}>`){
    const embed = new discord.MessageEmbed()
    .setDescription(`:wave: | My prefix is ${prefix}`)
    .setColor("YELLOW")
    msg.channel.send(embed)
  }
  if(msg.content == prefix) {
    const embed = new discord.MessageEmbed()
    .setDescription(`Hey, It's me!
You can type ${prefix}help to get bot commands list`)
    .setColor("YELLOW")
    return msg.channel.send(embed)
  }
  let args = msg.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift().toLowerCase();
  if(!msg.content.startsWith(prefix)) return;
  
  try {
    const file = client.commands.get(cmd) || client.aliases.get(cmd)
    if(!file) return msg.reply("Command that you want doesn't exist.")
    
    const now = Date.now()
   if (db.has(`cooldown_${msg.author.id}`)) {
	const expirationTime = db.get(`cooldown_${msg.author.id}`) + 3000;
	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${file.name}\` command.`);
	}
}
  db.set(`cooldown_${msg.author.id}`, now);
  setTimeout(() => {
    db.delete(`cooldown_${msg.author.id}`)
  },3000)
    
    file.run(client, msg, args)
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`${msg.author.tag} using ${cmd} in ${msg.channel.name} | ${msg.guild.name}`)
  }
}) 


//insert token at .env first
client.login(process.env.TOKEN)
