/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE CHATBOT
 * =============================================================================
 * 
 * Maneja el widget de chat con IA usando Gemini API.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

import { CHATBOT_CONFIG, WHATSAPP_CONFIG } from './config.js';
import { parseMarkdown, getWhatsAppLink, getRandomExcluding } from './utils.js';

/**
 * Clase para manejar el chatbot
 */
class ChatbotManager {
    constructor() {
        // Elementos del DOM
        this.bubble = document.getElementById('chat-bubble');
        this.widget = document.getElementById('chat-widget');
        this.minimizeBtn = document.getElementById('minimize-chat');
        this.closeBtn = document.getElementById('close-chat');
        this.messagesContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input-field');
        this.sendBtn = document.getElementById('chat-send-btn');
        this.agentNameEl = document.getElementById('agent-name');
        
        // Estado
        this.currentAgentName = '';
        this.customerName = null;
        this.chatHistory = [];
        this.chatInitiated = false;
        this.conversationEnded = false;
        this.isWaitingForName = false;
        this.chatMinimized = false;
        
        // Timers
        this.inactivityTimer = null;
        this.closeChatTimer = null;
        this.proactiveChatTimer = null;
        
        // Mensajes de inactividad usados
        this.usedInactivityMessages = new Set();
        
        // Audio
        this.synth = null;
        
        this.init();
    }

    /**
     * Inicializa el chatbot
     */
    init() {
        this.initAudio();
        this.setupEventListeners();
        this.setupProactiveChat();
    }

    /**
     * Inicializa el sistema de audio
     */
    initAudio() {
        try {
            if (typeof Tone !== 'undefined') {
                this.synth = new Tone.Synth().toDestination();
            }
        } catch (e) {
            console.warn('Could not initialize audio:', e);
        }
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        this.bubble?.addEventListener('click', () => this.toggle());
        this.minimizeBtn?.addEventListener('click', () => this.minimize());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.sendBtn?.addEventListener('click', () => this.handleUserMessage());
        
        this.inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
        
        this.inputField?.addEventListener('input', () => {
            this.clearInactivityTimers();
            this.setInactivityTimers();
        });
    }

    /**
     * Configura el chat proactivo
     */
    setupProactiveChat() {
        this.proactiveChatTimer = setTimeout(() => {
            if (!this.widget?.classList.contains('visible')) {
                this.toggle();
            }
        }, CHATBOT_CONFIG.proactiveTimeout);
    }

    /**
     * Alterna la visibilidad del widget
     */
    toggle() {
        // Iniciar audio context
        this.startAudioContext();
        
        this.widget?.classList.toggle('visible');
        if (this.bubble) {
            this.bubble.style.display = this.widget?.classList.contains('visible') ? 'none' : 'flex';
        }
        
        clearTimeout(this.proactiveChatTimer);
        
        if (this.widget?.classList.contains('visible') && !this.chatInitiated) {
            this.initiateChat();
        }
    }

    /**
     * Minimiza el widget
     */
    minimize() {
        this.chatMinimized = !this.chatMinimized;
        
        if (this.chatMinimized) {
            this.widget?.classList.remove('visible');
            if (this.bubble) this.bubble.style.display = 'flex';
        } else {
            this.widget?.classList.add('visible');
            if (this.bubble) this.bubble.style.display = 'none';
        }
    }

    /**
     * Cierra el widget
     */
    close() {
        this.widget?.classList.remove('visible');
        if (this.bubble) this.bubble.style.display = 'flex';
        this.chatMinimized = false;
    }

    /**
     * Inicia el contexto de audio
     */
    startAudioContext() {
        try {
            if (typeof Tone !== 'undefined' && Tone?.context?.state === 'suspended') {
                Tone.start?.();
            }
        } catch (e) {
            console.warn('Could not start audio context:', e);
        }
    }

    /**
     * Inicia una nueva conversación
     */
    initiateChat() {
        document.getElementById('connecting-loader')?.remove();
        
        this.chatInitiated = true;
        this.conversationEnded = false;
        this.isWaitingForName = true;
        this.customerName = null;
        
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
        }
        
