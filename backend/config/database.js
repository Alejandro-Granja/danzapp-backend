const { Pool } = require('pg');
require('dotenv').config();
 
// Configuración de la conexión a la base de datos
const pool = new Pool({
    host: process.env.DB_HOST || 'wr-5pr.h.filess.io',
    database: process.env.DB_DATABASE || 'danzapp_bodydepth',
    user: process.env.DB_USER || 'danzapp_bodydepth',
    password: process.env.DB_PASSWORD || '8f7372926e3ed2f0a68f383d503437e68c42081a',
    port: process.env.DB_PORT || 5434
});
 
module.exports = pool