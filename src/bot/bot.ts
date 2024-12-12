import { Client, GatewayIntentBits, EmbedBuilder, TextChannel } from 'discord.js';
import { config } from 'dotenv';
import { commands, loadCommands } from './handlers/commandHandler';
import AdvancedPresence from './handlers/advancedPresence'; // Importar el sistema avanzado de presencia

config(); // Cargar variables de entorno desde .env

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] }); // Añadimos GuildMembers
const presenceManager = new AdvancedPresence(client); // Crear instancia del gestor de presencia

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Iniciar la presencia avanzada cambiando cada 10 segundos (10000 ms)
    presenceManager.start(20000);
});

// Manejar las interacciones
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({ content: '¡Comando no encontrado!', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
    }
});

// // Sistema de bienvenida con embed usando el ID del canal
// client.on('guildMemberAdd', async (member) => {
//     const channelId = 'Id'; // Reemplaza con el ID de tu canal de bienvenida

//     // Obtener el canal utilizando su ID
//     const channel = member.guild.channels.cache.get(channelId);

//     // Verificar si el canal existe y si es un canal de texto
//     if (!channel || !(channel instanceof TextChannel)) return;

//     // Crear el embed
//     const welcomeEmbed = new EmbedBuilder()
//         .setColor('#ff6b6b')
//         .setTitle('¡Bienvenido!')
//         .setDescription(`¡Hola ${member.user.username}, Bienvenido al servidor NakamaStream | Anime para todos. ¡Esperamos que disfrutes tu estadía!`)
//         .setThumbnail(member.user.displayAvatarURL({ size: 128 }))  // Usamos la foto del usuario como miniatura
//         .addFields(
//             { name: '¡Esperamos que disfrutes!', value: 'Si necesitas ayuda, no dudes en preguntar.' }
//         )
//         .setTimestamp();

//     // Enviar el mensaje de bienvenida al canal
//     channel.send({ embeds: [welcomeEmbed] });
// });

// Cargar comandos y loguear el bot
(async () => {
    const clientId = process.env.CLIENT_ID as string;
    const token = process.env.TOKEN as string;
    const guildId = process.env.GUILD_ID;

    await loadCommands(clientId, token, guildId);
    await client.login(token);
})();
