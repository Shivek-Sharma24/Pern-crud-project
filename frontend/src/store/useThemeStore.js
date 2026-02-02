import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme:localStorage.getItem("preferred-theme") || 'forest',
    setTheme:(newTheme) => {localStorage.setItem("preferred-theme", newTheme)
     set({theme:newTheme})}
}))