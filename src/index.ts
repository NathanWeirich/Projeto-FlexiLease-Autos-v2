import "reflect-metadata";
import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import connectDB from "./database/config/db";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";
import "./container";
import { errorHandler } from "./api/middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Configuração do Swagger
const routerDir = path.join(__dirname, "routes");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FlexiLease Autos",
      version: "1.0.0",
      description: "Documentação da API da FlexiLease Autos",
    },
  },
  apis: fs.readdirSync(routerDir).map((file) => path.join(routerDir, file)),
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rotas da aplicação
app.use(routes);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
