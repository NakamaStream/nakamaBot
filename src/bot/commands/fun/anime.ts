import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export const command = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca información de un anime en español.')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del anime que deseas buscar.')
                .setRequired(true)),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const query = interaction.options.getString('titulo');

        try {
            // Realizar la solicitud a la API de Kitsu
            const response = await axios.get('https://kitsu.io/api/edge/anime', {
                params: {
                    'filter[text]': query,
                    'page[limit]': 1
                }
            });

            const anime = response.data.data[0]?.attributes;

            if (!anime) {
                await interaction.reply({ content: 'No se encontró información para el anime proporcionado.', ephemeral: true });
                return;
            }

            // Crear un embed con la información del anime
            const embed = new EmbedBuilder()
                .setColor('#E94E77')
                .setTitle(anime.titles.en || anime.titles.ja_jp || 'Título desconocido')
                .setDescription(anime.synopsis || 'Sin descripción disponible.')
                .setThumbnail(anime.posterImage?.large || '')
                .addFields(
                    { name: 'Título en japonés', value: anime.titles.ja_jp || 'No disponible', inline: true },
                    { name: 'Episodios', value: `${anime.episodeCount || 'Desconocido'}`, inline: true },
                    { name: 'Estado', value: anime.status || 'Desconocido', inline: true },
                    { name: 'Fecha de estreno', value: anime.startDate || 'Desconocida', inline: true }
                )
                .setFooter({ text: 'Datos proporcionados por Kitsu', iconURL: 'https://kitsu.io/favicon.ico' })
                .setTimestamp();

            // Responder con el embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener datos de Kitsu:', error);
            await interaction.reply({ content: 'Hubo un error al buscar el anime. Intenta nuevamente más tarde.', ephemeral: true });
        }
    },
};