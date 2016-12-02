import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'
import { InitGame } from '../../ChineseChess/InitGame/init';
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'

export class Agent {
    team: number;
    legalMoves: {}; // name->[positions]
    myPieces: Piece[];
    oppoPieces: Piece[];
    oppoAgent: Agent;
    strategy;
    myPiecesDic: {}; // {name -> pos}
    boardState: {}; // {posStr->[name, isMyPiece]}
    // moved: EventEmitter<number> = new EventEmitter();


    constructor(team: number, myPieces = undefined) {
        this.team = team;
        if (myPieces == undefined)
            this.myPieces = (team == 1 ? InitGame.getRedPieces() : InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
    }
    setOppoAgent(oppoAgent, updateDict = false) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        this.updateState(updateDict);
    }
    // return | 1:win | -1:lose | 0:continue
    updateState(updateDict = false) {
        this.updateBoardState();
        this.computeLegalMoves();
        if (updateDict) this.updatePieceDict();
    }

    // compute legals moves for my pieces after state updated
    computeLegalMoves() {
        this.legalMoves = Rule.allPossibleMoves(this.myPieces, this.boardState, this.team);
    }

    // update board state by pieces
    updateBoardState() {
        var state = {};
        for (var i in this.myPieces) state[this.myPieces[i].position.toString()] = [this.myPieces[i].name, true];
        for (var i in this.oppoPieces) state[this.oppoPieces[i].position.toString()] = [this.oppoPieces[i].name, false];
        this.boardState = state;
    }

    // update dictionary of pieces
    updatePieceDict() {
        this.myPiecesDic = {};
        for (var i in this.myPieces) {
            this.myPiecesDic[this.myPieces[i].name] = this.myPieces[i].position;
        }
    }

    movePieceTo(piece: Piece, pos, isCapture = undefined) {
        piece.moveTo(pos);
        if (isCapture == undefined) isCapture = this.oppoPieces.filter(x => x.position + '' == pos + '').length > 0;
        // having oppo piece in target pos
        if (isCapture) this.captureOppoPiece(pos);
    }

    // capture piece of opponent
    // pos: position of piece to be captured
    captureOppoPiece(pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    }


    // TO BE IMPLEMENTED BY CHILD CLASS
    // return [piece:Piece, toPos];
    comptuteNextMove() {
        console.log("comptuteNextMove CALLED ")
        return null;
    }

    getPieceByName(name) {
        return this.myPieces.filter(x => x.name == name)[0];
    }
    // check existance of my king
    check_king_exist() {
        return this.getPieceByName('k') != undefined;
    }

    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new Agent(this.team, copy_mypieces);
    }


    static piecesFromDict(dict_list) {
        return dict_list.map(x => Piece.copyFromDict(x));
    }

    static copyFromDict(dict) {
        return new Agent(dict.team, this.piecesFromDict(dict.myPieces));
    }
}