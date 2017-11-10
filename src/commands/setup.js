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
  async run(msg, args) { // eslint-disable-line complexity
    // Permission check
    if (msg.author.id !== msg.guild.ownerID || this.client.isOwner(msg.author.id)) {
      return msg.reply("you do not have permission to run this command.");
    }
    // Check if arguments are provided
    if (!args.length) {
      return msg.reply("you have not specified one of the following options: `modrole`,`modlog`,`mute`,`joinrole`");
    }
    // Get the option from the arguments
    let option = args[0];
    // Get the key array from the arguments
    let key = args.slice(1);
    // Const exists = await GuildModel.findOne({ where: { guild: msg.guild.id } });
    // Setup for modrole
    if (option === "modrole") {
      if (!key.length) return msg.reply("you did not specify a role.");
      if (!this.validate(key[0], "role", msg)) return msg.reply("you provided an invalid role.");
      const modroleExists = await GuildModel.findOne({ where: { guild: msg.guild.id } });
      if (modroleExists) {
        let role = msg.mentions.roles.first().id || key[0];
        const updatedRows = await GuildModel.update({ modrole: role }, { where: { guild: msg.guild.id } });
        if (updatedRows > 0) {
          return msg.reply("successfully updated the moderator role.");
        }
        return msg.reply("I couldn't update the modrole.");
      } else if (!modroleExists) {
        try {
          await GuildModel.create({
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
          return msg.reply("successfully enabled the moderator role.");
        } catch (err) {
          return msg.reply("I couldn't enable the modrole.");
        }
      }
    }
    if (option === "modlog") {
      if (!this.validate(key[0], "channel", msg)) return msg.reply("you provided an invalid channel.");
      let channel = msg.mentions.channels.first().id || key[0];
      const exists = await GuildModel.findOne({ where: { guild: msg.guild.id } });
      if (exists) {
        const affectedRows = await GuildModel.update({
          modlogChannel: channel,
          isEnabledModlog: true
        }, { where: { guild: msg.guild.id } });
        if (affectedRows > 1) {
          return msg.reply("I successfully updated the mod-log channel.");
        }
        return msg.reply("I couldn't update the modlog channel.");
      }
    }
    if (option === "mute") {
      if (!this.validate(key[0], "role", msg)) return msg.reply("you provided an invalid role.");
    }
    if (option === "joinrole") {
      if (!this.validate(key[0], "role", msg)) return msg.reply("you provided an invalid role.")
    }
    return null;
  }
  async validate(value, type, msg) {
    if (type === "channel") {
      const matches = value.match(/^(?:<#)?([0-9]+)>?$/);
      if (matches) return msg.guild.channels.has(matches[1]);
      return false;
    }
    if (type === "member") {
      const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
      if (matches) {
        try {
          return await msg.guild.members.fetch(await msg.client.users.fetch(matches[1]));
        } catch (err) {
          return false;
        }
      }
      return false;
    }
    if (type === "role") {
      const matches = value.match(/^(?:<@&)?([0-9]+)>?$/);
      if (matches) return msg.guild.roles.has(matches[1]);
      return false;
    }
    return null;
  }
};