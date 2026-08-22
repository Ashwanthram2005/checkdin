import { useTheme } from '../contexts/ThemeContext';

export interface ChartTheme {
  accent: string;
  accentSoft: string;
  stroke: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  series: string[];
}

const light: ChartTheme = {
  accent: '#CEF03F',
  accentSoft: 'rgba(206, 240, 63, 0.28)',
  stroke: '#8FB40C',
  grid: '#EAE9E2',
  axis: '#6C6F76',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#EAE9E2',
  series: ['#8FB40C', '#2C6AC8', '#16915C', '#BE7A0C', '#C73E37', '#6B5BD2']
};

const dark: ChartTheme = {
  accent: '#CEF03F',
  accentSoft: 'rgba(206, 240, 63, 0.18)',
  stroke: '#CEF03F',
  grid: '#262930',
  axis: '#8F939C',
  tooltipBg: '#1A1D22',
  tooltipBorder: '#262930',
  series: ['#CEF03F', '#609CF6', '#34BE82', '#E2A02E', '#EB6860', '#9A8CF0']
};

export function useChartTheme(): ChartTheme {
  const { theme } = useTheme();
  return theme === 'dark' ? dark : light;
}