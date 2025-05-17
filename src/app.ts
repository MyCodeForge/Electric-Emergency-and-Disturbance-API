// lets import our packages and initialize our variables
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import distrubanceEventRoutes from './routes/distrubanceEventRoutes';
import regionSummaryRoutes from './routes/regionSummaryRoutes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './schemas/openapi.json';

const app = express();

// add middleware
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Use express.json middleware to parse all req.body as json
app.use(express.json());

// setup router
app.use('/api/v1/disturbance-events', distrubanceEventRoutes);
app.use('/api/v1/regions', regionSummaryRoutes);

// Below route is trigerred when any error is is thrown
app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
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
