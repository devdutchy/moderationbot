const Database = require("../PostgreSQL");
const { Client, Collection } = require("discord.js");

class ModClient extends Client {
  constructor(options) {
    super(options);

    this.db = Database.db;

    this.commands = new Collection();

    this.aliases = new Collection();

    // Owner ID
    this.owner = options.owner;

    if (options.owner) {
      this.once("ready", () => {
        this.users.fetch(options.owner).catch(err => {
          this.emit("warn", `Unable to fetch owner ${options.owner}.`);
          this.emit("error", err);
        });
      });
    }

    if (options.presence) {
      if (typeof options.presence !== "object") throw new TypeError("Presence must be an object.");
      this.once("ready", () => {
        this.user.setActivity(
          options.presence.name, {
            url: options.presence.url ? options.presence.url : null,
            type: options.presence.type && typeof options.presence.type === "number" ? options.presence.type : 0
          });
      });
    }

    // Start the database
    Database.start();
  }
  isOwner(userID) {
    if (this.owner === userID) return true;
    return false;
  }
}

module.exports = ModClient;