//responsible gaming
function checkDpLimitAmount() {
    var value = $("#txtLimit").val().substring(4)
    if ((value == "") || (value == 0)) {
        $("#txtLimitErrorMsg").show();
        return false
    }
    $("#txtLimitErrorMsg").hide();
    return true;
}

function checkDepositLimitPwd() {
    if ($("#txtChangeLimitPwd").val().length > 0) {
        $("#changeLimitPwdErrorMsg").hide();
        return true
    } else {
        $("#changeLimitPwdErrorMsg").show();
        return false
    }
}


function showSetDepositLimitField(txtInputField, section, className) {
    $(txtInputField).addClass("disabled")
    $(className).show();
    $(section + className + ' .successChangeLimit ').show();
    setTimeout(function () {
        $(section + className + ' .successChangeLimit ').fadeOut();
    }, 2500);

}



function checkRealityLimitPwd() {
    if ($("#txtRealityCheckPwd").val().length > 0) {
        $("#txtRealityCheckPwdErrorMsg").hide();
        return true

    } else {
        $("#txtRealityCheckPwdErrorMsg").show();
        return false
    }
}



var timer; // Will hold the timer 
var seconds = 5;
// Start the timer
function countDownTimer(){
  clearInterval(timer); // Just incase 
  seconds = 5;
  $('.count').html("").append("5");
  $(".resp-gaming-modal .confirm-btn").removeClass("confirm")

  timer = setInterval(function(){
        if (seconds > 0)
        { 
          $(".count").show()
          $('.count').html("").append(seconds)
            seconds--;
        } 
         if(seconds===0){
                    $(".resp-gaming-modal .confirm-btn").addClass("confirm");
                      $(".count").hide();
                      $('.count').html("").append("5");
        }
      // This function will occur every second 
    
 }, 1000);
};

// Reset the timer
$('.cancel-btn').click(function(){
    clearInterval(timer);
  seconds = 5;
  $('.count').html("").append(seconds);
});




var start = new Date;
start.setHours(24, 0, 0); // 11pm
function pad(num) {
    return ("0" + parseInt(num)).substr(-2);
}

var countEdit = 0;

