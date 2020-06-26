//var SYSTEM_VERSION = "1.7.8";
var SYSTEM_VERSION = Math.random();
var SYSTEM_STANDBY = 15;
var SYSTEM_COUNT_TIMEOUT = 20;
var _MAX_ORDER_VOLUME_HNX = 1000000;
var _MAX_ORDER_VOLUME_HSX = 500000;
var SYSTEM_TIMEOUT = 60;
var _ShowAlert = false;
var _CountTimeOut = 0;
var _Standby = 0;
var _TimeOut = 0;


var Const = {
    LIVEBOARD_MAX_ROW: 50
}



//var pageList = [{ id: "1", name: "first" }, { id: "2", name: "second" }, { id: "3", name: "third" }, { id: "4", name: "four" }];
var pageNum = [{ id: "10", name: "first" }, { id: "20", name: "second" }, { id: "30", name: "third" }, { id: "40", name: "four" }];

//var _orderStatus = [{ id: "P", name: "Chờ khớp" }, { id: "M", name: "Khớp" }, { id: "C", name: "Sửa" }, { id: "X", name: "Đã hủy" }];


var KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 46,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    CTRL: 17,
    SHIFT: 16,
    COMMA: 188,
    HOME: 36,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    BACKSPACE: 8,
    PLUS: 43,
    MINUS: 45,
    S: 83,
    B: 98,
    A: 97,
    C: 99,
    K: 107,
    L: 108,
    M: 109,
    O: 111,
    P: 112,
    T: 116,
    AA: 65,
    CC: 67,
    KK: 75,
    LL: 76,
    MM: 77,
    OO: 79,
    PP: 80,
    TT: 84
};


function RefreshImage() {
    d = new Date();
    $("#imgCaptcha").attr("src", "/Account/Captcha?" + d.getTime());
}


function Logout() {
    window.parent.location = global.LoginPath;
}

function Timeout() {
    _Standby = 0;
    _CountTimeOut = 0;
    _ShowAlert = false;
}

function hideNotice() {
    $("#divMessageAlert").hide();
}

function mouseOverHandler(obj) {
    $("#" + obj.id).children().addClass("trGrey");
}

function mouseOutHandler(obj) {
    $("#" + obj.id).children().removeClass("trGrey");
}

function ProcessHotKey() {
    if (!global.loadOne) {
        shortcut.add("Ctrl+s", function() {
            console.log("ban");
            loadOrderbyType('S', true);
            StockFocus();
            return false;
        });

        shortcut.add("Ctrl+b", function() {
            console.log("mua");
            loadOrderbyType('B', true);
            StockFocus();
            return false;
        });


        shortcut.add("Ctrl+l", function() {
            $('#btnDupUpdate').attr("disabled", false);
            $("#btnDupUpdate").css("background-color", "#ffffff");
            return false;
        });

        shortcut.add("Home", function() {
            $("#btnFirstPage").click();
        });

        shortcut.add("PageUp", function() {
            $("#btnPrePage").click();
        });

        shortcut.add("PageDown", function() {
            $("#btnNextPage").click();
        });
        global.loadOne = true;
    }
}


function setCurrentMenu() {
    var vHash = window.location.hash;
    $(".submenulevel1").removeClass('subactive');
    $("a[href$='" + vHash + "']:last").addClass('subactive');
}

function AccountFocus() {
    $('#txtAccount').select();
    $('#txtAccount').focus();
}

function StockFocus() {
    $('#txtStock').focus();
    $('#txtStock').select();
}


function PriceFocus() {
    $('#txtPrice').select();
    $('#txtPrice').focus();
}

function VolumeFocus() {
    $('#txtVolume').select();
    $('#txtVolume').focus();
}

function PinFocus() {
    $('#txtPin').select();
    $('#txtPin').focus();
}

function ConfirmPinFocus() {
    $('#txtConfirmPin').select();
    $('#txtConfirmPin').focus();
}

function JResetAllRowSelected(name) {
    jQuery("input[name=" + name + "]").each(function() {
        $("#LO" + this.value).removeClass("highlight");
    });
}


function JShowRowSelected(name) {
    jQuery("input[name=" + name + "]").each(function() {
        if ($('#' + this.id).is(':checked')) {
            $("#LO" + this.value).addClass("highlight");
        } else {
            $("#LO" + this.value).removeClass("highlight");

        }
    });
}

function JCheckAll(id, name) {
    //$('input:checkbox[name=' + name + ']').attr('checked', $('#' + id).is(':checked'));
    $('input:checkbox[name=' + name + ']').each(function() {
        if ($(this).prop("disabled") == false) {
            $(this).attr('checked', $('#' + id).is(':checked'));
        }
    });
    JShowRowSelected(name);
}



function JSelectBuySellOnclick(type) {
    var vBoolean = true;
    if (type == "BUY") {
        jQuery("input[name=chkOrder]").each(function() {

            if ($('#hdnOrder' + this.value).val().indexOf("B") >= 0) {
                $('#' + this.id).attr('checked', true);
            } else {
                $('#' + this.id).attr('checked', false);
                vBoolean = false;
            }
        });
    } else {
        jQuery("input[name=chkOrder]").each(function() {
            if ($('#hdnOrder' + this.value).val().indexOf("S") >= 0) {
                $('#' + this.id).attr('checked', true);
            } else {
                $('#' + this.id).attr('checked', false);
                vBoolean = false;
            }
        });
    }
    if (vBoolean)
        $('#chkAllOrder').attr('checked', true);
    else
        $('#chkAllOrder').attr('checked', false);
    JShowRowSelected("chkOrder");
}

function JItemOnclick(id, itemId, itemName) {
    if (!$('#' + itemId).is(':checked')) {
        $('#' + id).attr('checked', false);
        $('#LO' + $('#' + itemId).val()).toggleClass("highlight");
    } else {
        var vBoolean = true;
        jQuery("input[name=" + itemName + "]").each(function() {
            if (vBoolean && !$('#' + this.id).is(':checked')) {
                vBoolean = false;
            }
            if ($('#' + this.id).is(':checked')) {
                $("#LO" + this.value).addClass("highlight");
            } else {
                $("#LO" + this.value).removeClass("highlight");
            }
        });
        if (vBoolean) $('#' + id).attr('checked', true);
    }


}

