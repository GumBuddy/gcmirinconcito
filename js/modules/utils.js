/**
 * =============================================================================
 * GCMIRINCONCITO - UTILIDADES
 * =============================================================================
 * 
 * Funciones utilitarias reutilizables.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

import { WHATSAPP_CONFIG } from './config.js';

/**
 * Genera un enlace de WhatsApp con el mensaje especificado
 * @param {string} message - Mensaje a enviar
 * @returns {string} URL de WhatsApp
 */
export function getWhatsAppLink(message = '') {
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Parser de Markdown para convertir texto a HTML
 * @param {string} text - Texto con formato Markdown
 * @returns {string} HTML formateado
 */
export function parseMarkdown(text) {
    if (!text) return '';
    
    let html = text;
    
    // Preservar tags HTML existentes que ya vienen formateados
    const htmlTagPattern = /<(\/?)(ul|li|i|a|p|br|strong|em|b|div|span)[^>]*>/gi;
    const hasExistingHtml = htmlTagPattern.test(html);
    
    if (!hasExistingHtml) {
        // Solo aplicar parsing si no tiene HTML existente
        
        // Bloques de código (```código```)
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Código inline (`código`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Encabezados (### H3, ## H2, # H1)
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Negritas (**texto** o __texto__)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Cursivas (*texto* o _texto_) - cuidado de no confundir con negritas
        html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        html = html.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
        
        // Enlaces [texto](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Bloques de cita (> texto)
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Separadores horizontales (--- o ***)
        html = html.replace(/^(---|\*\*\*)$/gm, '<hr>');
        
        // Listas con viñetas (- item o * item)
        html = html.replace(/^[\-\*] (.+)$/gm, '<li class="bullet-item">$1</li>');
        html = html.replace(/(<li class="bullet-item">.*<\/li>\n?)+/g, function(match) {
            return '<ul class="markdown-list">' + match.replace(/\n/g, '') + '</ul>';
        });
        
        // Listas numeradas (1. item)
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="numbered-item">$1</li>');
        html = html.replace(/(<li class="numbered-item">.*<\/li>\n?)+/g, function(match) {
            return '<ol class="markdown-list">' + match.replace(/\n/g, '') + '</ol>';
        });
        
        // Convertir dobles saltos de línea en párrafos
        const paragraphs = html.split(/\n\n+/);
        if (paragraphs.length > 1) {
            html = paragraphs.map(p => {
                p = p.trim();
                // No envolver si ya es un elemento de bloque
                if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || 
                    p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<hr')) {
                    return p;
                }
                return p ? '<p>' + p + '</p>' : '';
            }).join('');
        }
        
        // Convertir saltos de línea simples en <br> dentro de párrafos
        html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');
    }
    
    return html;
}

/**
 * Debounce para optimizar eventos frecuentes
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Obtiene un elemento aleatorio de un array excluyendo el actual
 * @param {Array} array - Array de elementos
 * @param {*} current - Elemento actual a excluir
 * @returns {*} Elemento aleatorio
 */
export function getRandomExcluding(array, current) {
    const available = array.filter(item => item !== current);
    return available[Math.floor(Math.random() * available.length)];
}
