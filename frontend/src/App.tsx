import { ConfigProvider, theme } from 'antd';
import { useTheme } from './context/ThemeContext';
import { AppRouter } from './router';

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
        token: {
          // Primary colors
          colorPrimary: isDark ? '#63BDFD' : '#3DA8F5',
          colorPrimaryHover: isDark ? '#7FC9FD' : '#1F95E8',
          
          // Background colors
          colorBgBase: isDark ? '#12171D' : '#F3F7FB',
          colorBgContainer: isDark ? '#1C222B' : '#FFFFFF',
          colorBgElevated: isDark ? '#1C222B' : '#FFFFFF',
          
          // Text colors
          colorText: isDark ? '#E7EDF2' : '#1E2933',
          colorTextSecondary: isDark ? '#8B98A5' : '#6B7A89',
          
          // Border colors
          colorBorder: isDark ? '#2D3642' : '#D9DFE6',
          colorBorderSecondary: isDark ? '#252C37' : '#E8ECF0',
          
          // Success, Warning, Error, Info
          colorSuccess: isDark ? '#73D13D' : '#52C41A',
          colorWarning: isDark ? '#FFC53D' : '#FAAD14',
          colorError: isDark ? '#FF4D4F' : '#F5222D',
          colorInfo: isDark ? '#40A9FF' : '#1890FF',
          
          // Typography
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 14,
          
          // Border radius
          borderRadius: 8,
          
          // Shadows
          boxShadow: isDark 
            ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
