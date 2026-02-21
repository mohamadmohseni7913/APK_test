const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

server.options('*', cors());

server.use(middlewares);
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
});