import { Client, ActivityType } from 'discord.js';
import axios from 'axios';

interface ApiResponse {
    userCount: number;
}

class AdvancedPresence {
    private client: Client;
    private interval: NodeJS.Timeout | null = null;

    constructor(client: Client) {
        this.client = client;
    }

    // Método para iniciar la presencia avanzada
    public start(intervalTime: number) {
        if (this.interval) return; // Evitar múltiples intervalos

        this.interval = setInterval(async () => {
            try {
                // Hacemos la solicitud a la API
                const response = await axios.get('https://nakamastream.lat/api/registered-users');
                
                // Comprobamos la respuesta de la API
                const data = response.data as ApiResponse;  // Type assertion here

                // Accedemos directamente a 'userCount' desde la respuesta
                const userCount = data.userCount;

                // Verificamos si userCount es un número
                if (typeof userCount === 'number') {
                    // Definir la actividad con el número de usuarios registrados
                    const activity = { name: `Con ${userCount} usuarios registrados`, type: ActivityType.Watching };

                    // Establecer la presencia
                    this.setPresence(activity);
                } else {
                    console.error('El valor de userCount no es un número válido');
                }
            } catch (error) {
                console.error('Error al obtener los usuarios registrados:', error);
            }
        }, intervalTime);
    }

    // Método para detener la presencia avanzada
    public stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // Método para establecer la presencia
    private setPresence(activity: { name: string; type: ActivityType }) {
        this.client.user?.setPresence({
            activities: [{
                name: activity.name,
                type: activity.type,
            }],
            status: 'online',
        });
    }
}

export default AdvancedPresence;
