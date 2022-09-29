import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token

  const rooms = readChatRoomsDB();

  //check if roomId exist
  const roomIndex = rooms.findIndex((x) => x.roomId === roomId);
  if (roomIndex === -1)
    return res.status(404).json({ ok: false, message: "Invalid room id" });

  //check if messageId exist
  const messages = rooms[roomIndex].messages;
  const messageIndex = messages.findIndex((x) => x.messageId === messageId);
  if (messageIndex === -1)
    return res.status(404).json({ ok: false, message: "Invalid message id" });

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
  if (req.method === "DELETE") {
    const user = checkToken(req);
    if (!user.isAdmin & (user.username !== messages[messageIndex].username))
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to access this data",
      });

    rooms[roomIndex].messages.splice(messageIndex, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  }
}