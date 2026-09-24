import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from 'react';
import { ScrapingApiItem, ExecutionRun } from '../types';
import rawApisData from '../data/scrapingApis.json';
import { ApiSearchIndex } from '../utils/searchIndex';

export interface AppState {
  apis: ScrapingApiItem[];
  activeTab: string;
  selectedApi: ScrapingApiItem | null;
  inspectedApi: ScrapingApiItem | null;
  isCommandOpen: boolean;
  lang: 'ar' | 'en';
  apifyToken: string;
  favorites: string[];
  history: ExecutionRun[];
}

export type AppAction =
  | { type: 'SET_LANG'; payload: 'ar' | 'en' }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_SELECTED_API'; payload: ScrapingApiItem | null }
  | { type: 'SET_INSPECTED_API'; payload: ScrapingApiItem | null }
  | { type: 'SET_COMMAND_OPEN'; payload: boolean }
  | { type: 'SET_APIFY_TOKEN'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_HISTORY_RUN'; payload: ExecutionRun }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SELECT_FOR_PLAYGROUND'; payload: ScrapingApiItem }
  | { type: 'SELECT_FOR_CODE'; payload: ScrapingApiItem };

function getInitialState(): AppState {
  const savedLang = (localStorage.getItem('osiris_lang') as 'ar' | 'en') || 'ar';
  const savedToken = localStorage.getItem('apify_token') || '';
  let savedFavorites: string[] = [];
  let savedHistory: ExecutionRun[] = [];

  try {
    const rawFavs = localStorage.getItem('osiris_favorites');
    if (rawFavs) savedFavorites = JSON.parse(rawFavs);
  } catch (e) {
    savedFavorites = [];
  }

  try {
    const rawHist = localStorage.getItem('osiris_history');
    if (rawHist) savedHistory = JSON.parse(rawHist);
  } catch (e) {
    savedHistory = [];
  }

  const allApis = rawApisData as ScrapingApiItem[];

  return {
    apis: allApis,
    activeTab: 'dashboard',
    selectedApi: allApis[0] || null,
    inspectedApi: null,
    isCommandOpen: false,
    lang: savedLang,
    apifyToken: savedToken,
    favorites: savedFavorites,
    history: savedHistory,
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LANG': {
      localStorage.setItem('osiris_lang', action.payload);
      return { ...state, lang: action.payload };
    }
    case 'SET_ACTIVE_TAB': {
      return { ...state, activeTab: action.payload };
    }
    case 'SET_SELECTED_API': {
      return { ...state, selectedApi: action.payload };
    }
    case 'SET_INSPECTED_API': {
      return { ...state, inspectedApi: action.payload };
    }
    case 'SET_COMMAND_OPEN': {
      return { ...state, isCommandOpen: action.payload };
    }
    case 'SET_APIFY_TOKEN': {
      localStorage.setItem('apify_token', action.payload);
      return { ...state, apifyToken: action.payload };
    }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.payload);
      const updated = exists
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      try {
        localStorage.setItem('osiris_favorites', JSON.stringify(updated));
      } catch (e) {}
      return { ...state, favorites: updated };
    }
    case 'ADD_HISTORY_RUN': {
      const updated = [action.payload, ...state.history.slice(0, 49)]; // keep latest 50 runs
      try {
        localStorage.setItem('osiris_history', JSON.stringify(updated));
      } catch (e) {}
      return { ...state, history: updated };
    }
    case 'CLEAR_HISTORY': {
      localStorage.removeItem('osiris_history');
      return { ...state, history: [] };
    }
    case 'SELECT_FOR_PLAYGROUND': {
      return {
        ...state,
        selectedApi: action.payload,
        activeTab: 'playground',
      };
    }
    case 'SELECT_FOR_CODE': {
      return {
        ...state,
        selectedApi: action.payload,
        activeTab: 'code-studio',
      };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  searchIndex: ApiSearchIndex;
  // Convenience helper methods
  setLang: (lang: 'ar' | 'en') => void;
  setActiveTab: (tab: string) => void;
  setSelectedApi: (api: ScrapingApiItem | null) => void;
  setInspectedApi: (api: ScrapingApiItem | null) => void;
  setIsCommandOpen: (open: boolean) => void;
  setApifyToken: (token: string) => void;
  toggleFavorite: (apiId: string) => void;
  addHistoryRun: (run: ExecutionRun) => void;
  clearHistory: () => void;
  selectForPlayground: (api: ScrapingApiItem) => void;
  selectForCode: (api: ScrapingApiItem) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Initialize Search Index once for the dataset
  const searchIndex = useMemo(() => {
    return new ApiSearchIndex(state.apis);
  }, [state.apis]);

  // Adjust document HTML attributes on language change
  useEffect(() => {
    document.documentElement.setAttribute('lang', state.lang);
    document.documentElement.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
  }, [state.lang]);

  // Helpers
  const setLang = (lang: 'ar' | 'en') => dispatch({ type: 'SET_LANG', payload: lang });
  const setActiveTab = (tab: string) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  const setSelectedApi = (api: ScrapingApiItem | null) => dispatch({ type: 'SET_SELECTED_API', payload: api });
  const setInspectedApi = (api: ScrapingApiItem | null) => dispatch({ type: 'SET_INSPECTED_API', payload: api });
  const setIsCommandOpen = (open: boolean) => dispatch({ type: 'SET_COMMAND_OPEN', payload: open });
  const setApifyToken = (token: string) => dispatch({ type: 'SET_APIFY_TOKEN', payload: token });
  const toggleFavorite = (apiId: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: apiId });
  const addHistoryRun = (run: ExecutionRun) => dispatch({ type: 'ADD_HISTORY_RUN', payload: run });
  const clearHistory = () => dispatch({ type: 'CLEAR_HISTORY' });
  const selectForPlayground = (api: ScrapingApiItem) => {
    dispatch({ type: 'SELECT_FOR_PLAYGROUND', payload: api });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const selectForCode = (api: ScrapingApiItem) => {
    dispatch({ type: 'SELECT_FOR_CODE', payload: api });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contextValue = useMemo<AppContextValue>(() => {
    return {
      state,
      dispatch,
      searchIndex,
      setLang,
      setActiveTab,
      setSelectedApi,
      setInspectedApi,
      setIsCommandOpen,
      setApifyToken,
      toggleFavorite,
      addHistoryRun,
      clearHistory,
      selectForPlayground,
      selectForCode,
    };
  }, [state, searchIndex]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
