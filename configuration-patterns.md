# Website Configuration Management Patterns

## Table of Contents
- [Overview](#overview)
- [1. Single Active Configuration Pattern](#1-single-active-configuration-pattern)
- [2. Cached Multi-Configuration Pattern](#2-cached-multi-configuration-pattern)
- [3. Micro-Frontend Architecture](#3-micro-frontend-architecture)
- [4. Hybrid Approach](#4-hybrid-approach)
- [Pattern Selection Guide](#pattern-selection-guide)
- [Migration Strategies](#migration-strategies)
- [Performance Considerations](#performance-considerations)

## Overview

This document outlines different patterns for managing multiple website configurations in a centralized admin panel. Each pattern has its own strengths and ideal use cases.

## 1. Single Active Configuration Pattern

### Implementation

```typescript
// Base Configuration Manager
export class WebsiteConfigManager {
  private static activeConfig: string | null = null;
  private static configCache: Map<string, any> = new Map();
  
  static async loadConfig(websiteId: string) {
    if (this.activeConfig && this.activeConfig !== websiteId) {
      await this.unloadCurrentConfig();
    }
    
    if (!this.configCache.has(websiteId)) {
      const config = await prisma.website.findUnique({
        where: { id: websiteId },
        include: { modules: true }
      });
      this.configCache.set(websiteId, config);
    }
    
    this.activeConfig = websiteId;
    return this.configCache.get(websiteId);
  }

  static async unloadCurrentConfig() {
    if (this.activeConfig) {
      this.configCache.delete(this.activeConfig);
      this.activeConfig = null;
    }
  }
}

// Context Provider
export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [activeWebsite, setActiveWebsite] = useState<string | null>(null);

  const switchWebsite = useCallback(async (websiteId: string) => {
    await WebsiteConfigManager.loadConfig(websiteId);
    setActiveWebsite(websiteId);
  }, []);

  return (
    <WebsiteContext.Provider value={{ activeWebsite, switchWebsite }}>
      {children}
    </WebsiteContext.Provider>
  );
}
```

### Best For
- Small to medium-sized applications
- Limited server resources
- Simple website configurations
- Clear separation of concerns

### Limitations
- Switching latency
- No state persistence between switches
- Not ideal for frequent switching

## 2. Cached Multi-Configuration Pattern

### Implementation

```typescript
interface CacheConfig {
  maxSize: number;
  ttl: number;
}

class ConfigCache {
  private configs: Map<string, {
    data: any;
    lastAccessed: number;
  }>;
  private maxSize: number;
  private ttl: number;

  constructor(config: CacheConfig) {
    this.configs = new Map();
    this.maxSize = config.maxSize;
    this.ttl = config.ttl;
  }

  async get(websiteId: string) {
    const cached = this.configs.get(websiteId);
    if (cached && Date.now() - cached.lastAccessed < this.ttl) {
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    return null;
  }

  set(websiteId: string, data: any) {
    if (this.configs.size >= this.maxSize) {
      this.evictOldest();
    }
    this.configs.set(websiteId, {
      data,
      lastAccessed: Date.now()
    });
  }

  private evictOldest() {
    let oldest = Date.now();
    let oldestId = null;

    for (const [id, config] of this.configs.entries()) {
      if (config.lastAccessed < oldest) {
        oldest = config.lastAccessed;
        oldestId = id;
      }
    }

    if (oldestId) {
      this.configs.delete(oldestId);
    }
  }
}

export class CachedConfigManager {
  private static cache = new ConfigCache({
    maxSize: 5,
    ttl: 1000 * 60 * 30 // 30 minutes
  });

  static async getConfig(websiteId: string) {
    let config = await this.cache.get(websiteId);
    if (!config) {
      config = await this.loadConfig(websiteId);
      this.cache.set(websiteId, config);
    }
    return config;
  }

  private static async loadConfig(websiteId: string) {
    // Load configuration from database
    return prisma.website.findUnique({
      where: { id: websiteId },
      include: { modules: true }
    });
  }
}
```

### Best For
- Frequent website switching
- Medium to large applications
- Balanced resource usage
- Better user experience

### Limitations
- Higher memory usage
- More complex cache invalidation
- Needs careful memory monitoring

## 3. Micro-Frontend Architecture

### Implementation

```typescript
interface WebsiteModule {
  mount(container: HTMLElement): void;
  unmount(): void;
  updateProps(props: any): void;
}

class ModuleLoader {
  private static modules: Map<string, WebsiteModule> = new Map();
  private static containers: Map<string, HTMLElement> = new Map();

  static async loadModule(websiteId: string, containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error('Container not found');

    // Dynamic import of website module
    const moduleScript = await import(`/websites/${websiteId}/index.js`);
    const module = new moduleScript.default() as WebsiteModule;

    this.modules.set(websiteId, module);
    this.containers.set(websiteId, container);

    module.mount(container);
    return module;
  }

  static unloadModule(websiteId: string) {
    const module = this.modules.get(websiteId);
    if (module) {
      module.unmount();
      this.modules.delete(websiteId);
      this.containers.delete(websiteId);
    }
  }
}

// Example website module
export default class BlogWebsite implements WebsiteModule {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  unmount() {
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  updateProps(props: any) {
    this.render(props);
  }

  private render(props?: any) {
    if (!this.container) return;
    // Render website-specific content
  }
}
```

### Best For
- Large, complex applications
- Independent deployment needs
- Complete isolation requirements
- Enterprise-level scalability

### Limitations
- Complex implementation
- Higher development overhead
- More sophisticated build process

## 4. Hybrid Approach

### Implementation

```typescript
interface ModuleDefinition {
  id: string;
  load: () => Promise<any>;
  dependencies?: string[];
}

class HybridConfigManager {
  private static coreConfig: any = null;
  private static moduleCache = new Map<string, any>();
  private static configCache = new LRUCache<string, any>({ max: 3 });

  static async initialize() {
    this.coreConfig = await this.loadCoreConfig();
  }

  static async getWebsiteConfig(websiteId: string) {
    // Try cache first
    let config = this.configCache.get(websiteId);
    if (!config) {
      // Load basic config
      config = await this.loadBasicConfig(websiteId);
      this.configCache.set(websiteId, config);
      
      // Start preloading modules
      this.preloadModules(websiteId);
    }
    return config;
  }

  static async loadModule(websiteId: string, moduleId: string) {
    const cacheKey = `${websiteId}:${moduleId}`;
    
    if (!this.moduleCache.has(cacheKey)) {
      const module = await import(`/modules/${moduleId}`);
      this.moduleCache.set(cacheKey, module);
    }
    
    return this.moduleCache.get(cacheKey);
  }

  private static async preloadModules(websiteId: string) {
    const config = await this.getWebsiteConfig(websiteId);
    const moduleIds = config.modules.map((m: any) => m.id);
    
    // Preload in background
    Promise.all(
      moduleIds.map(id => this.loadModule(websiteId, id))
    ).catch(console.error);
  }
}
```

### Best For
- Dynamic requirements
- Progressive enhancement
- Balance of performance and resources
- Flexible scaling needs

### Limitations
- Complex initial setup
- Requires careful optimization
- Needs good monitoring

## Pattern Selection Guide

Choose based on your requirements:

1. **Single Active Configuration**
   - Limited resources
   - Simple website structures
   - Clear separation needed
   - Memory optimization priority

2. **Cached Multi-Configuration**
   - Frequent switching needed
   - Moderate resource availability
   - User experience priority
   - Acceptable memory usage

3. **Micro-Frontend**
   - Complex applications
   - Independent deployments
   - Strong isolation needed
   - Scalability priority

4. **Hybrid Approach**
   - Mixed requirements
   - Progressive enhancement
   - Future scalability
   - Resource optimization

## Migration Strategies

### From Single Active to Cached Multi-Configuration

1. Implement cache layer
```typescript
class MigrationManager {
  static async migrateToCache() {
    const currentConfig = WebsiteConfigManager.getActiveConfig();
    if (currentConfig) {
      await CachedConfigManager.getConfig(currentConfig.id);
    }
  }
}
```

### From Any Pattern to Micro-Frontend

1. Create module boundaries
2. Implement module interface
3. Update build process
4. Gradually migrate features

### To Hybrid Approach

1. Identify core features
2. Implement caching strategy
3. Add lazy loading
4. Migrate modules progressively

## Performance Considerations

### Monitoring

```typescript
class PerformanceMonitor {
  static metrics = {
    configLoadTime: new Map<string, number>(),
    memoryUsage: new Map<string, number>(),
    switchingLatency: new Map<string, number>()
  };

  static trackConfigLoad(websiteId: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metrics.configLoadTime.set(websiteId, duration);
    };
  }
}
```

### Optimization Strategies

1. Implement preloading
2. Use lazy loading
3. Cache effectively
4. Monitor memory usage
5. Optimize bundle sizes

Would you like me to expand on any of these sections or provide more implementation details?
