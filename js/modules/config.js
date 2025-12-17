/**
 * =============================================================================
 * GCMIRINCONCITO - CONFIGURACIÓN GLOBAL
 * =============================================================================
 * 
 * Configuraciones globales y datos de la aplicación.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
    appName: 'GCMiRinconcito',
    version: '1.0.0',
    debug: false
};

/**
 * Configuración de WhatsApp
 */
export const WHATSAPP_CONFIG = {
    phoneNumber: '529811579841',
    messages: {
        banner: 'Estoy interesado en sus mascotas premium.',
        services: 'Necesito asesoría sobre sus productos y servicios.',
        club: 'Quiero unirme al Club Premium de GCMiRinconcito.',
        breed: (breedName) => `Estoy interesado en la raza ${breedName}`,
        chatHandoff: (agentName, customerName, summary) => 
            `¡Hola! Vengo del chat con ${agentName}. Mi nombre es ${customerName}. Resumen: ${summary}`
    }
};

/**
 * Configuración del chatbot
 */
export const CHATBOT_CONFIG = {
    agentNames: ['Sofía', 'Carlos', 'Ana', 'Miguel', 'Laura'],
    inactivityTimeout: 30000,      // 30 segundos
    closeTimeout: 60000,           // 1 minuto
    proactiveTimeout: 12000,       // 12 segundos
    reconnectDelay: {
        min: 10000,                // 10 segundos
        max: 60000                 // 60 segundos
    }
};

/**
 * Configuración del carrusel
 */
export const CAROUSEL_CONFIG = {
    cardWidth: 320,
    gap: 24,
    autoScrollInterval: 5000       // 5 segundos
};

/**
 * Datos de razas de conejos
 */
