const Sequelize = require("sequelize");
const Database = require("../structures/PostgreSQL");

const Moderation = Database.db.define("guild", {
  // Guild ID
  guild: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Moderator role ID
  modrole: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Muterole ID, if enabled
  muterole: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // The total amount of cases
  totalCases: {
    type: Sequelize.INTEGER,
    default: 0
  },
  // The modlog channel ID, if enabled
  modlogChannel: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // The joinlog channel ID, if enabled
  joinlogChannel: {
    type: Sequelize.STRING,
    allowNull: true
  },
  joinMessage: {
    type: Sequelize.STRING,
    allowNull: true
  },
  joinRoleID: {
    type: Sequelize.STRING,
    allowNull: true
  },
  leaveMessage: {
    type: Sequelize.STRING,
    allowNull: true
  },
  messageChannel: {
    type: Sequelize.STRING,
    allowNull: true
  },
  /* Enabled or disabled */
  // Mute role
  isEnabledMuteRole: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  // Mod log
  isEnabledModlog: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  // Join log
  isEnabledJoinlog: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  // Join message
  isEnabledJoinmessage: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  // Join role
  isEnabledJoinrole: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  // Leave message
  isEnabledLeavemessage: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = Moderation;