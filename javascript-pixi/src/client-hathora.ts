import { LobbyV2Api, RoomV1Api, AuthV1Api, Lobby, DiscoveryV1Api, Region } from "@hathora/hathora-cloud-sdk";

export const lobbyClient = new LobbyV2Api();
export const roomClient = new RoomV1Api();
const authClient = new AuthV1Api();
const discoveryClient = new DiscoveryV1Api();
const HATHORA_APP_ID = "app-71bf9a1f-6fcd-4ad5-aad8-30618715825f";

type LobbyState = { playerCount: number };

const getLowestPingRegion = async () => {
  const data = await discoveryClient.getPingServiceEndpoints();
  const regionPromises = data.map(({ region, host, port }) => {
    return new Promise<Region>(async (resolve) => {
      const pingUrl = `wss://${host}:${port}`;
      const socket = new WebSocket(pingUrl);
      socket.addEventListener('open', () => {
        resolve(region);
        socket.close();
      });
    });
  });
  return await Promise.race(regionPromises);
}

export const createLobby = async () => {
  let region = await getLowestPingRegion()
  const playerToken = (await (authClient.loginAnonymous(HATHORA_APP_ID))).token;
  return await lobbyClient.createLobby(
      HATHORA_APP_ID,
      playerToken,
      { visibility: "public", region, initialConfig: {} },
  );
}

const getHathoraConnectionInfo = async (roomId: string) => {
    let info = await roomClient.getConnectionInfo(
        HATHORA_APP_ID,
        roomId,
    );
    if (info === undefined){
        return undefined;
    }
    return info;
}

const pollConnectionInfo = async (roomId: string) => {
    let result;
    while (result === undefined || result.status === 'starting' ) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        result = await getHathoraConnectionInfo(roomId);
    }
    return result;
}

export const findAvailableLobby = async () => {
  const rooms = await lobbyClient.listActivePublicLobbies(HATHORA_APP_ID);

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i] as Lobby;
    const roomState = room.state as LobbyState;

    if (roomState !== undefined && roomState.playerCount <= 1) {
        return room;
    }
  }
}

export const getLobbyInfo = async ( lobby: Lobby ) => {
  let info = await pollConnectionInfo(lobby.roomId);
  let url = `wss://1.proxy.hathora.dev:${info.port}`;
  return { roomId: lobby.roomId, url}
}
