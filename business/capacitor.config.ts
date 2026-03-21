import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ipbusiness.app',
  appName: 'IPB',
  webDir: 'out',
  backgroundColor: '#060608',
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#060608',
    scrollEnabled: true,
  },
  server: {
    url: 'http://192.168.18.9:3005',
    cleartext: true,
  },
}

export default config
