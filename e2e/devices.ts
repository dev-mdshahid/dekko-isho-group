import { devices, type Project } from '@playwright/test'

/**
 * Screens the layout suite runs on. Phones and tablets run in portrait and landscape, on the engine the real device
 * uses (WebKit for iPhone/iPad, Chromium for Android). Widths straddle the site's breakpoints:
 * 479 / 767 / 991 / 1199 / 1355 (mobile menu) / 1920.
 */
type Device = (typeof devices)[string]

const ipadPro129: Device = {
  userAgent: devices['iPad Pro 11'].userAgent,
  viewport: { width: 1024, height: 1366 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  defaultBrowserType: 'webkit',
}

const handheld: Array<[name: string, device: Device]> = [
  ['iPhone SE', devices['iPhone SE']], // 320 wide: smallest supported phone
  ['Galaxy S24', devices['Galaxy S24']], // 360: most common Android width
  ['iPhone 15', devices['iPhone 15']], // 393
  ['iPhone 16 Pro Max', devices['iPhone 16 Pro Max']], // 440
  ['Galaxy Tab S4', devices['Galaxy Tab S4']], // 712
  ['iPad Mini', devices['iPad Mini']], // 768
  ['iPad Pro 11', devices['iPad Pro 11']], // 834
  ['iPad Pro 12.9', ipadPro129], // 1024 portrait, 1366 landscape crosses the mobile-menu breakpoint
]

const desktops: Array<[name: string, width: number, height: number]> = [
  ['Laptop 1280', 1280, 800],
  ['Laptop 1366', 1366, 768],
  ['Desktop 1440', 1440, 900],
  ['Desktop 1920', 1920, 1080],
  ['Desktop 2560', 2560, 1440],
]

function landscape(d: Device): Device {
  return { ...d, viewport: { width: d.viewport.height, height: d.viewport.width } }
}

export type Orientation = 'portrait' | 'landscape'
export type LayoutMetadata = { orientation: Orientation; kind: 'phone' | 'tablet' | 'desktop' }

export function layoutProjects(base: Partial<Project>): Project[] {
  const projects: Project[] = []
  for (const [i, [name, device]] of handheld.entries()) {
    const kind = i < 4 ? 'phone' : 'tablet'
    const { defaultBrowserType, ...use } = device
    for (const orientation of ['portrait', 'landscape'] as const) {
      const metadata: LayoutMetadata = { orientation, kind }
      projects.push({
        ...base,
        name: `${name} ${orientation}`,
        metadata,
        use: { ...(orientation === 'portrait' ? use : landscape(device)), defaultBrowserType: undefined, browserName: defaultBrowserType },
      })
    }
  }
  for (const [name, width, height] of desktops) {
    const metadata: LayoutMetadata = { orientation: 'landscape', kind: 'desktop' }
    projects.push({ ...base, name, metadata, use: { ...devices['Desktop Chrome'], viewport: { width, height } } })
  }
  return projects
}
