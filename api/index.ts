import { createApp } from '../src/app';
import { DependencyContainer } from '../src/container';

const container = DependencyContainer.getInstance();
const app = createApp(container);

export default app;
