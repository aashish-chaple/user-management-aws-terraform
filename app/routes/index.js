import healthzRoutes from './healthzRoutes.js';
import userRoutes from './userRoutes.js'
import securityHeaders from '../middleware/securityHeaders.js';

const initializeRoutes = (app) => {
    app.use(securityHeaders)
    app.use('/', healthzRoutes)
    app.use('/v1/user', userRoutes)
}

export default initializeRoutes