import { MongoClient, Db } from 'mongodb';
import url from 'url';

// Create cached connection variable
let cachedDb: Db | undefined;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export async function getDatabase(uri = process.env.DATABASE_URL): Promise<Db> {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  if (!uri) {
    throw new Error('Unable to connect to database, no URI  provided');
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Select the database through the connection,
  // using the database path of the connection string
  const dbName = url.parse(uri).pathname?.substr(1);

  if (!dbName) {
    throw new Error('Unable to derive a dbName to connect to');
  }

  const db = await client.db(dbName);

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}