        // Seleccionar agente aleatorio
        this.currentAgentName = getRandomExcluding(CHATBOT_CONFIG.agentNames, this.currentAgentName);
        if (this.agentNameEl) {
            this.agentNameEl.textContent = `Hablando con ${this.currentAgentName}`;
        }
        
        // Mensaje de bienvenida
        const welcomeMessage = this.getWelcomeMessage();
        this.addMessage(welcomeMessage, 'bot');
        this.chatHistory = [{ role: 'model', parts: [{ text: welcomeMessage }] }];
        
        this.setInactivityTimers();
    }

    /**
     * Genera el mensaje de bienvenida
     * @returns {string} HTML del mensaje de bienvenida
     */
    getWelcomeMessage() {
        return `<div class="welcome-message">
            <p class="greeting">🐰 <strong>¡Hola!</strong> Soy <strong>${this.currentAgentName}</strong>, tu agente comercial para esta sesión.</p>
            <p>Estoy aquí para ayudarte con:</p>
            <ul class="topics-list markdown-list">
                <li>🐇 Información sobre nuestras <strong>razas de conejos</strong></li>
                <li>🥕 <strong>Alimentos y productos</strong> para tu mascota</li>
                <li>💉 Servicios de <strong>desparasitación y salud</strong></li>
                <li>📋 <strong>Asesoría personalizada</strong> para tu compra</li>
            </ul>
            <p>Para darte una atención más personalizada, <strong>¿con quién tengo el gusto?</strong></p>
        </div>`;
    }

    /**
     * Añade un mensaje al chat
     * @param {string} text - Contenido del mensaje
     * @param {string} sender - 'user' o 'bot'
     * @param {boolean} isLoading - Si es indicador de carga
     * @param {boolean} playSound - Si reproducir sonido
     */
    addMessage(text, sender, isLoading = false, playSound = true) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', sender);
        
        if (isLoading) {
            messageEl.id = 'loading-indicator';
            messageEl.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        } else {
            const parsedText = sender === 'bot' ? parseMarkdown(text) : text;
            messageEl.innerHTML = parsedText;
        }
        
        this.messagesContainer?.appendChild(messageEl);
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
        
        if (sender === 'bot' && !isLoading && playSound) {
            this.playNotificationSound();
            this.showNewMessageIndicator();
        }
    }

    /**
     * Reproduce sonido de notificación
     */
    playNotificationSound() {
        try {
            if (this.synth) {
                Tone.start();
                this.synth.triggerAttackRelease("G5", "16n");
            }
            if ('vibrate' in navigator) {
                navigator.vibrate(100);
            }
        } catch (e) {
            console.log("Could not play sound or vibrate.", e);
        }
    }

    /**
     * Muestra indicador de nuevo mensaje
     */
    showNewMessageIndicator() {
        if (!this.widget?.classList.contains('visible') && this.bubble) {
            this.bubble.classList.add('new-message');
            setTimeout(() => this.bubble.classList.remove('new-message'), 820);
        }
    }

    /**
     * Maneja el mensaje del usuario
     */
    async handleUserMessage() {
        if (this.conversationEnded) return;
        
        this.clearInactivityTimers();
        
        const userText = this.inputField?.value.trim();
        if (!userText) return;
        
        this.addMessage(userText, 'user');
        if (this.inputField) this.inputField.value = '';
        
        if (this.isWaitingForName) {
            await this.handleNameValidation(userText);
        } else {
            await this.handleRegularMessage(userText);
        }
    }

    /**
     * Valida el nombre del usuario
     * @param {string} userText - Texto ingresado
     */
    async handleNameValidation(userText) {
        this.addMessage('', 'bot', true);
        
        const validationPrompt = `Analiza la siguiente respuesta a la pregunta "¿Con quién tengo el gusto?": "${userText}". Determina si es un nombre de persona plausible y respetuoso. Considera el "albur" y doble sentido del español de México. Responde únicamente con "VALID" si es un nombre apropiado, o "INVALID" si es una broma, albur, o claramente no es un nombre.`;
        
        try {
            const validationHistory = [...this.chatHistory, { role: 'user', parts: [{ text: userText }] }];
            const validationResult = await this.callGemini(validationPrompt, validationHistory);
            
            document.getElementById('loading-indicator')?.remove();
            
            if (validationResult?.trim().toUpperCase() === 'VALID') {
                this.customerName = userText;
                this.isWaitingForName = false;
                const greeting = `¡Mucho gusto, ${this.customerName}! Ahora sí, ¿en qué puedo ayudarte hoy en GCMiRinconcito?`;
                this.addMessage(greeting, 'bot');
                this.chatHistory.push({ role: 'user', parts: [{ text: `Mi nombre es ${userText}` }] });
                this.chatHistory.push({ role: 'model', parts: [{ text: greeting }] });
            } else {
                const jokePrompt = `Eres ${this.currentAgentName}, un agente de chat profesional y con chispa. Un cliente ha respondido "${userText}" cuando le preguntaste su nombre, lo cual es inapropiado o es una broma (albur). Genera una respuesta corta, firme pero educada, pidiendo una comunicación respetuosa para poder continuar y pidiendo de nuevo el nombre.`;
                const response = await this.callGemini(jokePrompt, []);
                this.addMessage(response, 'bot');
                this.chatHistory.push({ role: 'model', parts: [{ text: response }] });
            }
        } catch (error) {
            console.error("Error during name validation:", error);
            document.getElementById('loading-indicator')?.remove();
            this.addMessage('Hubo un problema verificando la información. Vamos a continuar. ¿En qué puedo ayudarte?', 'bot');
            this.isWaitingForName = false;
        }
        
        this.setInactivityTimers();
    }

    /**
     * Maneja mensajes regulares
     * @param {string} userText - Texto del usuario
     */
    async handleRegularMessage(userText) {
        this.addMessage('', 'bot', true);
        this.chatHistory.push({ role: 'user', parts: [{ text: userText }] });
        
        try {
            const systemPrompt = this.getSystemPrompt();
            const botText = await this.callGemini(systemPrompt, this.chatHistory);
            
            document.getElementById('loading-indicator')?.remove();
            
            await this.processResponse(botText);
            this.chatHistory.push({ role: 'model', parts: [{ text: botText }] });
        } catch (error) {
            console.error('Error con Gemini API:', error);
            document.getElementById('loading-indicator')?.remove();
            this.addMessage('Lo siento, tengo problemas de conexión. Por favor, intenta de nuevo más tarde.', 'bot');
        }
        
        this.setInactivityTimers();
    }

    /**
     * Genera el prompt del sistema
     * @returns {string} Prompt del sistema
     */
    getSystemPrompt() {
        return `Eres ${this.currentAgentName}, un agente comercial experto que representa a "Granja Cunícola Mi Rinconcito". Tu misión es brindar atención al cliente personalizada, profesional y cordial. Siempre te diriges al cliente por su nombre (${this.customerName}), usando un tono amigable, conciso y confiable.
- Usa comillas ("") para resaltar palabras o ideas importantes.
- NO escribas párrafos largos. Mantén un estilo natural, breve y con frases claras.
- JAMÁS uses lenguaje negativo o dudoso.
- Muestra empatía y entusiasmo sin parecer forzado.
- Si confirmas que la duda principal fue resuelta, cierra con una pregunta amable como: "¿Puedo ayudarte en algo más, ${this.customerName}?" o "¿Hay algo más que te gustaría saber?".
- Si el cliente dice que no tiene más dudas o desea terminar (por ejemplo: "eso es todo", "gracias, ya no"), responde ÚNICAMENTE: "FINALIZAR_SESION".
- Tu conocimiento está ESTRICTAMENTE limitado a las razas (Nueva Zelanda, Californiano, Chinchilla, Mariposa, Belier Francés, Enano Holandés, Cabeza de León) y servicios (venta de alimento, heno, desparasitación, chequeo general). Siempre aclara que la disponibilidad puede variar por temporada.
- Cuando debas listar razas o servicios, usa listas HTML para mayor claridad.
- Si detectas intención de compra, responde con: COMPRA_INTENT:[RESUMEN]
- Si un cliente expresa enojo o pide hablar con un gerente, responde ÚNICAMENTE: "INICIAR_QUEJA".`;
    }

    /**
     * Procesa la respuesta del bot
     * @param {string} botText - Respuesta del bot
     */
    async processResponse(botText) {
        if (botText.startsWith('COMPRA_INTENT:')) {
            const parts = botText.split('\n');
            const summary = parts[0].replace('COMPRA_INTENT:', '').trim();
            const handoffMessage = parts.slice(1).join('\n');
            
            this.addMessage(handoffMessage, 'bot');
            
            const whatsappLink = getWhatsAppLink(
                WHATSAPP_CONFIG.messages.chatHandoff(this.currentAgentName, this.customerName, summary)
            );
            
            const handoffButton = document.createElement('div');
            handoffButton.classList.add('message', 'bot');
            handoffButton.innerHTML = `<a href="${whatsappLink}" target="_blank" class="whatsapp-handoff"><i class="fab fa-whatsapp mr-2"></i> Finalizar en WhatsApp</a>`;
            this.messagesContainer?.appendChild(handoffButton);
            
            setTimeout(() => {
                if (!this.conversationEnded) this.showRatingSystem();
            }, 4000);
            
        } else if (botText.trim() === 'FINALIZAR_SESION') {
            this.addMessage(`Perfecto, ${this.customerName}. Ha sido un placer. Puedes calificar mi servicio a continuación.`, 'bot');
            this.showRatingSystem();
            
        } else if (botText.trim() === 'INICIAR_QUEJA') {
            const messages = [
                `Lamento mucho que tu experiencia no haya sido la ideal, ${this.customerName}. Tu opinión es muy importante. Por favor, completa el siguiente formulario para que un gerente revise tu caso.`,
                `Entiendo tu frustración, ${this.customerName}. Permíteme ayudarte. Puedes registrar tu caso en el siguiente formulario para atención directa de gerencia.`
            ];
            
            this.addMessage(messages[Math.floor(Math.random() * messages.length)], 'bot', false, false);
            
            const formLink = document.createElement('div');
            formLink.classList.add('message', 'bot');
            formLink.innerHTML = `<a href="https://forms.gle/YYwdiPqcGQZUSMug7" target="_blank" class="complaint-link"><i class="fas fa-file-signature mr-2"></i> Abrir Formulario</a>`;
            this.messagesContainer?.appendChild(formLink);
            
            this.addMessage('Al finalizarlo, tu caso será escalado. ¿Hay algo más en lo que pueda asistirte mientras tanto?', 'bot');
            
        } else {
            this.addMessage(botText.replace(/"/g, '"').replace(/"/g, '"'), 'bot');
        }
    }

    /**
     * Llama a la API de Gemini
     * @param {string} systemPrompt - Prompt del sistema
     * @param {Array} history - Historial de conversación
     * @returns {Promise<string>} Respuesta del modelo
     */
    async callGemini(systemPrompt, history) {
        const maxAttempts = 2;
        let attempt = 0;
        
        while (true) {
            try {
                attempt++;
                const userMessage = history?.length 
                    ? history[history.length - 1].parts?.map(p => p.text).join(' ') 
                    : '';
                
                const resp = await fetch('/.netlify/functions/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userMessage, context: systemPrompt })
                });
                
                if (!resp.ok) {
                    const text = await resp.text().catch(() => 'no body');
                    console.error('Proxy function error', resp.status, text);
                    throw new Error('Proxy function error');
                }
                
                const raw = await resp.text();
                const data = raw ? JSON.parse(raw) : null;
                
                if (!data || typeof data.reply !== 'string') {
                    throw new Error('Invalid proxy response');
                }
                
                return data.reply;
                
            } catch (error) {
                const isChannelClosed = error?.message?.includes('message channel closed');
                console.error(`callGemini attempt ${attempt} failed:`, error);
                
                if (isChannelClosed && attempt < maxAttempts) {
                    await new Promise(r => setTimeout(r, 350));
                    continue;
                }
                
                throw new Error('callGemini failed: ' + (error?.message || String(error)));
            }
        }
    }

    /**
     * Muestra el sistema de calificación
     */
    showRatingSystem() {
        this.conversationEnded = true;
        this.clearInactivityTimers();
        
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';
        ratingContainer.innerHTML = `
            <h4>¿Cómo calificarías mi atención?</h4>
            <div class="stars">
                ${[1,2,3,4,5].map(r => 
                    `<span class="star" data-rating="${r}"><i class="fas fa-star"></i></span>`
                ).join('')}
            </div>
            <button class="feedback-btn">Enviar calificación</button>
        `;
        
        this.messagesContainer?.appendChild(ratingContainer);
        
        // Configurar estrellas
        const stars = ratingContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                stars.forEach(s => s.classList.toggle('active', s.dataset.rating <= rating));
            });
        });
        
        // Configurar botón de envío
        ratingContainer.querySelector('.feedback-btn')?.addEventListener('click', () => {
            const activeStars = ratingContainer.querySelectorAll('.star.active').length;
            if (activeStars > 0) {
                const feedbackMessage = document.createElement('div');
                feedbackMessage.className = 'feedback-message feedback-success';
                feedbackMessage.textContent = `¡Gracias por tu calificación de ${activeStars} estrella${activeStars > 1 ? 's' : ''}!`;
                this.messagesContainer?.appendChild(feedbackMessage);
                ratingContainer.remove();
                this.showReconnectOption();
            }
        });
        
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    /**
     * Muestra opción de reconexión
     */
    showReconnectOption() {
        const reconnectContainer = document.createElement('div');
        reconnectContainer.className = 'text-center p-5';
        reconnectContainer.id = 'reconnect-container';
        reconnectContainer.innerHTML = `
            <button id="reconnect-btn" class="reconnect-btn">
                <i class="fas fa-sync-alt mr-2"></i>Conectar con otro agente
            </button>
        `;
        
        this.messagesContainer?.appendChild(reconnectContainer);
        
        document.getElementById('reconnect-btn')?.addEventListener('click', () => {
            document.getElementById('reconnect-container')?.remove();
            
            const loader = document.createElement('div');
            loader.id = 'connecting-loader';
            loader.className = 'loader-container';
            loader.innerHTML = `<div class="spinner"></div><p>Buscando un agente disponible...</p>`;
            this.messagesContainer?.appendChild(loader);
            
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
            
            const { min, max } = CHATBOT_CONFIG.reconnectDelay;
            const randomDelay = Math.random() * (max - min) + min;
            
            setTimeout(() => {
                this.chatInitiated = false;
                this.initiateChat();
            }, randomDelay);
        });
        
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    /**
     * Limpia los timers de inactividad
     */
    clearInactivityTimers() {
        clearTimeout(this.inactivityTimer);
        clearTimeout(this.closeChatTimer);
    }

    /**
     * Configura los timers de inactividad
     */
    setInactivityTimers() {
        this.clearInactivityTimers();
        if (this.conversationEnded) return;
        
        this.inactivityTimer = setTimeout(() => {
            this.addMessage(this.getInactivityMessage(), 'bot');
            
            this.closeChatTimer = setTimeout(() => {
                this.addMessage("Parece que no hay nadie. He cerrado esta sesión por inactividad. Si quieres continuar, puedes iniciar un nuevo chat.", 'bot');
                this.conversationEnded = true;
                this.showReconnectOption();
            }, CHATBOT_CONFIG.closeTimeout);
            
        }, CHATBOT_CONFIG.inactivityTimeout);
    }

    /**
     * Obtiene un mensaje de inactividad aleatorio
     * @returns {string} Mensaje de inactividad
     */
    getInactivityMessage() {
        const messages = [
            "¿Sigues ahí? ¿Puedo ayudarte en algo más?",
            "Hola de nuevo, solo quería saber si todavía necesitas ayuda.",
            `¿Hay algo más en lo que pueda asistirte, ${this.customerName || ''}?`,
            "Me quedé esperando tu respuesta, ¿necesitas más información?"
        ];
        
        let available = messages.filter(m => !this.usedInactivityMessages.has(m));
        if (available.length === 0) {
            this.usedInactivityMessages.clear();
            available = messages;
        }
        
        const message = available[Math.floor(Math.random() * available.length)];
        this.usedInactivityMessages.add(message);
        return message;
    }
}

export default ChatbotManager;
