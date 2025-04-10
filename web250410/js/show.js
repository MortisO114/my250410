function showId2(){
    var userId = $("#uId").val();
    if (userId != ""){
        $("#idmsg").show();
        $("#idmsg").html("<font color='red'>" + userId + "</font>");
    }else{
        $("#idmsg").hide();
    }
}

function showId(){
    // let
    var userId = document.getElementById("uId").value;
    //身分證有輸入資料(!=:不等於)
    if (userId != ""){
        // inline:同一行 block換行
        //document.getElementById("idmsg").style.display = "inline";
        document.getElementById("idmsg").style.display = "block";
        document.getElementById("idmsg").innerHTML = "<font color='red'>" + userId + "</font>";
    }else{
        // 身分證沒有輸入資料時，將id=idmsg 隱藏
        document.getElementById("idmsg").style.display = "none";
    }
    
}