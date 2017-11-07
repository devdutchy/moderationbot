const GuildModel = require("../models/guild");
const { Command } = require("../structures/Discord");

module.exports = class GuildSetupCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setup",
      aliases: ["init", "set-up"],
      group: "util",
      description: "Sets the guild up for moderation."
    });
  }
  async run(msg, args) {
    // Permission check
    if (msg.author.id !== msg.guild.ownerID || this.client.isOwner(msg.author.id)) {
      return msg.reply("you do not have permission to run this command.");
    }
    // Check if arguments are provided
    if (!args.length) {
      return msg.reply("you have not specified one of the following options: `modrole`,`modlog`,`mute`,`joinmessage`,`leavemessage`,`joinrole`");
    }
    // Get the option from the arguments
    let option = args[0];
    // Get the key array from the arguments
    let key = args.slice(1);
    // Const exists = await GuildModel.findOne({ where: { guild: msg.guild.id } });
    // Setup for modrole
    if (option === "modrole") {
      if (!key.length) return msg.reply("you did not specify a role.");
      const modroleExists = await GuildModel.findOne({ where: { guild: msg.guild.id } });
      if (msg.mentions.roles && modroleExists) {
        const updatedRows = await GuildModel.update({ modrole: msg.mentions.roles.first().id }, { where: { guild: msg.guild.id } });
        if (updatedRows > 0) {
          return msg.reply("successfully updated the moderator role.");
        }
        return msg.reply("I couldn't update the modrole.");
      } else if (msg.mentions.roles && !modroleExists) {
        const updatedRows = await GuildModel.create({
          guild: msg.guild.id,
          modrole: msg.mentions.roles.first().id,
          muterole: null,
          totalCases: 0,
          modlogChannel: null,
          joinlogChannel: null,
          joinMessage: null,
          leaveMessage: null,
          messageChannel: null,
          isEnabledMuteRole: false,
          isEnabledModlog: false,
          isEnabledJoinlog: false,
          isEnabledJoinmessage: false,
          isEnabledJoinrole: false,
          isEnabledLeavemessage: false
        });
        if (updatedRows > 0) {
          return msg.reply("successfully enabled the moderator role.");
        }
        return msg.reply("I couldn't enable the modrole.");
      } else if (!modroleExists) {
        let role = msg.guild.roles.get(key[0]);
        if (!role) return msg.reply("couldn't find a role with that ID.");
        const updatedRows = await GuildModel.create({
          guild: msg.guild.id,
          modrole: role.id,
          muterole: null,
          totalCases: 0,
          modlogChannel: null,
          joinlogChannel: null,
          joinMessage: null,
          leaveMessage: null,
          messageChannel: null,
          isEnabledMuteRole: false,
          isEnabledModlog: false,
          isEnabledJoinlog: false,
          isEnabledJoinmessage: false,
          isEnabledJoinrole: false,
          isEnabledLeavemessage: false
        });
        if (updatedRows > 0) {
          return msg.reply("successfully enabled the moderator role.");
        }
        return msg.reply("I couldn't enable the modrole.");
      }
    }
    return null;
  }
};