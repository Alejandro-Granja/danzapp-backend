const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const crear = async () => {
    try {
        const password = "pass1234"
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO movies.User (email, name, country, city, birthdate, password, role) VALUES ('admin@servidor.com', 'Admin', 'Adminlandia', 'Admin City','2000-01-01', $1, 'admin') RETURNING *",
            [hashedPassword]
        );

        console.log("Se creo exitosamente el usuario administrador");

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Error: El correo electrónico ya está registrado");
        } else {
            console.error("Error al crear usuario:", error.message);
        }
        //throw error;
    } finally {
        await pool.end(); // Cierra el pool al finalizar
    }
}

crear();
