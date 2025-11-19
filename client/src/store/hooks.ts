import {type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Типизированный useDispatch хук
 * Использовать вместо обычного useDispatch
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Типизированный useSelector хук
 * Использовать вместо обычного useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

