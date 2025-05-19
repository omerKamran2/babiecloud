// src/hooks/useWidgetOrder.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WidgetId = 'tasks' | 'moods';

export function useWidgetOrder(uid: string): [WidgetId[], (o: WidgetId[]) => void] {
  const key = `@widgetOrder_${uid}`;
  const [order, setOrderState] = useState<WidgetId[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(key).then(json => {
      if (json) {
        try { setOrderState(JSON.parse(json)); }
        catch {}
      }
    });
  }, [key]);

  const setOrder = (o: WidgetId[]) => {
    setOrderState(o);
    AsyncStorage.setItem(key, JSON.stringify(o));
  };

  return [order, setOrder];
}