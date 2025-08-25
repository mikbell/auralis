import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Assicurati che dotenv sia caricato
dotenv.config();

// Verifica che tutte le credenziali siano presenti
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
	console.error('❌ Missing Cloudinary credentials in .env file!');
	console.error('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
	throw new Error('Cloudinary configuration incomplete');
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary configurato

export default cloudinary;
