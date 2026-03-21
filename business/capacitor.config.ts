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
  },
  server: {
    iosScheme: 'https',
  },
}

export default config
