import { getDatabaseSchema } from "./schema.service.js";


getDatabaseSchema()
    .then(schema => {
        console.log("Db schema: ");
        console.log(schema);
    })
    .catch(err => {
        console.error("schema error: ",err)
    })