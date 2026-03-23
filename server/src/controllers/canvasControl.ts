import { Request, Response } from "express";
import { User } from "../models/userModal";
import { Canvas } from "../models/canvaModel";
import { firestoreDb } from "..";
import crypto from "crypto";

export const createCanvas = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const firebaseUid = req.user!.uid;

    const user = await User.findOne({ firebaseUid }); //this is for auth check

    if (!user) {
      return res
        .status(404)
        .json({ message: "Authenticated user not found in database." });
    }

    const canvasName = name || "Untitled Canvas";

    const inviteToken = crypto.randomBytes(16).toString("hex");

    const newCanvas = await Canvas.create({
      name: canvasName ,
      owner: user._id,
      collaborators: [user._id],
      inviteToken: inviteToken,
    });
    const canvasDocRef = firestoreDb
      .collection("canvases")
      .doc(newCanvas._id.toString());
    await canvasDocRef.set({
      name: canvasName,
      ownerId: user._id.toString(),
      activeUsers: {},
      createdAt: new Date(),
    });

    await canvasDocRef
      .collection("nodes")
      .doc("_init")
      .set({ initialized: true });
    await canvasDocRef
      .collection("edges")
      .doc("_init")
      .set({ initialized: true });
    await canvasDocRef
      .collection("pendingRequests")
      .doc("_init")
      .set({ initialized: true });
    // console.log("Firestore document created successfully.");

    res.status(201).json(newCanvas);
  } catch (error) {
    console.error("Error creating canvas:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getInviteLink = async (req: Request, res: Response) => {
  const { _id } = req.params;
  console.log("backent to generate url");

  const canvas = await Canvas.findById(_id).select("inviteToken");

  if (!canvas) {
    return res.status(404).json({ message: "Canvas not found" });
  }

  const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const inviteLink = `${clientBaseUrl}/join/${_id}/${canvas.inviteToken}`;
  res.status(200).json({ inviteLink });
}; //creates url with sharetoken

export const requestAccess = async (req: Request, res: Response) => {
  const { _id } = req.params;

  const { inviteToken } = req.body;

  const requestingFirebaseUid = req.user!.uid;

  // console.log(
  //   `Received access request for canvas ${_id} by user ${requestingFirebaseUid}`,
  // );

  try {
    const canvas = await Canvas.findById(_id);
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.inviteToken !== inviteToken) {
      return res
        .status(403)
        .json({ message: "Invalid or expired invite link." });
    }

    const requestingUser = await User.findOne({
      firebaseUid: requestingFirebaseUid,
    });
    if (!requestingUser) {
      return res
        .status(404)
        .json({ message: "Requesting user profile not found." });
    }

    if (canvas.collaborators.includes(requestingUser._id)) {
      return res
        .status(409)
        .json({ message: "You already have access to this canvas." });
    }
    const requestDocRef = firestoreDb
      .collection("canvases")
      .doc(_id)
      .collection("pendingRequests")
      .doc(requestingUser._id.toString()); //adding user id to request list

    await requestDocRef.set({
      userId: requestingUser._id.toString(),
      userName: requestingUser.displayName,
      userEmail: requestingUser.email,
      timestamp: new Date(),
    });

    console.log(
      `Successfully created pending request for user ${requestingUser._id} on canvas ${_id}`,
    );
    res.status(200).json({ message: "Access request sent successfully." });
  } catch (error) {
    console.error("Error in requestAccess controller:", error);
    res
      .status(500)
      .json({ message: "Server error while processing your request." });
  }
};

