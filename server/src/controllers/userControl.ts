import { Response } from "express";
import { User } from "../models/userModal";
import { AuthentucatedRequestCheck } from "../middleware/authMiddleWare";

export const createOrUpdateUser = async (req: AuthentucatedRequestCheck, res: Response) => {
  try {
    // console.log(" MIDDLEWARE RESULT DEBUG:");
    // console.log("req.user:", req.user);
   
    
    const firebaseUid = req.user?.uid;
    const { email, displayName } = req.body;
    
    if (!firebaseUid || !email) {
      
      return res.status(400).json({ 
        message: "Auth token is invalid or email is missing.",
        debug: {
          hasUser: !!req.user,
          userUid: req.user?.uid,
          userEmail: req.user?.email,
          bodyEmail: email
        }
      });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },
      { 
        $set: { 
          email: email, 
          displayName: displayName || 'New User' 
        },
        $setOnInsert: { 
          firebaseUid: firebaseUid 
        }
      },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true
      }
    );

    console.log(`✅ User ${user.email} with UID ${user.firebaseUid} synced successfully.`);
    res.status(200).json(user);

  } catch (error) {
    console.error(" error in createOrUpdateUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