function JGetAllCheckboxID(name) {
    var vList = "";
    jQuery("input[name=" + name + "]").each(function() {
        if ($('#' + this.id).is(':checked')) {
            vList = ListAppend(vList, jQuery(this).val(), ",");
        }
    });
    return vList;
}


// Lay phan tu dau tien cua danh sach
function ListGetFirst(the_list, the_separator) {
    if (the_list == "") return "";
    arr_value = the_list.split(the_separator);
    return arr_value[0];
}

// Kiem tra phan tu the_element co trong danh sach the_list hay khong
function ListHaveElement(the_list, the_element, the_separator) {
    try {
        if (the_list == "") return -1;
        if (the_list == the_element) return 1;
        if (the_list.indexOf(the_separator) == -1) return -1;
        arr_value = the_list.split(the_separator);
        for (var i = 0; i < arr_value.length; i++) {
            if (arr_value[i] == the_element) {
                return i;
            }
        }
    } catch (e) {; }
    return -1;
}
//Dem so phan tu trong danh sach
function ListCountElement(the_list, the_separator) {
    if (the_list == "") return -1;
    arr_value = the_list.split(the_separator);
    if (arr_value.length > 0) {
        return arr_value.length;
    }
    return -1;
}
// add a value to a list
function ListAppend(the_list, the_value, the_separator) {
    var list = the_list;
    the_value = the_value + ""; //Chuyen the_value sang kieu xau
    if (list == "") list = the_value;
    else if (the_value != "") list = list + the_separator + the_value;
    return list;
}

//**********************************************************************************************************************
// function replace(string,text,by) 
// Thay the ky tu trong mot chuoi
//**********************************************************************************************************************
function replace(pString, pText, by) {
    try {
        var strLength = pString.length,
            txtLength = pText.length;
        if ((strLength == 0) || (txtLength == 0)) return pString;
        var vIndex = pString.indexOf(pText);
        while (vIndex >= 0) {
            pString = pString.replace(pText, by);
            vIndex = pString.indexOf(pText);
        } //End While
    } catch (e) {}
    return pString;
}
//Chuyen tu xau sang so Float
function StringToFloat(pString) {
    pString = replace(pString, ",", "");
    //Convert sang so he so 10
    var vFloat = parseFloat(pString);
    if (isNaN(vFloat)) {
        return 0;
    } else {
        return vFloat;
    }
}
//Chuyen tu xau sang so Int
function StringToInt(pString) {
    pString = replace(pString, ",", "");
    //Convert sang so he so 10
    var vInt = parseInt(pString, 10);
    if (isNaN(vInt)) {
        return 0;
    } else {
        return vInt;
    }
}

function StringToDouble(pString) {
    pString = replace(pString, ",", "");
    //Convert sang so he so 10
    var vFloat = parseFloat(pString);
    if (isNaN(vFloat)) {
        return 0;
    } else {
        return vFloat;
    }
}

function DateDiffIndays(date1, date2) {
    dt1 = new Date(ddmmyyyy_to_mmddyyyy(date1));
    dt2 = new Date(ddmmyyyy_to_mmddyyyy(date2));
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

function mmddyyyy_to_ddmmyyyy(theDate) {
    strSeparator = ""
    if (theDate.indexOf("/") != -1) strSeparator = "/";
    if (theDate.indexOf("-") != -1) strSeparator = "-";
    if (theDate.indexOf(".") != -1) strSeparator = ".";
    if (strSeparator == "")
        return "";
    parts = theDate.split(strSeparator);
    day = parts[1];
    month = parts[0];
    year = parts[2];
    return day + strSeparator + month + strSeparator + year.substr(0, 4);

}

//Convert date from ddmmyyyy format to mmddyyyy fromat
function ddmmyyyy_to_mmddyyyy(theDate) {
    strSeparator = ""
    if (theDate.indexOf("/") != -1) strSeparator = "/";
    if (theDate.indexOf("-") != -1) strSeparator = "-";
    if (theDate.indexOf(".") != -1) strSeparator = ".";
    if (strSeparator == "")
        return "";
    parts = theDate.split(strSeparator);
    day = parts[0];
    month = parts[1];
    year = parts[2];
    return month + strSeparator + day + strSeparator + year.substr(0, 4);

}

function Round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

function formatNumber(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    //console.log(nStr + " : " + x1 + " : " + x2);
    return x1 + x2;
}

function CheckContainVietnamese(pValue) {
    var vValue = pValue;
    vValue = pValue.toLowerCase();
    vValue = vValue.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, '');
    vValue = vValue.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, '');
    vValue = vValue.replace(/í|ì|ỉ|ĩ|ị/gi, '');
    vValue = vValue.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, '');
    vValue = vValue.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, '');
    vValue = vValue.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, '');
    vValue = vValue.replace(/đ/gi, '');
    //console.log(vValue);
    if (vValue.length != pValue.length)
        return true;
    else
        return false;
}

function ReplaceContainVietnamese(pValue) {
    var vValue = pValue;
    vValue = pValue.toLowerCase();
    vValue = vValue.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    vValue = vValue.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    vValue = vValue.replace(/í|ì|ỉ|ĩ|ị/gi, 'i');
    vValue = vValue.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    vValue = vValue.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    vValue = vValue.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    vValue = vValue.replace(/đ/gi, 'd');
    return vValue;
}

