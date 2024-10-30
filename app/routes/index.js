import healthzRoutes from './healthzRoutes.js';
import userRoutes from './userRoutes.js'
import securityHeaders from '../middleware/securityHeaders.js';
import imageRoutes from './imageRoutes.js';

const initializeRoutes = (app) => {
    app.use(securityHeaders)
    app.use('/', healthzRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/user/self/pic', imageRoutes)
}

export default initializeRoutes