import "dotenv/config";
import app from "./app.ts";
import connectDb from "./db/db.ts";

const startServer = async (): Promise<void> => {
    try {
        await connectDb();

        const port = Number(process.env.PORT) || 8080;

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error: unknown) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();