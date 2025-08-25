import { User } from "../models/user.model.js";

import { clerkClient } from "@clerk/express";

export const callback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		const user = await User.findOne({ clerkId: id });

		if (!user) {
			await User.create({
				clerkId: id,
				fullName: `${firstName} ${lastName}`,
				imageUrl,
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Errore in auth callback", error);
		next(error);
	}
};

export const getUserInfo = async (req, res, next) => {
	try {
		if (!req.auth?.userId) {
			return res.status(401).json({ message: "Non autenticato" });
		}

		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const userEmail = currentUser.primaryEmailAddress?.emailAddress;
		const adminEmail = process.env.ADMIN_EMAIL;
		
		res.status(200).json({
			userId: req.auth.userId,
			userEmail,
			adminEmail,
			isAdmin: userEmail === adminEmail,
			userData: {
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				imageUrl: currentUser.imageUrl
			}
		});
	} catch (error) {
		console.log("Errore in getUserInfo", error);
		next(error);
	}
};
