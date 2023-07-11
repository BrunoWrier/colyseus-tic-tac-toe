import { LobbyV2Api, RoomV1Api, AuthV1Api} from "@hathora/hathora-cloud-sdk";

export const lobbyClient = new LobbyV2Api();
export const roomClient = new RoomV1Api();
export const authClient = new AuthV1Api();
export const HATHORA_APP_ID = "app-71bf9a1f-6fcd-4ad5-aad8-30618715825f";

export type LobbyState = { playerCount: number };

export const hathoraSetLobbyState = async (roomId: string, playerCount: number) => {
    await lobbyClient.setLobbyState(
        HATHORA_APP_ID,
        roomId,
        { state: { playerCount } },
        { headers: {
          Authorization: `Bearer ${process.env.HATHORA_DEVELOPER_TOKEN}`,
          "Content-Type": "application/json"
        } }
    );
}

export const hathoraDestroyLobby = async (roomId: string) => {
    await roomClient.destroyRoom(
        HATHORA_APP_ID,
        roomId,
        { headers: {
          Authorization: `Bearer ${process.env.HATHORA_DEVELOPER_TOKEN}`,
          "Content-Type": "application/json"
        } }
    );
}
