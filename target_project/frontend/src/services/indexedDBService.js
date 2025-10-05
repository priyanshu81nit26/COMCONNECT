const DB_NAME = 'comconnect-db';
const DB_VERSION = 1;
const STORES = {
  LOCATIONS: 'locations'
};

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('Successfully opened IndexedDB');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create locations store
        if (!db.objectStoreNames.contains(STORES.LOCATIONS)) {
          const locationStore = db.createObjectStore(STORES.LOCATIONS, { keyPath: 'timestamp' });
          locationStore.createIndex('userId', 'userId', { unique: false });
          locationStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  async storeLocation(location) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.LOCATIONS, 'readwrite');
      const store = tx.objectStore(STORES.LOCATIONS);

      const locationData = {
        ...location,
        synced: false,
        timestamp: Date.now()
      };

      await store.add(locationData);
      console.log('Location stored successfully:', locationData);
      return locationData;
    } catch (error) {
      console.error('Error storing location:', error);
      throw error;
    }
  }

  async getUnsynedLocations() {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.LOCATIONS, 'readonly');
      const store = tx.objectStore(STORES.LOCATIONS);
      const index = store.index('synced');
      
      return await index.getAll(false);
    } catch (error) {
      console.error('Error getting unsynced locations:', error);
      return [];
    }
  }

  async markLocationsAsSynced(timestamps) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.LOCATIONS, 'readwrite');
      const store = tx.objectStore(STORES.LOCATIONS);

      for (const timestamp of timestamps) {
        const location = await store.get(timestamp);
        if (location) {
          location.synced = true;
          await store.put(location);
        }
      }
    } catch (error) {
      console.error('Error marking locations as synced:', error);
    }
  }

  async getDB() {
    if (this.db) return this.db;
    return await this.initDB();
  }

  async clearOldLocations(daysToKeep = 1) { // Reduced to 1 day for location data
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.LOCATIONS, 'readwrite');
      const store = tx.objectStore(STORES.LOCATIONS);
      
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      await store.delete(range);
      console.log(`Cleared locations older than ${daysToKeep} day`);
    } catch (error) {
      console.error('Error clearing old locations:', error);
    }
  }
}

export const indexedDBService = new IndexedDBService(); 