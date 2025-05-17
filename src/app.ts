// lets import our packages and initialize our variables
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import distrubanceEventRoutes from './routes/distrubanceEventRoutes';
import regionSummaryRoutes from './routes/regionSummaryRoutes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './schemas/openapi.json';

const app = express();

// Configure CORS
const corsOptions = {
    origin: '*', // In production, you should specify your actual frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// add middleware
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Use express.json middleware to parse all req.body as json
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// setup router
app.use('/api/v1/disturbance-events', distrubanceEventRoutes);
app.use('/api/v1/regions', regionSummaryRoutes);

// Below route is trigerred when any error is is thrown
app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({message: err.message});
});

// Remove the app.listen call for Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = 8080;
    app.listen(
        PORT,
        () => console.log(`API is listening on http://localhost:${PORT}/api-docs/`)
    );
}

// Export the app for Vercel
export default app;
