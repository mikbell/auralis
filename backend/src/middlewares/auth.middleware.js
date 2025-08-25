import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	// Fix deprecation warning: use req.auth() as function
	const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
	
	if (!auth?.userId) {
		return res.status(401).json({ message: "Non autorizzato - devi accedere" });
	}

	// Store auth in req for later use
	req.authData = auth;
	next();
};

export const requireAdmin = async(req, res, next) => {
    try {
        // Use the auth data stored in protectRoute or get it directly
        const auth = req.authData || (typeof req.auth === 'function' ? req.auth() : req.auth);
        
        const currentUser = await clerkClient.users.getUser(auth.userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;
        const adminEmail = process.env.ADMIN_EMAIL;
        
        console.log('🔍 Admin Check:');
        console.log('   Current user email:', userEmail);
        console.log('   Admin email from env:', adminEmail);
        console.log('   Emails match:', userEmail === adminEmail);
        
        const isAdmin = adminEmail === userEmail;

        if(!isAdmin){
            return res.status(403).json({
                message: "Non autorizzato - devi essere admin",
                debug: {
                    userEmail,
                    adminEmail,
                    userId: auth.userId
                }
            });
        }
        
        console.log('✅ Admin access granted for:', userEmail);
        next();
    } catch (error) {
        console.log("❌ Errore in requireAdmin:", error);
        return res.status(500).json({message: "Errore interno del server", error: error.message});
    }
};
