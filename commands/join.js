module.exports = {
  name: "play",
  alias: ["p"],
  description: "Play youtube music",
  usage: "",
  run: async (client, msg, args) => {
if(!message.member.voice.channel) return message.channel.send("Please connect to a voice channel!"); //If you are not in the voice channel, then return a message
message.member.voice.channel.join(); //Join the voice channel