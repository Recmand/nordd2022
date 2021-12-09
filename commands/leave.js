module.exports = {
  name: "leave",
  alias:["close"],
  description: "leave voice channel",
  run: async(client, message) => {
const serverQueue = client.queue.get(message.guild.id);
if(!message.guild.me.voice.channel) return message.channel.send("I'm not in a voice channel"); //If the bot is not in a voice channel, then return a message
message.guild.me.voice.channel.leave(); //Leave the voice channel
  message.reply(`good bye👋👋`)
  }
}