$(document).ready(function () {

     

    var editLimitBool = sessionStorage.getItem("editLimitbool");

    if (editLimitBool == "true") {
        $("#editedLimitAmt").html("").append("MYR 2000.00")

        $(".button-selector").removeClass("active")
        $("#responsibleGamingBtn").addClass("active")
      
        $("#ProfileSection").hide()
        $(".tabSectionContent").hide();
        $("#responsibleGamingSection").show();
        $("#txtCurrentDepositLimit").attr("value", "MYR 2000")
        $("#txtCurrentDepositLimit").css("font-weight", "bolder")
        $("#changeLimitBtn").hide()
        // $("#confirmLimitContainer").show();
        $(".visitConfirm").hide()
        $(".toConfirmEdit").show()
        //put dynamic value
        $(".toConfirmDelete").hide()

        $("#confirmLimitBtn").show()
        $("#confirmLimitBtn").removeClass("disabled")

        $("#confirmLimitBtn").click(function () {
            // $("#confirmLimitContainer").hide()
            $("#editLimitActionRow").css("display", "flex")
            $(".limitCountDown").show()
            $(".confirmLimitCondText").hide()
            $("#currentSetLimit").show()
            $("#changeCurrentLimit .actionRow").show()
        })
        // var removeLimitBool = true;
        // sessionStorage.setItem("removeLimitbool", removeLimitBool);

    }

    $(".resp-tabs>div").click(function () {
        $(".resp-tabs>div").removeClass("active")
        $(this).addClass("active");
        var sId = $(this).attr("id")
        $(".rpTabSection").hide();
        $("#" + sId + "-section").show()

    })



    $("#txtChangeLimitPwd").keyup(function () {
        checkDepositLimitPwd();
    });


    $("#changeLimitBtn").click(function () {
        $(this).hide()
        $("#currentSetLimit").hide()
        $("#changeCurrentLimit").show()
        $("#changeCurrentLimit .actionRow").show()
        $(".24h").addClass("active")
    });

    $("#editLimitBtn").click(function () {
        $("#realityCheckConfirmationModal").modal("show")
        countDownTimer();
    })

    $("#editLimitConfirm").click(function () {
        countEdit++;
        $("#txtLimit").val("")
        $("#txtChangeLimitPwd").val("")
        $("#currentSetLimit").hide()
        $("#realityCheckConfirmationModal").modal("hide")
        $("#changeCurrentLimit").show()
        $("#editLimitActionRow").hide()
        $


    })

    $(".changeLimitSubmitBtn").click(function () {
        $step1Bool = checkDpLimitAmount();
        $step2Bool = checkDepositLimitPwd();
        var amt = $("#txtLimit").val().substring(4)
        var decimalAmt = parseFloat(amt).toFixed(2)
        // var amt = $("#txtLimit").val(parseFloat($(this).val()).toFixed(2))

        if ($step1Bool && $step2Bool) {
            $("#limitChangeConfirmationModal").modal("show");
            // $("#requestedDpDays").html("").append(days)
            $("#requestedDpAmt").html("").append("MYR " + decimalAmt);
            countDownTimer();

            $("#dpLimitConfirm").click(function () {

                $("#limitChangeConfirmationModal").modal("hide");
                $("#changeCurrentLimit").hide()
                $("#currentSetLimit").show()
                $("#changeLimitBtn").hide()
                $("#editLimitActionRow").css("display", "flex")
                // $("#changeLimitBtn").addClass("disabled");
                $("#deposit-limit-section .limitCountDown").show()

                $("#txtCurrentDepositLimit").css("font-weight", "bolder")
                if (countEdit < 1) {
                    $("#txtCurrentDepositLimit").attr("data-prev-value", amt)
                    $("#txtCurrentDepositLimit").attr("value", "MYR " + amt)


                }
                if (countEdit >= 1) {
                    $("#txtCurrentDepositLimit").attr("data-prev-value", $("#txtCurrentDepositLimit").val().substring(4))
                    $("#editedLimitAmtAmt").html("").append("MYR " + decimalAmt);
                    var prevAmt = $("#txtCurrentDepositLimit").attr("data-prev-value")
                    $("#txtCurrentDepositLimit").attr("value", "MYR " + prevAmt)
                    $("#confirmLimitBtn").show()
                    $("#confirmLimitBtn").addClass("disabled")
                    $(".visitConfirm").show()
                    $(".toConfirmEdit").hide()
                    $("#editLimitActionRow").hide()

                    var editLimitBool = true;
                    sessionStorage.setItem("editLimitbool", editLimitBool);

                }
            })


        }

    });





    $("#changeRealityBtn").click(function () {
        $(this).hide();
        $(".currentRealitySet").hide()

        $("#reality-check-section .actionRow").show();
    })




    $("#txtRealityCheckPwd").keyup(function () {
        checkRealityLimitPwd()

    });

    $(".changeRealityCancelBtn").click(function () {
        $("#reality-check-section .actionRow").hide()
        $(".currentRealitySet").show()
        $("#changeRealityBtn").show()
    })


    $(".changeLimitCancelBtn").click(function () {
        $("#changeCurrentLimit").hide()
        $("#currentSetLimit").show()
        $("#changeLimitBtn").show()
        // $(".dpLimitOptions>div").removeClass("active");
        $(".24h").addClass("active")
    })


    $("input[data-type='currency']").on({
        keyup: function () {
            formatCurrency($(this));
            checkDpLimitAmount();
        }
    });


    $("#removeLimitBtn").click(function () {
        countDownTimer();
        $("#removeLimitModal").modal("show")
    })


    $("#removeLimitConfirm").click(function () {
        $("#removeLimitModal").modal("hide")
        $(".removeConfirm").show()
        $("#confirmLimitBtn").show()
        $("#confirmLimitBtn").addClass("disabled")
       
        $("#editLimitActionRow").hide()
      
        sessionStorage.setItem("editLimitbool", false);
        removeLimitBool = true
        sessionStorage.setItem("removeLimitbool", removeLimitBool);



    })


    var removeLimitBool = sessionStorage.getItem("removeLimitbool");
    if (removeLimitBool == "true") {
        $(".button-selector").removeClass("active")
        $("#responsibleGamingBtn").addClass("active")
        
        $("#txtCurrentDepositLimit").attr("value", "MYR 2000")
        $("#txtCurrentDepositLimit").css("font-weight", "bolder")
        $(".tabSectionContent").hide();
        $("#responsibleGamingSection").show();
        $(".toConfirmDelete").show()
        $("#changeLimitBtn").hide()
        $("#confirmLimitBtn").show()
        $("#confirmLimitBtn").removeClass("disabled")

        $("#confirmLimitBtn").click(function () {
            $("#txtCurrentDepositLimit").attr("value", "" )
            $(".confirmLimitCondText").hide();
            $("#changeLimitBtn").show()
        })

    }

    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "")
    }


    function formatCurrency(input, blur) {
        var input_val = input.val();
        if (input_val === "") {
            return;
        }
        var original_len = input_val.length;
        var caret_pos = input.prop("selectionStart");
        input_val = formatNumber(input_val);
        input_val = "MYR " + input_val;
        input.val(input_val);
        var updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours()
    var min = today.getMinutes()
    // today = mm + '/' + dd + '/' + yyyy;
    $("#lastChangeddateTime").html("").append(dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' + min + ' (GMT +8)')




});