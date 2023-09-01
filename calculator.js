//画面要素のid指定
var ResultLabel = document.getElementById('result');
var Player1 = document.getElementById('Player1');
var Player2 = document.getElementById('Player2');
var Disp_Player1 = document.getElementById('Disp_Player1');
var Disp_Player2 = document.getElementById('Disp_Player2');
var Decide_Button = document.getElementById('decide_Button');
var lbl_Frame_Number = document.getElementById('lbl_Frame_Number');
//グローバル変数
var LeftSide = 0;
var Frame_Number = 1;
var Piching_Number = 1;
var Player_Number = 1;
var OneFrame_TotalPoint = 0;
//1投目の点数
var First_Throw_Point = 0;
var OperBefore = "";
var BeforeOneClickOpeFlg = false;
//イベント定義
document.addEventListener('keydown',keydownEvent,false);
window.addEventListener('DOMContentLoaded', function() {
    //this.document.getElementById('Score1_' + 1 + '_' + 1).value = "▶◀";
})

/*
 * 
 * 名前セット
 * 
 */
function NameSet(){
    Disp_Player1.value = Player1.value;
    Disp_Player2.value = Player2.value;
    Player1.value = "";
    Player2.value = "";
    Player1.readOnly = true;
    Player2.readOnly = true;
    Decide_Button.disabled = true
    this.document.getElementById('input_point').focus();
    //フレーム数をインクリメント
    //Frame_Number++;
    DispGameStutas(Disp_Player1.value);
}

/*
 * 
 * ゲーム現状ラベル表示
 * 
 */
function DispGameStutas(playerName){
        lbl_Frame_Number.innerText = playerName + "さんの第" + Frame_Number.toString() + "フレーム" + Piching_Number.toString() + "投目です。";
}

/*
 * 
 * プレイヤー名変更
 * 
 */
function PlayerNameChange(){
    if(Decide_Button.disabled){
        Player1.readOnly = false;
        Player2.readOnly = false;
        Decide_Button.disabled = false;
    }
}

/*
 * 
 * プレイヤーチェンジ時の処理
 * 
 */
function ChengePlayerProcess(){
    Piching_Number = 1;
    First_Throw_Point = 0;
    if(Player_Number === 1){
        Player_Number++;
    }else{
        Frame_Number++;
        Player_Number--;
    }
    OneFrame_TotalPoint = 0;
}

/*
 * 
 * ゲーム終了判定
 * 
 */
function JudgFinishGame(){
    if(Frame_Number > 10){
        lbl_Frame_Number.innerText = "ゲーム終了!!!";
        document.getElementById('input_point').readOnly = true;
    }else{
        //ゲーム続行により、現在のゲーム進行状態を表示
        if(Player_Number === 1){
            DispGameStutas(Disp_Player1.value);
        }else{
            DispGameStutas(Disp_Player2.value);
        }
    }
}

/*
 * 
 * キーダウンイベント
 * 
 */
function keydownEvent(event){
    var activeElement = document.activeElement;
    //得点欄にポイントが入力されている状態でEnterが押されたら
    if(event.key === "Enter" &&
       activeElement.id === "input_point"){
        if(!isNaN(activeElement.value) &&
            activeElement.value <= 10 &&
            activeElement.value !== ""){
            //数値なら
            // 10以上の入力かチェック
            if(parseFloat(OneFrame_TotalPoint) + parseFloat(activeElement.value) > 10){
                alert('1フレームの合計本数が10を超えてはいけません');
                activeElement.value = "";
                return;
            }
            //1フレーム内の点数を加算
            OneFrame_TotalPoint += parseFloat(activeElement.value);
            //記号表示用変数
            var gotPoint = activeElement.value;

            //1投目の点数を保持
            if(Piching_Number === 1){
                First_Throw_Point = activeElement.value;
            }

            //ストライクorスペア判断
            if(OneFrame_TotalPoint === 10){
                if(Piching_Number == 2 &&
                    parseFloat(First_Throw_Point) !== 10){
                    gotPoint = "◢";
                }else{
                    gotPoint = "▶◀";
                }
                //10フレーム3投目スペア対応
                if(Piching_Number == 3 &&
                  (parseFloat(OneFrame_TotalPoint) + parseFloat(activeElement.value)) >= 11){
                        gotPoint = "◢";
                    }
            }else if(OneFrame_TotalPoint === 0){
                //ガター判定
                if(Piching_Number == 1){
                    gotPoint = "G";
                }else{
                    gotPoint = "-";
                }
            }
            
            //今回の点数を表示
            document.getElementById('Score' + Player_Number + '_' + Frame_Number + '_' + Piching_Number).value = gotPoint;
            //トータルストアを表示↓↓↓↓↓
            if(Piching_Number >= 2 && OneFrame_TotalPoint !== 10){
                var tensu = 0;
                if(Frame_Number === 1){
                    document.getElementById('score_Point' + Player_Number + '_' + Frame_Number).value = OneFrame_TotalPoint;
                }else{
                    tensu = parseFloat(document.getElementById('score_Point' + Player_Number + '_' + (Frame_Number - 1)).value);
                    tensu += parseFloat(OneFrame_TotalPoint);
                    document.getElementById('score_Point' + Player_Number + '_' + Frame_Number).value = tensu;
                }
            }
            
            activeElement.value = "";
            Piching_Number++;
            //プレイヤーチェンジか？※9フレーム以下の場合
            if(Frame_Number <= 9){
                if(Piching_Number > 2 ||
                    OneFrame_TotalPoint === 10){
                    ChengePlayerProcess();
                 }
            }else{
                //10フレーム1投目ストライクまたは、2投目スペアか？
                if(OneFrame_TotalPoint === 10){
                    OneFrame_TotalPoint = 0
                }
                //プレイヤーチェンジの条件
                if(Piching_Number > 3 ||
                    (Piching_Number > 2 &&
                     OneFrame_TotalPoint < 10 &&
                     parseFloat(First_Throw_Point) !== 10)){
                        ChengePlayerProcess();
                }
            }
            
            //ゲーム終了判定
            JudgFinishGame();
        }else{
            alert("10以下の数値を入力してください");
            activeElement.value = "";
        }
    }
}