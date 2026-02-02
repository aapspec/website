'use client';

import { useReducer, useCallback, useRef } from 'react';
import { templates, getTimestamps } from '@/lib/token-generator/templates';
import type { TokenPayload, AgentClaim, TaskClaim, CapabilityClaim } from '@/lib/token-generator/types';

// Action types
type Action =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_AGENT_FIELD'; field: keyof AgentClaim; value: unknown }
  | { type: 'SET_TASK_FIELD'; field: keyof TaskClaim; value: unknown }
  | { type: 'SET_CAPABILITIES'; capabilities: CapabilityClaim[] }
  | { type: 'LOAD_TEMPLATE'; templateKey: string }
  | { type: 'SET_SECRET_KEY'; secretKey: string }
  | { type: 'SET_GENERATED_TOKEN'; token: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'UPDATE_TIMESTAMPS' };

interface TokenFormState {
  payload: TokenPayload;
  secretKey: string;
  generatedToken: string;
  error: string;
  loading: boolean;
}

function initState(): TokenFormState {
  return {
    payload: templates.blank.payload,
    secretKey: 'demo-secret-key-change-in-production',
    generatedToken: '',
    error: '',
    loading: false,
  };
}

function reducer(state: TokenFormState, action: Action): TokenFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, payload: { ...state.payload, [action.field]: action.value } };

    case 'SET_AGENT_FIELD':
      return {
        ...state,
        payload: {
          ...state.payload,
          agent: { ...state.payload.agent, [action.field]: action.value },
        },
      };

    case 'SET_TASK_FIELD':
      return {
        ...state,
        payload: {
          ...state.payload,
          task: { ...state.payload.task, [action.field]: action.value },
        },
      };

    case 'SET_CAPABILITIES':
      return {
        ...state,
        payload: { ...state.payload, capabilities: action.capabilities },
      };

    case 'LOAD_TEMPLATE': {
      const template = templates[action.templateKey];
      if (!template) return state;
      const { now, oneHourLater } = getTimestamps();
      return {
        ...state,
        payload: {
          ...template.payload,
          iat: now,
          exp: oneHourLater,
          task: {
            ...template.payload.task,
            created_at: template.payload.task.created_at ? now : undefined,
          },
          delegation: template.payload.delegation
            ? { ...template.payload.delegation, delegation_time: now }
            : undefined,
        },
        generatedToken: '',
        error: '',
      };
    }

    case 'SET_SECRET_KEY':
      return { ...state, secretKey: action.secretKey };

    case 'SET_GENERATED_TOKEN':
      return { ...state, generatedToken: action.token };

    case 'SET_ERROR':
      return { ...state, error: action.error };

    case 'SET_LOADING':
      return { ...state, loading: action.loading };

    case 'UPDATE_TIMESTAMPS': {
      const { now, oneHourLater } = getTimestamps();
      return {
        ...state,
        payload: { ...state.payload, iat: now, exp: oneHourLater },
      };
    }

    default:
      return state;
  }
}

export function useTokenForm() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const outputRef = useRef<HTMLDivElement>(null);

  const updateField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const updateAgentField = useCallback((field: keyof AgentClaim, value: unknown) => {
    dispatch({ type: 'SET_AGENT_FIELD', field, value });
  }, []);

  const updateTaskField = useCallback((field: keyof TaskClaim, value: unknown) => {
    dispatch({ type: 'SET_TASK_FIELD', field, value });
  }, []);

  const setCapabilities = useCallback((capabilities: CapabilityClaim[]) => {
    dispatch({ type: 'SET_CAPABILITIES', capabilities });
  }, []);

  const loadTemplate = useCallback((templateKey: string) => {
    if (!templateKey) return;
    dispatch({ type: 'LOAD_TEMPLATE', templateKey });
  }, []);

  const setSecretKey = useCallback((secretKey: string) => {
    dispatch({ type: 'SET_SECRET_KEY', secretKey });
  }, []);

  const setGeneratedToken = useCallback((token: string) => {
    dispatch({ type: 'SET_GENERATED_TOKEN', token });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', loading });
  }, []);

  const updateTimestamps = useCallback(() => {
    dispatch({ type: 'UPDATE_TIMESTAMPS' });
  }, []);

  const generateToken = useCallback(async (schemasLoaded: boolean) => {
    if (!schemasLoaded) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: '' });

    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: state.payload, secret: state.secretKey }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: 'SET_GENERATED_TOKEN', token: data.token });
        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        dispatch({ type: 'SET_ERROR', error: data.error || 'Failed to generate token' });
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        error: err instanceof Error ? err.message : 'Failed to generate token',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [state.payload, state.secretKey]);

  return {
    state,
    outputRef,
    updateField,
    updateAgentField,
    updateTaskField,
    setCapabilities,
    loadTemplate,
    setSecretKey,
    setGeneratedToken,
    setError,
    setLoading,
    updateTimestamps,
    generateToken,
  };
}
