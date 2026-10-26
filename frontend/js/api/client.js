/**
 * Cliente HTTP para comunicação com o backend.
 *
 * Enquanto o backend não existir, defina USE_MOCK = true
 * para consumir respostas simuladas da pasta ./mock/.
 *
 * Quando o backend estiver pronto, basta mudar USE_MOCK = false
 * e apontar API_BASE_URL para o servidor correto.
 */

const USE_MOCK = true;
const API_BASE_URL = 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    if (USE_MOCK) {
        return mockRequest(endpoint, options);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Mock temporário — remove quando o backend estiver integrado.
 */
async function mockRequest(endpoint, options) {
    console.warn(`[MOCK] Chamada simulada: ${endpoint}`, options);

    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 400));

    // Retorna dados fake baseados no endpoint
    if (endpoint.includes('/api/tickets')) {
        return {
            id: 'tkt_mock_001',
            status: 'open',
            created_at: new Date().toISOString(),
        };
    }

    if (endpoint.includes('/api/auth')) {
        return { token: 'mock_token', user: { id: 1, name: 'Usuário Mock' } };
    }

    if (endpoint.includes('/api/ai')) {
        return {
            suggestions: [
                'Verificar status da conta no AD',
                'Considerar redefinição de senha',
            ],
            priority: 'medium',
        };
    }

    return { error: 'Endpoint não mockado' };
}