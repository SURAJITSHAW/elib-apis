import app from './src/app';
import { config } from './src/utils/config';
import connectDB from './src/utils/db';

const startServer = async () => {
  await connectDB();

  app.listen(config.port || 3000, () => {
  console.log(`Server is running on port ${config.port}`);
});
}

startServer()