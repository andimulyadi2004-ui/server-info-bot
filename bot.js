import { Client, GatewayIntentBits, PermissionFlagsBits } from "discord.js";

const CHANNELS = (process.env.CHANNEL_IDS || "1571004587509293136,1571114150690557972,1571300200050462822")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

function boleh(msg, member) {
  if (msg.author.id === client.user.id) return true;
  if (msg.guild.ownerId === msg.author.id) return true;
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  return member.roles.cache.some((r) => r.name.toLowerCase().includes("admin"));
}

client.on("messageCreate", async (msg) => {
  if (!CHANNELS.includes(msg.channelId) || !msg.guild) return;
  const member =
    msg.member ?? (await msg.guild.members.fetch(msg.author.id).catch(() => null));
  if (boleh(msg, member)) return;
  try {
    await msg.delete();
  } catch (e) {
    console.error("Gagal hapus:", e.message);
  }
});

client.once("clientReady", () => console.log("Login sebagai", client.user.tag));
client.login(process.env.TOKEN);