"use strict";
var App = {};
App.Utils = {
    Template: {},

    detechValidationEngine: function(module, name) {
        $('#frmMain').validationEngine('detach');
    },
    validationEngine: function(module, name) {
        return $('#frmMain').validationEngine('validate');
    },
    getNumberPage: function(total, perpage) {
        var intNumberPage = 0;
        if (total % perpage == 0) {
            intNumberPage = Math.round(total / perpage);
        } else {
            intNumberPage = Math.round(total / perpage) + 1;
        }

        if (total == 0) intNumberPage = 1;
        return intNumberPage;
    },
    getPageFrom: function(currPage) {
        if (currPage > 4) {
            return parseInt(currPage) - 3;
        } else {
            return 2;
        }
    },
    getPageTo: function(currPage, total) {
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx" + currPage + " " + total);
        if (total < 6) return total - 2;
        if (currPage < total - 3) {
            if (currPage < 4)
                return parseInt(currPage) + 6;
            else
                return parseInt(currPage) + 3;
        } else {
            return total - 2;
        }

    },
    GetOrderStatusCode: function(pGroup, pStatus, pMatchVolume, pVolume) {
        if (pStatus.substring(pStatus.length - 1, pStatus.length) == "M") {
            return "MATCH_FULL";
        }
        if (pStatus == "PMC" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
            return "MATCH_PARTIAL";
        }
        if (pStatus == "PMC" && StringToInt(pMatchVolume) == StringToInt(pVolume)) {
            return "MATCH_FULL";
        }
        if (pStatus == "PMX" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
            return "MATCH_PARTIAL_CANCELED";
        }
        if (pStatus == "PM" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
            return "MATCH_PARTIAL";
        }
        if (pStatus == "PM") {
            return "MATCH_FULL";
        }
        if (pStatus == "PW") {
            return "MATCH_PENDING";
        }
        if (pStatus == "PC") {
            return "MATCH_PENDING";
        }
        if (pStatus.substring(pStatus.length - 1, pStatus.length) == "X") {
            return "MATCH_CANCELED";
        }
        if (pStatus == "P") {
            return "MATCH_PENDING";
        }
        if (pStatus.substring(pStatus.length - 1, pStatus.length) == "C") {
            return "MATCH_PENDING";
        }
        return pStatus;
    },

    completeUI: function() {
        //SetupGridButton();        
        console.log("CompleteUI");
        $(".tablist").tabs();
        $(".dropdown-toggle").dropdown("toggle");
        $(".tablist").removeClass("ui-widget-content");
        // datetime
        $(".datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+50',
            dateFormat: 'dd/mm/yy'
        });
        $(".fromDate").datepicker("setDate", -7);
        $(".toDate").datepicker("setDate", new Date());
        $(".toYesterday").datepicker("setDate", -1);


        //$('.formatnum').mask("#,##0", { reverse: true });
        //$('.formatnum').mask('000,000,000,000,000', { reverse: true });
        $ //('.datepicker').mask("00/00/0000", { placeholder: "__/__/____" });
        //$('.formatnum').inputmask("99-9999999");  //static mask
        $('.formatnum').inputmask({ alias: "decimal", groupSeparator: ",", autoGroup: true });
        $('.datepicker').inputmask("d/m/y", { clearIncomplete: true });
        // binds form submission and fields to the validation engine       
        $('#frmMain').validationEngine('detach');
        $("#frmMain").validationEngine({ scroll: false, showOneMessage: true, promptPosition: 'topLeft' });

        $('.mytooltip').tooltip({ html: true });


        //Tao danh sach tai khoan
        var listAccount = new Array();
        //$(".listAccount").empty();
        //$(".listAccount").append(new Option("---Chọn---", ""));
        //console.log("tong so account:" + global.listAccount.length);
        //$.each(global.listAccount, function (index, itemData) {
        //    $(".listAccount").append(new Option(itemData.accCode, itemData.accCode));
        //});

        $.each(global.listAccount, function(index, itemData) {
            var item = { value: itemData.accCode, name: itemData.accName, accType: itemData.accType };
            listAccount.push(item);
        });

        $(".listAccount").autocomplete({
            minLength: 0,
            source: listAccount,
            autoSelect: true,
            autoFocus: true,
            create: function() {
                $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                    return $('<li>')
                        .append("<a><b>" + item.value + "</b> - " + item.name + " - <b>" + item.accType + "</b></a>")
                        .appendTo(ul);
                };
            },
            select: function(event, ui) {
                $(this).val(ui.item.value);
                //StockFocus();
                return false;
            },
            open: function(event, ui) {
                $(this).autocomplete("widget").css({
                    "width": 400
                });
            }
        });
        //alert($.cookie("DefaultAccount"));

        $('#chkRememberPin').prop('checked', $.cookie('RememberPin') == 'true');
        /*
        //$(".stockprice").inputmask("(999[.9])|(99[.9])|(9[.9])|(ATO)|(ATC)|(MP)|(MTL)", {
        //Sua lai cho nhap sau dau phay 2 chu so
        $(".stockprice").inputmask("(999[.99])|(99[.99])|(9[.99])|(ATO)|(ATC)|(MP)|(MTL)", {
            definitions: {
                "A": {
                    validator: "[aA]",
                    cardinality: 1,
                    casing: "upper"
                },
                "T": {
                    validator: "[tT]",
                    cardinality: 1,
                    casing: "upper"
                },
                "O": {
                    validator: "[oO]",
                    cardinality: 1,
                    casing: "upper"
                },
                "C": {
                    validator: "[cC]",
                    cardinality: 1,
                    casing: "upper"
                },
                "M": {
                    validator: "[mM]",
                    cardinality: 1,
                    casing: "upper"
                },
                "P": {
                    validator: "[pP]",
                    cardinality: 1,
                    casing: "upper"
                },
                "L": {
                    validator: "[lL]",
                    cardinality: 1,
                    casing: "upper"
                }
            }
        });
        */
        $(".stockprice").autocomplete({
            minLength: 1,
            autoSelect: true,
            autoFocus: true,
            source: ["ATO", "ATC", "MP", "MTL", "MAK", "MOK"],
            source: function(request, response) {
                var matcher = new RegExp("\^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                var stockExchange = $("#txtStock").attr("exchange");
                var rep = new Array(); // response array
                var arrOrder = new Array();
                switch (stockExchange) {
                    case 'HA':
                        arrOrder = ["MTL", "MAK", "MOK", "ATC"];
                        break;
                    case 'HO':
                        arrOrder = ["ATO", "MP", "ATC"];
                        break;
                    case 'UP':
                        arrOrder = [];
                        break;
                    case 'INDEX':
                        arrOrder = ["ATO", "MTL", "MAK", "MOK", "ATC"];
                        break;
                    case 'BOND':
                        arrOrder = ["ATO", "MTL", "MAK", "MOK", "ATC"];
                        break;
                    case 'BONDL':
                        arrOrder = ["ATO", "MTL", "MAK", "MOK", "ATC"];
                        break;
                    default:
                        arrOrder = [];
                }
                for (var i = 0; i < arrOrder.length; i++) {
                    var value = arrOrder[i];
                    if (arrOrder[i] && (!request.term || matcher.test(value)))
                    // add element to result array
                        rep.push({
                        name: value,
                        value: value
                    });

                }
                // send response
                response(rep);
            },
            create: function() {
                $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                    return $('<li>')
                        .append("<a><b>" + item.value + "</b>" + "</a>")
                        .appendTo(ul);
                };
            }
        }).bind('focus', function() {
            if (!$(this).val().trim()) {
                //$(this).keydown();
            }
        });


        $(".stocklist").autocomplete({
            minLength: 0,
            autoSelect: false,
            autoFocus: true,
            delay: 0,
            create: function() {
                $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                    return $('<li>')
                        .append("<a><b>" + item.value + "</b> - " + item.name + " - " + item.exchange + "</a>")
                        .appendTo(ul);
                };
            },
            source: function(request, response) {
                var matcherbegin = new RegExp("\^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                var rep = new Array(); // response array
                var maxRepSize = 10; // maximum response size  
                // simple loop for the options
                for (var i = 0; i < _listStock.length; i++) {
                    var value = _listStock[i].value;
                    if (_listStock[i].sharetype == "F") {
                        if (value && (!request.term || matcher.test(value)))
                        // add element to result array
                            rep.push({
                            name: _listStock[i].name, // no more bold
                            value: value,
                            exchange: _listStock[i].exchange,
                            option: _listStock[i]
                        });
                    } else {
                        if (value && (!request.term || matcherbegin.test(value)))
                        // add element to result array
                            rep.push({
                            name: _listStock[i].name, // no more bold
                            value: value,
                            exchange: _listStock[i].exchange,
                            option: _listStock[i]
                        });
                    }

                    if (rep.length > maxRepSize) {
                        /*
                        rep.push({
                            name: "........",
                            value: "maxRepSizeReached",
                            exchange: "",
                            option: ""
                        });
                        */
                        break;
                    }
                }
                // send response
                response(rep);
            },

            select: function(event, ui) {
                $(this).val(ui.item.value);
                $("#orderFullName").html(ui.item.name + ' - ' + ui.item.exchange);
                PriceFocus();
                return false;
            },
            open: function(event, ui) {
                $(this).autocomplete("widget").css({
                    "width": 400
                });
            }
        });


        $('.notacceptviet').on('focusout', function() {
            var vValue = $(this).val();
            var vId = $(this).prop('id');
            if (CheckContainVietnamese(vValue)) {
                jAlert("Quý khách hàng vui lòng sử dụng tiếng việt không dấu", _MESSAGE_TITLE, function() {
                    $("#" + vId).select();
                    $("#" + vId).focus()
                });
            }
        });

        setCurrentMenu();
        ProcessHotKey();

    },
    initAccount: function() {
        $('#txtUserID:first').val(global.user);
        $('#txtAccount:first').val(global.defaultAcc);
        $('#txtAccountFilter').val(global.defaultAcc);
        //$('#txtOrderAccountFilter').val(global.defaultAcc);

    },
    changeStockList: function(pAccount) {
        var vType = "";
        for (var i = 0; i < global.listAccount.length; i++) {
            if (global.listAccount[i].accCode == pAccount) {
                vType = global.listAccount[i].type;
            }
        }
        switch (vType) {
            case 'D':
                _listStock = listStockPs;
                break;
            case 'N':
                _listStock = listStock;
                break;
            case 'M':
                _listStock = listStock;
                break;
        }
        //$(".stocklist").autocomplete('option', { source: _listStock });
    },
    getLang: function(pLang) {
        switch (pLang) {
            case 'vi-VN':
                return 'vi';
                break;
            case 'en-US':
                return 'en';
                break;
            default:
                return 'vi';
        }
    },
    checkStock: function(code) {
        for (var i = 0; i < _listStock.length; i++) {
            if (_listStock[i].value.toUpperCase() == code.toUpperCase()) {
                //alert(_listStock[i].label);
                //$("#tdStockName").html(_listStock[i].label);
                return true;
            }
        }
        return false;
    },
    StringSplitVol: function(value, delimeter) {
        if (typeof(value) != "undefined" && value != null) {
            var vValue = value + "";
            var item = vValue.split(delimeter)[1];
            if (item == "0" || item == "0.0" || item == "0.00") item = "-";
            return formatNumber(item);
        } else {
            return "";
        }
    },
    StringSplitPrice: function(value, delimeter) {
        if (typeof(value) != "undefined" && value != null) {
            var vValue = value + "";
            var item = vValue.split(delimeter)[0];
            if (item == "0" || item == "0.0" || item == "0.00") item = "-";
            return item;
        } else {
            return "";
        }
    },
    FormatPrice: function(value) {
        if (value != "ATO" && value != "ATC") {
            if (StringToFloat(value) == 0)
                return "";
            else
                return formatNumber(value);
        } else {
            return value;
        }

    },
    FormatVol: function(value) {
        if (typeof(value) == "undefined" || value == null || value == "0")
            return "";
        else
            return formatNumber(value);
    },
    FormatNum: function(value) {
        value = Math.round(StringToFloat(value) * 100) / 100;
        if (typeof(value) == "undefined" || value == null || value == "0")
            return "";
        else
            return formatNumber(value);
    },
    GetClass: function(obj, pPrice) {
        if (pPrice != "ATO" && pPrice != "ATC") {
            var ceil = StringToFloat(obj.c);
            var floor = StringToFloat(obj.f);
            var everage = StringToFloat(obj.r);
            var price = StringToFloat(pPrice);
            var vClass = "";
            if (price < ceil && price > everage) vClass = "green";
            if (price < everage && price > floor) vClass = "red";
            if (price == ceil) vClass = "violet";
            if (price == floor) vClass = "cyan";
            if (price == everage) vClass = "yellow";
            if (price == 0) vClass = "yellow";
            //console.log("ceil:" + obj.c + " floor:" + obj.f + " everage:" + everage + " price:" + price);
            //Truong hop cp moi len san
            if (everage == 0)
                vClass = "green";
        } else {
            vClass = "yellow";
        }
        return vClass;
    },
    GetClassPs: function(obj, pPrice) {
        if (pPrice != "ATO" && pPrice != "ATC") {
            var ceil = StringToFloat(obj.ceilPrice);
            var floor = StringToFloat(obj.floorPrice);
            var everage = StringToFloat(obj.refPrice);
            var price = StringToFloat(pPrice);
            var vClass = "";
            if (price < ceil && price > everage) vClass = "green";
            if (price < everage && price > floor) vClass = "red";
            if (price == ceil) vClass = "violet";
            if (price == floor) vClass = "cyan";
            if (price == everage) vClass = "yellow";
            if (price == 0) vClass = "yellow";
            //console.log("ceil:" + ceil + " floor:" + floor + " everage:" + everage + " price:" + price);
            //Truong hop cp moi len san
            if (everage == 0)
                vClass = "green";
        } else {
            vClass = "yellow";
        }
        return vClass;
    },
    getTemplate: function(module, name) {
        return '/Modules/' + module + '/Template/' + name + '.tmpl.html?v=' + SYSTEM_VERSION;
    },
    getLanguage: function(module, name) {
        return '/Modules/' + module + '/lang/' + name + '.' + global.lang + '.js?v=' + SYSTEM_VERSION;
    },
    getScript: function(module, name) {
        return '/Modules/' + module + '/Js/' + name + '.js?v=' + SYSTEM_VERSION;
    },
    renderTemplate: function(item) {
        var deferred = $.Deferred();
        var file = App.Utils.getTemplate(item.Module, item.Name);
        item.Modal.glang = CONST_GLOBAL;
        item.Modal.global = global;
        $(item.Selector).html("");
        $.when($.get(file))
            .done(function(tmplData) {
                $.templates({ tmpl: tmplData });
                //console.log(tmplData);
                if (!item.Append) {
                    $(item.Selector).html($.render.tmpl(item.Modal));
                    //$.templates.tmpl.link(item.Selector, item.Modal);
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                } else {
                    $(item.Selector).append($.render.tmpl(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);                    
                    //$.templates.tmpl.link(item.Selector, item.Modal);
                }

                deferred.resolve();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("LoadTemplate error." + exception);
                deferred.reject();
            });
        return deferred.promise();
    },
    renderLinkTemplate: function(item) {
        var deferred = $.Deferred();
        var file = App.Utils.getTemplate(item.Module, item.Name);
        item.Modal.glang = CONST_GLOBAL;
        item.Modal.global = global;
        //$(item.Selector).html("");
        //console.log($(item.Selector).html());
        $.when($.get(file))
            .done(function(tmplData) {
                $.templates({ tmpl: tmplData, allowCode: true });
                //console.log(tmplData);
                if (!item.Append) {
                    //$(item.Selector).html($.render.tmpl(item.Modal));
                    $.templates.tmpl.link(item.Selector, item.Modal);
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                } else {
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    //$(item.Selector).append($.render.tmpl(item.Modal));
                    $.templates.tmpl.link(item.Selector, item.Modal);
                }

                deferred.resolve();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("LoadTemplate error." + exception);
                deferred.reject();
            });
        return deferred.promise();
    },
    renderPaging: function(item) {
        var deferred = $.Deferred();
        var file = App.Utils.getTemplate(item.Module, "Paging");
        item.Modal.glang = CONST_GLOBAL;
        item.Modal.global = global;
        $(item.Selector).html("");
        $.when($.get(file))
            .done(function(tmplData) {
                $.templates({ tmpl: tmplData });
                //console.log(tmplData);
                if (!item.Append) {
                    //$(item.Selector).html($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                } else {

                    //$(item.Selector).append($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                }

                deferred.resolve();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("LoadTemplate error." + exception);
                deferred.reject();
            });
        return deferred.promise();
    },
    renderPagingsm: function(item) {
        var deferred = $.Deferred();
        var file = App.Utils.getTemplate(item.Module, "Pagingsm");
        item.Modal.glang = CONST_GLOBAL;
        item.Modal.global = global;
        $(item.Selector).html("");
        $.when($.get(file))
            .done(function(tmplData) {
                $.templates({ tmpl: tmplData });
                //console.log(tmplData);
                if (!item.Append) {
                    //$(item.Selector).html($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                } else {

                    //$(item.Selector).append($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                }

                deferred.resolve();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("LoadTemplate error." + exception);
                deferred.reject();
            });
        return deferred.promise();
    },
    renderPagingNum: function(item) {
        var deferred = $.Deferred();
        var file = App.Utils.getTemplate(item.Module, "PagingNum");
        item.Modal.glang = CONST_GLOBAL;
        $(item.Selector).html("");
        $.when($.get(file))
            .done(function(tmplData) {
                $.templates({ tmpl: tmplData });
                //console.log(tmplData);
                if (!item.Append) {
                    //$(item.Selector).html($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                } else {

                    //$(item.Selector).append($.render.tmpl(item.Modal));
                    //$(item.Selector).html($.templates.tmpl.render(item.Modal));
                    //$.templates({ tmpl: tmplData }).link(item.Selector, item.Modal);
                    $.templates.tmpl.link(item.Selector, item.Modal);
                }

                deferred.resolve();
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("LoadTemplate error." + exception);
                deferred.reject();
            });
        return deferred.promise();
    }
};

(function($) {
    $.views.converters({
        StringSplitColor: function(value) {
            if (typeof(value) != "undefined" && vValue != "") {
                var vValue = value + "";
                return vValue.split("|")[2];
            } else
                return "";
        },
        setBit: function(value) {
            // "Convert Back": If checked, set this bit on the data,
            // or if unchecked, unset this bit on the data
            var mask = 1 << this.linkCtx.elem.getAttribute("data-bit"),
                // Shift first bit, 0, 1 or 2 bits to the left,
                // to create a mask
                dataValue = this.tagCtx.args[0];
            // Take the current data value
            return value ? (dataValue | mask) : (dataValue & ~mask);
            // Use the mask to set or unset that bit on the data,
            // and return the modified value
        },
        getBit: function(value) {
            // "Convert": Get the bit from the data,
            // and check or uncheck the checkbox
            return (value >>
                this.linkCtx.elem.getAttribute("data-bit") & 1) === 1;
            // Shift 0, 1 or 2 bits to the right,
            // and see if the first bit is set.
        }
    });
})(this.jQuery);



(function($) {
    "use strict";
    $.views.helpers({

        BreakLine: function() {
            return "</tr><tr><td>aaa</td>";
        },
        GeneratePageList: function(currPage, total) {
            console.log(currPage + " xxxxxxxxxxxxxxxxxxxx " + total)
            var COUNT_PAGE = 6;
            var vHtml = "";
            var vClass = "normal";
            var vBegin = 2;
            var vEnd = 8;
            if (currPage == 1)
                vClass = "normal active";
            vHtml = vHtml + '<a class="' + vClass + '" onclick=" GotoPage(1)">1</a>';
            if (currPage >= 6) {
                vHtml = vHtml + '<a>...</a>';
            }
            if (total > 2) {
                if (total < COUNT_PAGE + 2) {
                    vBegin = 2;
                    vEnd = total - 1;
                } else {
                    if (currPage < COUNT_PAGE) {
                        vBegin = 2;
                        vEnd = vBegin + COUNT_PAGE;
                    } else {
                        vBegin = currPage - (COUNT_PAGE / 2);
                        vEnd = currPage + (COUNT_PAGE / 2);
                    }
                    if (currPage > total - COUNT_PAGE) {
                        vBegin = total - COUNT_PAGE;
                        vEnd = total - 1;
                    }
                }
                for (var i = vBegin; i < vEnd; i++) {
                    if (currPage == i)
                        vClass = "normal active";
                    else
                        vClass = "normal";
                    //if ((i > currPage - 3 && i < currPage + 3) ) {
                    vHtml = vHtml + '<a class="' + vClass + '" onclick=" GotoPage(' + i + ')">' + i + '</a>';
                    //}
                }
                if (currPage == total - 1)
                    vClass = "normal active";
                if (total - currPage > COUNT_PAGE + 1) {
                    vHtml = vHtml + '<a>...</a>';
                }
                if (total > COUNT_PAGE + 1) {
                    vHtml = vHtml + '<a class="' + vClass + '" onclick=" GotoPage(' + (total - 1) + ')">' + (total - 1) + '</a>';
                }


            }
            return vHtml;
        },
        SetPageSelected: function(value, selected) {
            return " '" + value + "' '" + selegetPageTocted + "' active";
            if (value == selected)
                return " 'value' 'selected' active";
            else
                return "";
        },
        RowEvenOdd: function(index) {
            var remainder = index % 2;
            var vClass = (remainder == 0 ? 'even' : 'odd');
            return vClass;
        },
        GetOrderGroupName: function(pGroup) {

            switch (pGroup) {
                case 'FU':
                    return CONST_GLOBAL.ORDER_TYPE_FU;
                case 'EQ':
                    return CONST_GLOBAL.ORDER_TYPE_EQ;
                default:
                    return pGroup;
            }

        },
        GetCustomerType: function(pStatus) {
            switch (pStatus) {
                case 'CA_NHAN':
                    return "Cá nhân";
                case 'TO_CHUC':
                    return "Tổ chức";
                default:
                    return pStatus;
            }

        },
        GetAccountType: function(pStatus) {
            switch (pStatus) {
                case 'YES':
                    return "NONETED";
                case 'NO':
                    return "NETTED";
                default:
                    return pStatus;
            }

        },
        GetOrderChannelName: function(pGroup, pChannel) {

            switch (pChannel) {
                case 'I':
                    return "Internet";
                case 'W':
                    return "Webtrade";
                case 'H':
                    return "Hometrade";
                case 'M':
                    return "Mobile";
                case 'D':
                    return "Broker";
                case 'C':
                    return "CallCenter";
                default:
                    return pChannel;
            }

        },
        GetConfirmName: function(pStatus) {
            switch (pStatus) {
                case 'DA_XAC_NHAN':
                    return CONST_GLOBAL.ORDER_CONFIRMED_STATUS;
                case 'null':
                    return CONST_GLOBAL.ORDER_UNCONFIRM_STATUS;
                default:
                    return CONST_GLOBAL.ORDER_UNCONFIRM_STATUS;
            }

        },
        GetOrderCondtionStatusName: function(pStatus) {
            switch (pStatus) {
                case '0':
                    return CONST_GLOBAL.ORDER_STATUS_UNACTIVE;
                case '1':
                    return CONST_GLOBAL.ORDER_STATUS_ACTIVEED;
                default:
                    return pStatus;
            }

        },
        GetOrderStatusName: function(pGroup, pStatus, pMatchVolume, pVolume, pQuote) {
            //console.log("pStatus:",pStatus, "pMatchVolume:",pMatchVolume, "pVolume:",pVolume,"pQuote:",pQuote);
            //Khop mot phan
            if (pStatus == "PMC" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/semi-matched.png'>" + CONST_GLOBAL.ORDER_MATCH_PARTIAL;
            }
            //Khop toan bo
            if (pStatus == "PMC" && StringToInt(pMatchVolume) == StringToInt(pVolume)) {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>" + CONST_GLOBAL.ORDER_MATCH_FULL;
            }
            ///Khop 1 phan da huy
            if (pStatus == "PMX" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/semi-matched_cancelled.png'>" + CONST_GLOBAL.ORDER_MATCH_PARTIAL_CANCELED;
            }
            //Cho sua
            if (pStatus == "PCW") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING_EDIT;
            }

            //Khop mot phan
            if (pStatus == "PM" && StringToInt(pMatchVolume) < StringToInt(pVolume)) {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/semi-matched.png'>" + CONST_GLOBAL.ORDER_MATCH_PARTIAL;
            }
            //Khop toan bo
            if (pStatus == "PM") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>" + CONST_GLOBAL.ORDER_MATCH_FULL;
            }
            //Cho khop
            if (pStatus == "P") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING;
            }
            //Cho huy
            if (pStatus == "PW") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING_CANCEL;
            }
            //Cho sua
            if (pStatus == "PC") {
                //Neu chua len so thi lenh cho khop, con khong cho sua
                if (pQuote == "Y")
                    return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING;
                else
                    return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING_EDIT;
            }
            //Da huy
            if (pStatus.substring(pStatus.length - 1, pStatus.length) == "X") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/cancelled.png'>" + CONST_GLOBAL.ORDER_MATCH_CANCELED;
            }
            //Khop toan bo
            if (pStatus.substring(pStatus.length - 1, pStatus.length) == "M") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>" + CONST_GLOBAL.ORDER_MATCH_FULL;
            }
            //Cho khop
            if (pStatus.substring(pStatus.length - 1, pStatus.length) == "C") {
                return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>" + CONST_GLOBAL.ORDER_MATCH_PENDING;
            }
            return pStatus;
            /*
            switch (pStatus) {
                case 'P': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/pending.png'>&nbsp;Chờ khớp";
                case 'M': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>&nbsp;Khớp";
                case 'PM': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>&nbsp;Khớp";
                case 'PCM': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/matched.png'>&nbsp;Khớp";
                case 'PMX': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/semi-matched.png'>&nbsp;Khớp 1 phần";
                case 'PX': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/cancelled.png'>&nbsp;Hủy";
                case 'PWX': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/cancelled.png'>&nbsp;Hủy";
                case 'PXXX': return "<img style='vertical-align: middle;' src='Content/vpbs/Images/orderstatus/cancelled.png'>&nbsp;Hủy";
                default: return pStatus;
            }
            */
        },
        GetAccountBeneficiaryType: function(pStatus) {
            switch (pStatus) {
                case 'OTHER':
                case 'BANK':
                    return "Tài khoản ngân hàng";
                case 'INNER':
                    return "Tài khoản chứng khoán";
                default:
                    return pStatus;
            }

        },
        GetFeeType: function(pStatus) {
            switch (pStatus) {
                case 0:
                    return CONST_GLOBAL.FEE_TYPE_TRANSFER_PAY_LABEL;
                case 1:
                    return CONST_GLOBAL.FEE_TYPE_RECEIVE_PAY_LABEL;
                default:
                    return '';
            }
        },
        GetOrderSideName: function(pGroup, pSide) {
            if (pGroup == "FU") {
                switch (pSide) {
                    case 'B':
                        return "LONG";
                    case 'S':
                        return "SHORT";
                    default:
                        return pSide;
                }
            } else {
                switch (pSide) {
                    case 'B':
                        return CONST_GLOBAL.ORDER_BUY;
                    case 'S':
                        return CONST_GLOBAL.ORDER_SELL;
                    default:
                        return pSide;
                }
            }

        },
        GetIndexName: function(pTradingCenter) {
            switch (pTradingCenter) {
                case '10':
                    return "VN";
                case '22':
                    return "VN30";
                case '02':
                    return "HNX";
                case '21':
                    return "HN30";
                case '03':
                    return "UP";
                default:
                    return '';
            }
        },
        GetTradingCenterName: function(pTradingCenter) {
            switch (pTradingCenter) {
                case '10':
                    return "HSX";
                case '02':
                    return "HNX";
                case '03':
                    return "UPCOM";
                case '04':
                    return "PS";
                case '11':
                    return "VN30";
                case '12':
                    return "HNX30";
                default:
                    return pTradingCenter;
            }
        },
        GetStatusName: function(pStatus) {
            switch (pStatus) {
                case 'P':
                    return CONST_GLOBAL.STATUS_P_ORDER;
                case 'O':
                    return CONST_GLOBAL.STATUS_O_ORDER;
                case 'A':
                    return CONST_GLOBAL.STATUS_A_ORDER;
                case 'C':
                    return CONST_GLOBAL.STATUS_C_ORDER;
                case 'K':
                    return CONST_GLOBAL.STATUS_K_ORDER;
                default:
                    return pStatus;
            }
        },
        GetStatusTrading: function(pStatus) {
            switch (pStatus) {
                case 'P':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'O':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'A':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'C':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'K':
                    return CONST_GLOBAL.STATUS_NOT_ALLOW_ORDER;
                case 'Opening Auction':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Call Auction Opening':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Available':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Open':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Closing Auction':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Call Auction Closing':
                    return CONST_GLOBAL.STATUS_ALLOW_ORDER;
                case 'Close':
                    return CONST_GLOBAL.STATUS_NOT_ALLOW_ORDER;
                default:
                    return CONST_GLOBAL.STATUS_NOT_ALLOW_ORDER;
            }
        },
        GetIndexImage: function(pOpen, pCurrent) {
            //console.log("------cuc cuc" + pOpen + "xxx" + pCurrent);
            if (pCurrent > pOpen)
                return "/Images/up_market.png";
            if (pCurrent == pOpen)
                return "/Images/nochange_market.png";
            if (pCurrent < pOpen)
                return "/Images/down_market.png";
        },
        GetIndexClass: function(pOpen, pCurrent) {
            if (pCurrent > pOpen)
                return "advances";
            if (pCurrent == pOpen)
                return "no_change";
            if (pCurrent < pOpen)
                return "declines";
        },
        GetChangeImage: function(pChange) {
            if (pChange > 0)
                return "▲";
            if (pChange == 0)
                return "■";
            if (pChange < 0)
                return "▼";
        },
        GetChangeValue: function(value1, value2) {
            if (value2 == 0)
                return 0
            else
                return StringToFloat(value2) - StringToFloat(value1);
        },
        ConCat: function(value1, value2) {
            return value1 + value2;
        },
        StringSplit: function(value, delimeter) {
            if (typeof(value) != "undefined" && value != null) {
                var item = value.split(delimeter);
                return item;
            } else {
                return "";
            }
        },
        StringSplitVol: function(value, delimeter) {
            if (typeof(value) != "undefined" && value != null) {
                var vValue = value + "";
                var item = vValue.split(delimeter)[1];
                if (item == "0" || item == "0.0" || item == "0.00") item = "-";
                return formatNumber(item);
            } else {
                return "";
            }
        },
        StringSplitPrice: function(value, delimeter) {
            if (typeof(value) != "undefined" && value != null) {
                var vValue = value + "";
                var item = vValue.split(delimeter)[0];
                if (item == "0" || item == "0.0" || item == "0.00") item = "-";
                return item;
            } else {
                return "";
            }
        },
        StringSplitColor: function(value, delimeter) {
            if (typeof(value) != "undefined" && value != null) {
                var vValue = value + "";
                return vValue.split(delimeter)[2];
            } else {
                return "";
            }
        },
        FormatPrice: function(value) {
            if (value != "ATO" && value != "ATC") {
                if (value == "0" || value == "0.0" || value == "0.00")
                    return "";
                else
                    return formatNumber(value);
            } else {
                return value;
            }
        },
        FormatVol: function(value) {
            if (typeof(value) == "undefined" && value == null || value == "0" || value == "0.0" || value == "0.00")
                return "";
            else
                return formatNumber(value);
        },
        FormatNum: function(value) {
            value = Math.round(StringToFloat(value) * 100) / 100;
            return formatNumber(value);
        },
        FormatPercent: function(pValue) {
            var vValue = Math.round(pValue * 100);
            return vValue;
        },
        FormatString: function(value) {
            if (typeof(value) == "undefined" && value == null || value == "null")
                return "";
            else
                return value;
        },
        StringToFloat: function(pString) {
            pString = replace(pString, ",", "");
            //Convert sang so he so 10
            var vFloat = parseFloat(pString);
            if (isNaN(vFloat)) {
                return 0;
            } else {
                return vFloat;
            }
        },
        //Chuyen tu xau sang so Int
        StringToInt: function(pString) {
            pString = replace(pString, ",", "");
            //Convert sang so he so 10
            var vInt = parseInt(pString, 10);
            if (isNaN(vInt)) {
                return 0;
            } else {
                return vInt;
            }
        },
        SubStr: function(pValue, pStart, pLength) {
            var vValue = pValue + "";
            return vValue.substr(pStart, pLength);
        },
        GetClass: function(obj, pPrice) {
            if (pPrice != "ATO" && pPrice != "ATC") {
                var ceil = StringToFloat(obj.c);
                var floor = StringToFloat(obj.f);
                var everage = StringToFloat(obj.r);
                var price = StringToFloat(pPrice);
                var vClass = "";
                if (price < ceil && price > everage) vClass = "green";
                if (price < everage && price > floor) vClass = "red";
                if (price == ceil) vClass = "violet";
                if (price == floor) vClass = "white";
                if (price == everage) vClass = "yellow";
                if (price == 0) vClass = "yellow";
                //console.log("ceil:" + obj.c + " floor:" + obj.f + " everage:" + everage + " price:" + price);
                //Truong hop cp moi len san
                if (everage == 0)
                    vClass = "green";
            } else {
                vClass = "yellow";
            }
            return vClass;
        },
        GetClassPs: function(obj, pPrice) {
            if (pPrice != "ATO" && pPrice != "ATC") {
                var ceil = StringToFloat(obj.c);
                var floor = StringToFloat(obj.f);
                var everage = StringToFloat(obj.r);
                var price = StringToFloat(pPrice);
                var vClass = "";
                if (price < ceil && price > everage) vClass = "green";
                if (price < everage && price > floor) vClass = "red";
                if (price == ceil) vClass = "violet";
                if (price == floor) vClass = "white";
                if (price == everage) vClass = "yellow";
                if (price == 0) vClass = "yellow";
                //console.log("ceil:" + obj.c + " floor:" + obj.f + " everage:" + everage + " price:" + price);
                //Truong hop cp moi len san
                if (everage == 0)
                    vClass = "green";
            } else {
                vClass = "yellow";
            }
            return vClass;
        }
    });
})(this.jQuery);


