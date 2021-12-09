module.exports = {
  name: "join",
  alias:["j"],
  description: "Join voice channel",
  run: async(client, message) => {
if(!message.member.voice.channel) return message.channel.send("Please connect to a voice channel!"); //If you are not in the voice channel, then return a message
message.member.voice.channel.join(); //Join the voice channel
    message.reply(`Hi im here👋`)
  }
}
