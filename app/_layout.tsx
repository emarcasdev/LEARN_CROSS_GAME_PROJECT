import { Stack } from 'expo-router';
import { AppThemeProvider } from '@/hooks/useTheme';
import { useEffect } from 'react';
import { startDB } from '../db/db';
import "../assets/i18n"

export default function RootLayout() {
  // Inicializar la base de datos
  useEffect(() => {
    startDB();
  }, []);

  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppThemeProvider>
  );
}
