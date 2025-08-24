import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Connesso a MongoDB ${conn.connection.host}`);
	} catch (error) {
		console.log("Errore nella connessione a MongoDB", error);
		process.exit(1);
	}
};
