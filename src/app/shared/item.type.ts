import { CardType } from "./cardType.enum.type";
import { GameType } from "./gameType.enum.type";
import { Game } from "./game.type";

export interface Item {
    game: Game;
    id: number;
    name: string;
    season: number;
    type: CardType;
}