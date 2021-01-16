import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000/";

const io = socketIOClient();
export default io;
