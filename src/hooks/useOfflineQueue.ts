import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { analyticsService } from '@/services/analyticsService';

interface QueuedAction {
  id: string;
  type: 'CREATE_SPOT' | 'UPDATE_PROFILE' | 'UPLOAD_IMAGE';
  data: any;
  timestamp: number;
  retryCount: number;
}

const QUEUE_KEY = '@offline_queue';
const MAX_RETRIES = 3;

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadQueue();
    
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      
      if (online && queue.length > 0) {
        processQueue();
      }
    });

    return unsubscribe;
  }, []);

  const loadQueue = async () => {
    try {
      const storedQueue = await AsyncStorage.getItem(QUEUE_KEY);
      if (storedQueue) {
        setQueue(JSON.parse(storedQueue));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  };

  const saveQueue = async (newQueue: QueuedAction[]) => {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      setQueue(newQueue);
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  };

  const addToQueue = async (type: QueuedAction['type'], data: any) => {
    const action: QueuedAction = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const newQueue = [...queue, action];
    await saveQueue(newQueue);
    
    analyticsService.trackEvent('offline_action_queued', {
      type,
      queueSize: newQueue.length,
    });

    // Try to process immediately if online
    if (isOnline) {
      processQueue();
    }
  };

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    
    setIsProcessing(true);
    const updatedQueue = [...queue];

    for (let i = updatedQueue.length - 1; i >= 0; i--) {
      const action = updatedQueue[i];
      
      try {
        await processAction(action);
        
        // Remove successful action
        updatedQueue.splice(i, 1);
        
        analyticsService.trackEvent('offline_action_processed', {
          type: action.type,
          retryCount: action.retryCount,
        });
        
      } catch (error) {
        console.error('Failed to process queued action:', error);
        
        // Increment retry count
        action.retryCount += 1;
        
        // Remove if max retries reached
        if (action.retryCount >= MAX_RETRIES) {
          updatedQueue.splice(i, 1);
          
          analyticsService.trackEvent('offline_action_failed', {
            type: action.type,
            retryCount: action.retryCount,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    await saveQueue(updatedQueue);
    setIsProcessing(false);
  };

  const processAction = async (action: QueuedAction) => {
    switch (action.type) {
      case 'CREATE_SPOT':
        // This would call the actual API
        // await mushroomService.createSpot(action.data);
        break;
      case 'UPDATE_PROFILE':
        // await userService.updateProfile(action.data);
        break;
      case 'UPLOAD_IMAGE':
        // await uploadService.uploadImage(action.data);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  const clearQueue = async () => {
    await saveQueue([]);
  };

  return {
    queue,
    isProcessing,
    isOnline,
    queueSize: queue.length,
    addToQueue,
    processQueue,
    clearQueue,
  };
}