import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ipbusiness.app',
  appName: 'IPB',
  webDir: 'out',
  server: {
    // Dev: aponta para o servidor Next.js local
    // Em produção, remova esta linha e use o build estático
    url: 'http://192.168.18.9:3005',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#060608',
  },
}

export default config
