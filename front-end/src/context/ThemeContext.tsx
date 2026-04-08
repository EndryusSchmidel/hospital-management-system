import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Inicializa o estado verificando o LocalStorage ou a preferência do Sistema Operacional
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('hms-theme') as Theme;
        if (savedTheme) return savedTheme;

        // Detecta preferência do Windows/macOS/Linux
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // 2. Toda vez que o tema mudar, atualizamos o HTML e o LocalStorage
    useEffect(() => {
        const root = window.document.documentElement; // Pega a tag <html>

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('hms-theme', theme);
    }, [theme]);

    // 3. Listener para detectar se o usuário mudar o tema no Windows enquanto o app está aberto
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('hms-theme')) { // Só muda se o usuário não escolheu manualmente
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook customizado para facilitar o uso
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
    return context;
};