export const approveRequest = async (req: Request, res: Response) => {
  const { _id: canvasId } = req.params;
  const { userIdToApprove } = req.body;
  const ownerFirebaseUid = req.user?.uid;

  if (!userIdToApprove) {
    return res.status(400).json({ message: "User ID to approve is required." });
  }

  try {
    const canvas = await Canvas.findById(canvasId).populate("owner");
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found." });
    }

    if ((canvas.owner as any).firebaseUid !== ownerFirebaseUid) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this canvas." });
    } //check that approval is done by the owner or not

    const userToApprove = await User.findById(userIdToApprove);
    if (!userToApprove) {
      return res
        .status(404)
        .json({ message: "User to approve was not found." });
    }

    await Canvas.updateOne(
      { _id: canvasId },
      { $addToSet: { collaborators: userToApprove._id } },
    );

    await User.updateOne(
      { _id: userToApprove._id },
      { $addToSet: { joinedCanvases: canvasId } },
    );

    const requestDocRef = firestoreDb
      .collection("canvases")
      .doc(canvasId)
      .collection("pendingRequests")
      .doc(userIdToApprove);

    await requestDocRef.delete();

    console.log(`User ${userIdToApprove} approved for canvas ${canvasId}`);
    res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Internal Server Error during approval." });
  }
};

export const declineRequest = async (req: Request, res: Response) => {
  const { _id: canvasId } = req.params;
  const { userIdToDecline } = req.body;
  const ownerFirebaseUid = req.user?.uid;

  const canvas = await Canvas.findById(canvasId);

  try {
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found." });
    }

    const owner = await User.findById(canvas.owner);
    if (owner?.firebaseUid !== ownerFirebaseUid) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner." });
    }
    const requestDocRef = firestoreDb
      .collection("canvases")
      .doc(canvasId)
      .collection("pendingRequests")
      .doc(userIdToDecline);

    await requestDocRef.delete();
    console.log(`User ${userIdToDecline} declined for canvas ${canvasId}`);
    res.status(200).json({ message: "Request declined successfully." });
  } catch (error) {
    console.error("Error declining request:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getCanvases = async (req: Request, res: Response) => {
  try {
    console.log("request hit for get canvas");

    const firebaseUid = req.user!.uid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const canvases = await Canvas.find({ collaborators: user._id })
      .sort({ updatedAt: -1 })
      .populate("owner", "firebaseUid");
    res.status(201).json(canvases);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCanvas = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const firebaseUid = req.user?.uid;

  // console.log("id:", _id);
  // console.log("firebaseUid:", firebaseUid);

  try {
    const canvas = await Canvas.findById(_id);

    if (!canvas) {
      console.log(`Canvas with ID: ${_id} not found in MongoDB.`);
      return res.status(404).json({ message: "Canvas not found." });
    }
    // console.log("Found canvas to delete:", canvas);

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      // console.log(
      //   `User with Firebase UID: ${firebaseUid} not found in our User collection.`
      // );
      return res.status(403).json({ message: "User not found." });
    }
    console.log("Found requesting user in DB:", user);

    if (canvas.owner.toString() !== user._id.toString()) {
      console.log(
        "Authorization failed. Canvas owner:",
        canvas.owner.toString(),
        "User ID:",
        user._id.toString(),
      );
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this canvas." });
    }

    await Canvas.findByIdAndDelete(_id);
    console.log(`Deleted canvas ${_id} from MongoDB.`);

    const canvasDocRef = firestoreDb.collection("canvases").doc(_id);
    await canvasDocRef.delete();
    console.log(`Deleted canvas ${_id} from Firestore.`);

    res.status(200).json({ message: "Canvas deleted successfully" });
  } catch (error) {
    console.error("Server error during canvas deletion:", error);
    res.status(500).json({ message: "Server error during canvas deletion." });
  }
};

export const removeContributor = async (req: Request, res: Response) => {
  try {
    const { _id, userId: userIdToRemove } = req.params;

    // console.log("\n--- Received request to remove contributor ---");
    // console.log("Canvas ID received from URL:", _id);
    // console.log("Firebase UID received from URL:", userIdToRemove);
    const userToRemove = await User.findOne({ firebaseUid: userIdToRemove });
    const canvas = await Canvas.findById(_id);

    if (!canvas || !userToRemove) {
      return res.status(404).json({ message: "Canvas or user not found." });
    }

    const mongoUserIdToRemove = userToRemove._id;

    await Canvas.updateOne(
      { _id: _id },

      { $pull: { collaborators: mongoUserIdToRemove } },
    );

    await User.updateOne(
      { _id: userToRemove._id },
      { $pull: { joinedCanvases: _id } },
    );

    res.status(200).json({ message: "Contributor removed successfully." });
  } catch (error) {
    console.error("Error removing contributor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
