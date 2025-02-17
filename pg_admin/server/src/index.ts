import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 7000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running.');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});