import { sequelize } from "../config/db.js";
import { Usuario } from "../models/Usuario.js";

const ver = async () => {
    try {
        await sequelize.authenticate();
        console.log("BD conectada. Listando usuarios:");
        const users = await Usuario.findAll({ attributes: ["id", "cedula", "nombre", "rol", "createdAt"] });
        if (!users.length) {
            console.log("No hay usuarios.");
        } else {
            users.forEach(u => {
                console.log(`${u.id} | ${u.cedula} | ${u.nombre} | ${u.rol} | ${u.createdAt}`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error("Error listando usuarios:", err);
        process.exit(1);
    }
};

ver();