export const BREEDS_DATA = {
    'nueva-zelanda': { 
        title: 'Nueva Zelanda', 
        category: 'grandes',
        images: [
            'assets/images/nueva-zelanda-1.png', 
            'assets/images/nueva-zelanda-2.png'
        ], 
        description: 'El conejo de Nueva Zelanda es una de las razas de conejos grandes más populares. Originario de Estados Unidos, a pesar de su nombre, se caracteriza por su cuerpo robusto y bien musculoso. Su pelaje es corto, denso y brillante, con colores que van del blanco al rojo. Son conocidos por su temperamento dócil y tranquilo, lo que los convierte en excelentes mascotas familiares.', 
        characteristics: [
            { name: 'Peso', value: '4 - 5 kg' }, 
            { name: 'Longevidad', value: '8 - 12 años' }, 
            { name: 'Tamaño', value: 'Grande' },
            { name: 'Origen', value: 'Estados Unidos' },
            { name: 'Temperamento', value: 'Tranquilo y dócil' },
            { name: 'Pelaje', value: 'Corto, denso y brillante' }
        ] 
    },
    'californiano': { 
        title: 'Californiano', 
        category: 'medianas',
        images: [
            'assets/images/californiano-1.png', 
            'assets/images/californiano-2.png',
            'assets/images/californiano-3.png'
        ], 
        description: 'El conejo Californiano es una raza desarrollada en California, Estados Unidos, a principios del siglo XX. Es el resultado del cruce entre las razas Nueva Zelanda y Chinchilla. Se caracteriza por su cuerpo mediano y bien proporcionado, con un pelaje blanco excepto en las extremidades, la cola, las orejas y la nariz, que son de color marrón oscuro o negro.', 
        characteristics: [
            { name: 'Peso', value: '3.5 - 4.5 kg' }, 
            { name: 'Longevidad', value: '10 - 12 años' }, 
            { name: 'Tamaño', value: 'Mediano' },
            { name: 'Origen', value: 'Estados Unidos' },
            { name: 'Temperamento', value: 'Activo y curioso' },
            { name: 'Pelaje', value: 'Blanco con extremidades oscuras' }
        ] 
    },
    'chinchilla': { 
        title: 'Chinchilla', 
        category: 'medianas',
        images: [
            'assets/images/chinchilla-1.png', 
            'assets/images/chinchilla-2.png',
            'assets/images/chinchilla-3.png',
            'assets/images/chinchilla-4.png'
        ], 
        description: 'El conejo Chinchilla es una raza originaria de Francia, desarrollada a finales del siglo XIX. Su nombre se debe al parecido de su pelaje con el de la chinchilla. Se caracteriza por su cuerpo mediano, orejas erectas y un pelaje denso y suave con un color gris plateado característico.', 
        characteristics: [
            { name: 'Peso', value: '2.5 - 3.5 kg' }, 
            { name: 'Longevidad', value: '10 - 12 años' }, 
            { name: 'Tamaño', value: 'Mediano' },
            { name: 'Origen', value: 'Francia' },
            { name: 'Temperamento', value: 'Inteligente y tranquilo' },
            { name: 'Pelaje', value: 'Gris plateado, denso y suave' }
        ] 
    },
    'mariposa': { 
        title: 'Mariposa', 
        category: 'medianas',
        images: [
            'assets/images/mariposa-1.png', 
            'assets/images/mariposa-2.png',
            'assets/images/mariposa-3.png'
        ], 
        description: 'El conejo Mariposa es una de las razas más antiguas y distintivas, originaria de Inglaterra. Su nombre proviene del patrón de su pelaje, que recuerda alas de mariposa. Se caracteriza por su cuerpo mediano, orejas erectas y un patrón de color único.', 
        characteristics: [
            { name: 'Peso', value: '2 - 3 kg' }, 
            { name: 'Longevidad', value: '12 - 14 años' }, 
            { name: 'Tamaño', value: 'Mediano' },
            { name: 'Origen', value: 'Inglaterra' },
            { name: 'Temperamento', value: 'Activo y juguetón' },
            { name: 'Pelaje', value: 'Blanco con manchas simétricas' }
        ] 
    },
    'belier-frances': { 
        title: 'Belier Francés', 
        category: 'grandes',
        images: [
            'assets/images/belier-frances-1.png', 
            'assets/images/belier-frances-2.png',
            'assets/images/belier-frances-3.png'
        ], 
        description: 'El Belier Francés es una de las razas de conejos más grandes y reconocibles, originaria de Francia. Se caracteriza por su cabeza voluminosa, orejas largas y caídas que pueden medir hasta 38 cm, y un cuerpo robusto.', 
        characteristics: [
            { name: 'Peso', value: '4.5 - 6 kg' }, 
            { name: 'Longevidad', value: '8 - 10 años' }, 
            { name: 'Tamaño', value: 'Grande' },
            { name: 'Origen', value: 'Francia' },
            { name: 'Temperamento', value: 'Tranquilo y afectuoso' },
            { name: 'Orejas', value: 'Largas y caídas (hasta 38 cm)' }
        ] 
    },
    'enano-holandes': { 
        title: 'Enano Holandés', 
        category: 'pequenas',
        images: [
            'assets/images/enano-holandes-1.png', 
            'assets/images/enano-holandes-2.png',
            'assets/images/enano-holandes-3.png'
        ], 
        description: 'El Enano Holandés es la raza de conejo más pequeña del mundo, originaria de los Países Bajos. Se caracteriza por su cuerpo compacto, cabeza redonda y orejas cortas y erectas.', 
        characteristics: [
            { name: 'Peso', value: '0.9 - 1.3 kg' }, 
            { name: 'Longevidad', value: '10 - 12 años' }, 
            { name: 'Tamaño', value: 'Pequeño' },
            { name: 'Origen', value: 'Países Bajos' },
            { name: 'Temperamento', value: 'Vivaz y curioso' },
            { name: 'Cuerpo', value: 'Compacto y redondeado' }
        ] 
    },
    'cabeza-leon': { 
        title: 'Cabeza de León', 
        category: 'pequenas',
        images: [
            'assets/images/cabeza-de-leon-1.png', 
            'assets/images/cabeza-de-leon-2.png',
            'assets/images/cabeza-de-leon-3.png',
            'assets/images/cabeza-de-leon-4.png'
        ], 
        description: 'El conejo Cabeza de León es una raza de origen belga, reconocida por su distintiva melena alrededor de la cabeza que recuerda a la de un león. Se caracteriza por su cuerpo pequeño y compacto, orejas erectas y un pelaje largo y denso.', 
        characteristics: [
            { name: 'Peso', value: '1.3 - 1.7 kg' }, 
            { name: 'Longevidad', value: '8 - 10 años' }, 
            { name: 'Tamaño', value: 'Pequeño (Toy)' },
            { name: 'Origen', value: 'Bélgica' },
            { name: 'Temperamento', value: 'Afectuoso y juguetón' },
            { name: 'Pelaje', value: 'Largo con melena característica' }
        ] 
    }
};
