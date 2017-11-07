const { Command } = require("../structures/Discord");
const { oneLine } = require("common-tags");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      group: "util",
      description: "Shows the bot's ping"
    });
  }
  async run(msg) {
    const pingMsg = await msg.channel.send("Pinging...");
    if (pingMsg.editable) {
      return pingMsg.edit(oneLine`
        Pong! The message latency is ${pingMsg.createdTimestamp - msg.createdTimestamp}ms. 
        The API latency is ${Math.round(this.client.ping)}ms.
      `);
    } else {
      return msg.channel.send(oneLine`
        Pong! The message latency is ${pingMsg.createdTimestamp - msg.createdTimestamp}ms. 
        The API latency is ${Math.round(this.client.ping)}ms.
      `);
    }
  }
};