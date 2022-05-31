import io from "socket.io-client";
export let socket;

export const setAuthTokenSocket = async (token) => {
    if (token.indexOf("Bearer ") === 0) {
        token = token.split("Bearer ")[1];
    }
    let address =
        process.env.NODE_ENV === "production"
            ? "https://qrspots.herokuapp.com"
            : "http://localhost:5005";
            // : "https://a696-188-26-215-18.ngrok.io";
    socket = await io(address, {
        query: { token },
        transports: ['websocket'],
    });
    console.log(3)
    console.log(socket)
};
