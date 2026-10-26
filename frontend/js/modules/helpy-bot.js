import { helpyResponses, helpyFallbacks, HELPY_AVATAR } from '../data/helpy-responses.js';

export function initHelpyBot() {
    const helpyBotButton = document.getElementById('helpyBotButton');
    const helpyChatWindow = document.getElementById('helpyChatWindow');
    const helpyChatClose = document.getElementById('helpyChatClose');
    const helpyChatMessages = document.getElementById('helpyChatMessages');
    const helpyInput = document.getElementById('helpyInput');
    const helpySendBtn = document.getElementById('helpySendBtn');
    const helpyQuickReplies = document.getElementById('helpyQuickReplies');

    if (!helpyBotButton || !helpyChatWindow) return;

    // Abrir/fechar chat
    helpyBotButton.addEventListener('click', () => {
        helpyChatWindow.classList.toggle('open');
        if (helpyChatWindow.classList.contains('open')) {
            setTimeout(() => helpyInput.focus(), 300);
        }
    });

    helpyChatClose.addEventListener('click', () => {
        helpyChatWindow.classList.remove('open');
    });

    // Adicionar mensagem ao chat
    function addHelpyMessage(text, sender = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `helpy-message ${sender}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'helpy-message-avatar';

        if (sender === 'bot') {
            avatarDiv.innerHTML = `<img src="${HELPY_AVATAR}" alt="Helpy">`;
        } else {
            avatarDiv.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>
                </svg>
            `;
        }

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'helpy-message-bubble';
        bubbleDiv.innerHTML = text;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        helpyChatMessages.appendChild(messageDiv);
        helpyChatMessages.scrollTop = helpyChatMessages.scrollHeight;
    }

    // Indicador de digitação
    function showHelpyTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'helpy-message bot';
        typingDiv.id = 'helpyTypingIndicator';
        typingDiv.innerHTML = `
            <div class="helpy-message-avatar">
                <img src="${HELPY_AVATAR}" alt="Helpy">
            </div>
            <div class="helpy-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        helpyChatMessages.appendChild(typingDiv);
        helpyChatMessages.scrollTop = helpyChatMessages.scrollHeight;
    }

    function removeHelpyTyping() {
        const indicator = document.getElementById('helpyTypingIndicator');
        if (indicator) indicator.remove();
    }

    // Processar pergunta do usuário
    function processHelpyQuestion(question) {
        const normalized = question.toLowerCase().trim().replace(/[?!.,]/g, '');

        let response = null;
        for (const key in helpyResponses) {
            if (normalized.includes(key) || key.includes(normalized)) {
                response = helpyResponses[key];
                break;
            }
        }

        if (!response) {
            response = helpyFallbacks[Math.floor(Math.random() * helpyFallbacks.length)];
        }

        showHelpyTyping();
        setTimeout(() => {
            removeHelpyTyping();
            addHelpyMessage(response, 'bot');
        }, 1000 + Math.random() * 800);
    }

    // Enviar mensagem
    function sendHelpyMessage() {
        const text = helpyInput.value.trim();
        if (!text) return;

        addHelpyMessage(text, 'user');
        helpyInput.value = '';
        helpyInput.focus();

        if (helpyQuickReplies) {
            helpyQuickReplies.style.display = 'none';
        }

        processHelpyQuestion(text);
    }

    helpySendBtn.addEventListener('click', sendHelpyMessage);
    helpyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendHelpyMessage();
    });

    // Quick replies
    document.querySelectorAll('.helpy-quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            addHelpyMessage(question, 'user');
            if (helpyQuickReplies) {
                helpyQuickReplies.style.display = 'none';
            }
            processHelpyQuestion(question);
        });
    });
}