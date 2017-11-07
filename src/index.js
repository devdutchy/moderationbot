const Discord = require("./structures/Discord");
const winston = require("winston");
const fs = require("fs");
const { stripIndents, oneLine } = require("common-tags");
const { PREFIX, OWNER, TOKEN } = require("../config");

const client = new Discord.Client({
  disableEveryone: true,
  owner: OWNER,
  presence: {
    name: `-help`,
    type: 0
  }
});

const loadCommands = Client => { // eslint-disable-line arrow-body-style
  return new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/commands/`, (err, files) => {
      if (err) reject(err);
      if (files === undefined || !files.length || typeof files === "undefined") {
        reject("No commands in the directory found."); // eslint-disable-line prefer-promise-reject-errors
      }
      console.log(files); // eslint-disable-line no-console
      files.forEach(file => {
        let Command = require(`./commands/${file}`);
        let Module;
        if (typeof Command === "function") Module = new Command(Client);
        if (!(Module instanceof Discord.Command)) {
          return winston.warn(`[DISCORD]: Invalid command ${file}, skipping...`);
        }
        Client.commands.set(Module.name, Module);
        winston.info(`[DISCORD]: Loading Command: ${Module.name}.`);
        if (Module.aliases) {
          Module.aliases.forEach(alias => { // eslint-disable-line max-nested-callbacks                        
            Client.aliases.set(alias, Module.name);
          });
        }
        return winston.info(`[DISCORD]: Loaded command ${Module.name}`);
      });
    });
    resolve();
  });
};

loadCommands(client)
  .catch(err => winston.error(`Failed to load commands: ${err}`));

let prefix;
client.on("ready", () => {
  winston.info("[DISCORD]: Ready");
  prefix = new RegExp(`^(<@!?${client.user.id}>|${PREFIX}?)`, "i");
})
  .on("error", err => {
    winston.error(`[DISCORD]: ${err.stack}`);
  })
  .on("warn", info => {
    winston.warn(`[DISCORD]: ${info}`);
  })
  .on("message", async msg => {
    // Check if command starts with prefix and is not run by a bot
    if (msg.author.bot || !prefix || !prefix.test(msg.content)) return;

    // Get command and arguments
    let [command, ...args] = msg.content.replace(prefix, "").trim().split(" ");

    // Check if the command exists in the commands collection
    let cmd;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.client.aliases.get(command));
    }
    if (cmd) {
      try {
        await cmd.run(msg, args);
        winston.info(oneLine`
        [DISCORD]: Command run: ${cmd} 
          >> Guild: ${msg.guild} 
          >> Message author: ${msg.author.tag} 
          >> Arguments: ${args.join(", ")}
          >> Content: ${msg.content.replace(prefix, "").trim().toLowerCase()}
        `);
      } catch (error) {
        winston.error(stripIndents`
          [DISCORD] Error in command ${cmd}: 
          ${error.stack}
        `);
        msg.reply(`an error occurred while running the command, which you should never receive: \`${error.message}\``);
      }
    }
  });

client.login(TOKEN)
  .then(() => winston.info(`[DISCORD]: Logged in successfully as ${client.user.tag}`))
  .catch(err => {
    client.emit("warn", `Failed to login to the WebSocket: ${err}`);
    process.exit(1);
  });

process.on("unhandledRejection", (err, promise) => {
  winston.warn(`[PROCESS]: Unhandled promise rejection at promise ${promise}: ${err.stack}`);
});

process.on("unhandledException", err => {
  winston.warn(`[PROCESS]: Unhandled exception: ${err.stack}`);
  process.exit(1);
});