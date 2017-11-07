const Database = require("../PostgreSQL");
const discord = require("discord.js");

class ModClient extends discord.Client {
  constructor(options) {
    super(options);

    this.db = Database.db;

    this.commands = new discord.Collection();

    this.aliases = new discord.Collection();

    this.commandPrefix = options.prefix;

    this.owner = options.owner;

    if (options.owner) {
      this.once("ready", () => {
        this.users.fetch(options.owner).catch(err => {
          this.emit("warn", `Unable to fetch owner ${options.owner}.`);
          this.emit("error", err);
        });
      });
    }

    // Start the database
    Database.start();

    // Handle the messages
    this.on("message", async msg => {
      if (msg.author.bot) return;
      if (!msg.content.startsWith(this.commandPrefix)) return;

      // Shortcut to the prefix
      let prefix = this.commandPrefix;

      // Get the arguments from the message
      const args = this.constructor.createParams(msg);

      // Get the command from the message
      const command = this.constructor.getCommand(msg, prefix);

      // Check if the command exists in the commands collection
      let cmd;
      if (this.commands.has(command)) {
        cmd = this.commands.get(command);
      } else if (this.aliases.has(command)) {
        cmd = this.commands.get(this.client.aliases.get(command));
      } else {
        this.emit("unknownCommand", cmd, msg);
      }
      if (cmd) {
        try {
          this.emit("commandRun", cmd, msg, args);
          await cmd.run(msg, args, prefix);
        } catch (error) {
          this.emit("commandError", error, cmd, msg, args);
          msg.reply(`an error occurred while running the command, which you should never receive: \`${error.message}\``);
        }
      }
    });
  }
  static createParams(message) {
    const params = message.content.split(" ").slice(1);
    return params;
  }
  static getCommand(message, prefix) {
    const command = message.content.split(" ")[0].slice(prefix.length).toLowerCase();
    return command;
  }
}

module.exports = ModClient;