$.views.converters({
    FormatNum: function(value) {
        value = Math.round(StringToFloat(value) * 100) / 100;
        return formatNumber(value);
    }

});

(function($) {
    "use strict";

    // An extended {{for}} tag: {{range}} inherits from {{for}}, and adds
    // support for iterating over a range (start to end) of items within an array,
    // or for iterating directly over integers from start integer to end integer

    $.views.tags({
        range: {
            // Inherit from {{for}} tag
            baseTag: "for",

            // Override the render method of {{for}}
            render: function(val) {
                var array = val,
                    start = this.tagCtx.props.start || 0,
                    end = this.tagCtx.props.end;

                if (start || end) {
                    if (!this.tagCtx.args.length) {
                        // No array argument passed from tag, so create a computed array of integers from start to end
                        array = [];
                        end = end || 0;
                        for (var i = start; i <= end; i++) {
                            array.push(i);
                        }
                    } else if ($.isArray(array)) {
                        // There is an array argument and start and end properties, so render using the array truncated to the chosen range
                        array = array.slice(start, end);
                    }
                }

                // Call the {{for}} baseTag render method
                return this.base(array);
            },

            // override onArrayChange of the {{for}} tag implementation
            onArrayChange: function(ev, eventArgs) {
                this.refresh();
            }
        }
    });

})(this.jQuery);


(function($) {
    $.fn.onEnter = function(func) {
        this.bind('keypress', function(e) {
            if (e.keyCode == 13) func.apply(this, [e]);
        });
        return this;
    };
})(jQuery);