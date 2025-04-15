// lets import our packages and initialize our variables
import express, {Request, Response, NextFunction} from 'express';
import distrubanceEventRouts from './routes/distrubanceEventRouts';

const app = express();
const PORT = 8080;

// Use express.json middleware to parse all req.body as json
app.use( express.json() );

// setup router
app.use('/disturbance-events', distrubanceEventRouts);

// Below route is trigerred when any error is is thrown
app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
  });

app.listen(
    PORT,
    () => console.log(`API is listening on http://localhost:${PORT}/`)
)
