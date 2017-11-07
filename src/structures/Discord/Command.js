class Command {
  constructor(client, info) {
    this.constructor.validateInfo(client, info);
    Object.defineProperty(this, "client", { value: client });

    this.name = info.name;

    this.aliases = info.aliases;

    this.group = info.group;

    this.description = info.description;
  }

  async run(message, args) { // eslint-disable-line no-unused-vars, require-await
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  static validateInfo(client, info) {
    if (!client) throw new Error("A client must be specified.");
    if (typeof info !== "object") throw new TypeError("Command info must be an Object.");
    if (typeof info.name !== "string") throw new TypeError("Command name must be a string.");
    if (info.name !== info.name.toLowerCase()) throw new Error("Command name must be lowercase.");
    if (typeof info.description !== "string") throw new TypeError("Command description must be a string.");
    if (info.aliases && (!Array.isArray(info.aliases) || info.aliases.some(ali => typeof ali !== "string"))) {
      throw new TypeError("Command aliases must be an Array of strings.");
    }
    if (info.aliases && info.aliases.some(ali => ali !== ali.toLowerCase())) {
      throw new Error("Command aliases must be lowercase.");
    }
    if (typeof info.group !== "string") throw new TypeError("group name must be a string.");
  }
}

module.exports = Command;