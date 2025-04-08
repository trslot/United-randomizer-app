import { GameType } from "./gameType.enum.type";

export interface Game {
    id: number;
    game: string;
    name: string;
    season: number;
    type: GameType;
}