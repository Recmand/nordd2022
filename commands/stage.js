module.exports = {
  name: "stage",
  description: "join stage channel",
  run: async(client, message, args) => {
if(!message.guild.me.voice?.channel.type==="GUILD_STAGE_VOICE"){
		message.guild.me.voice.setSuppressed(false); //false = become speaker
	}
  }
};