// Funciones principales de RTL
import { render, screen } from '@testing-library/react';

// userEvent para simular acciones reales del usuario
import userEvent from '@testing-library/user-event';

// Componente que vamos a probar
import LoginForm from '../../src/components/LoginForm';

// Antes de cada test, reemplazamos fetch por un mock
beforeEach(() => { global.fetch = jest.fn(); });

// Después de cada test, limpiamos los mocks
afterEach(() => { jest.resetAllMocks(); });

describe('LoginForm (integración + mock de red)', () => {

  it('muestra éxito cuando API responde 200', async () => {
    // Simulamos que la API responde bien con un usuario "Ada"
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Ada' }),
    });

    const user = userEvent.setup();

    // Renderizamos el formulario
    render(<LoginForm />);

    // Escribimos un email en el input
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

    // Hacemos clic en el botón de enviar
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // findByText espera hasta que el mensaje aparezca (asíncrono)
    expect(await screen.findByText(/bienvenido ada/i)).toBeInTheDocument();
  });


  it('muestra error cuando la API falla', async () => {
    // Mock: la API responde mal (ok=false)
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const user = userEvent.setup();
    render(<LoginForm />);

    // Escribimos el email
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

    // Clic en enviar
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Esperamos mensaje de error
    expect(await screen.findByText(/error de red/i)).toBeInTheDocument();
  });

});