import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel } from 'discord.js';
import axios from 'axios';

export const command = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Muestra una waifu aleatoria.')
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('La categoría de la waifu')
                .addChoices(
                    { name: 'SFW', value: 'sfw' },
                    { name: 'NSFW', value: 'nsfw' }
                )
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const categoria = interaction.options.getString('categoria');

            // Verificar si la categoría es NSFW y si el canal es un TextChannel y es NSFW
            if (categoria === 'nsfw' && !(interaction.channel instanceof TextChannel && interaction.channel.nsfw)) {
                return await interaction.reply('Este comando solo se puede usar en canales NSFW.');
            }

            const url = `https://api.waifu.pics/${categoria}/waifu`;

            // Hacer la solicitud a la API de waifu.pics usando axios
            const response = await axios.get(url);
            const data = response.data;

            // Crear un embed para mostrar la waifu
            const embed = new EmbedBuilder()
                .setColor('#FF69B4') // Color del embed
                .setTitle('Aquí tienes una waifu aleatoria')
                .setImage(data.url) // URL de la imagen de la waifu
                .setFooter({ text: '¡Disfruta!', iconURL: interaction.user.displayAvatarURL() }) // Pie de página con avatar del usuario
                .setTimestamp(); // Timestamp

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener la waifu:', error);
            await interaction.reply('Ocurrió un error al obtener una waifu. Por favor, inténtalo de nuevo más tarde.');
        }
    },
};
