import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            // Animação de escala (hover:scale-110) e cores suaves
            className="relative flex items-center justify-center p-2 rounded-full 
                    bg-slate-200 dark:bg-slate-800 
                    text-amber-500 dark:text-blue-400
                    hover:ring-2 hover:ring-blue-400 transition-all duration-300 shadow-md"
            title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
            {theme === 'light' ? (
                <Moon size={20} fill="currentColor" />
            ) : (
                <Sun size={20} fill="currentColor" />
            )}

            {/* Um pequeno detalhe visual: anel de brilho suave no dark mode */}
            <span className="sr-only">Alternar Tema</span>
        </button>
    );
};