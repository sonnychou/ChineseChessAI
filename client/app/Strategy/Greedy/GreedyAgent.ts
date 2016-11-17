
import { Agent } from '../Agent/Agent'
import { Evaluation } from '../_Param/Evaluation'

export class GreedyAgent extends Agent {



  // private method of computing next move
  comptuteNextMove(){
    var pieceNames = Object.keys(this.legalMoves);
    var pieceName = '';
    var maxVal = 0;
    var fromPos = [];
    var toPos = [];
    for(var i in pieceNames){
      var name = pieceNames[i];
      var moves = this.legalMoves[name];
      for (var j in moves){
        var move = moves[j];
        var value = this.getValueOfMove(name, move);
        if(value >= maxVal){
          fromPos = this.myPiecesDic[name];
          toPos = move;
          pieceName = name;
          maxVal = value;
        }
      }
    }
    return [pieceName, fromPos, toPos];
  }


  getValueOfMove(pieceName, toPos){
    var posStr = toPos[0]+'-'+toPos[1];
    var piece = this.boardState[posStr];
    var posVal =  Evaluation.posValue(pieceName, toPos);
    if (!piece) return posVal; // empty place
    if (piece[1]) alert("Bug");
    return Evaluation.pieceValue(piece[0]) + posVal;
  }

}