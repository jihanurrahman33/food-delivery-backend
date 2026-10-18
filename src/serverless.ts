import { createApp } from './app';
import { DependencyContainer } from './container';

const container = DependencyContainer.getInstance();
const app = createApp(container);

export = app;
