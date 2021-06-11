import React, { useContext } from 'react';
import { ContainerInstance } from 'typedi';
import { NewsApp } from './app';

export const ContainerContext = React.createContext<ContainerInstance>(null);

export function useContainer() {
	return useContext(ContainerContext);
}

export function useApp() {
	const container = useContainer();
	return container.get(NewsApp);
}
