import healthzRoutes from './healthzRoutes.js';
import middleware from '../middleware.js';

const initializeRoutes = (app) => {
    app.use(middleware)
    app.use('/', healthzRoutes)
}

export default initializeRoutes