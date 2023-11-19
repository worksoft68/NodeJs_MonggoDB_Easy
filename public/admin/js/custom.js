var optionsColumnsToDisplay=[];

// Create slug input // Lọc bỏ dấu, tạo link
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ *? /g, "-");
    str = str.replace(/--/g, "-");
    str = str.trim();
    return str;
}


$(document).ready(function () {
    var ckbAll = $(".cbAll");
    $.widget.bridge('uibutton', $.ui.button);

    // check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering"); //thêm thuộc tính name="ordering" trong đối tượng textbox có class là ordering
        } else {
            $(".ordering").removeAttr("name"); //xóa thuộc tính name trong đối tượng có class là ordering
        }
    });

    $("input[name=cid]").click(function () {// Khi click vào object có name = "cid"
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering"); // thêm name vào object có class ordering
        } else {
            $(this).parents("tr").find('.ordering').removeAttr("name");   // bỏ name vào khỏi object có class ordering
        }
    });

    // Nếu nhận biết control theo calss thì " # + Id form + .+ Tên class
    // VD change_form_action("#form-data-list .ClassName_slbAction", "#form-data-list","#btn-action");, ClassName_slbAction là tên class
    

    activeMenu();

    // Check all for bulk action
    $('#check-all').change(function () {
        var checkStatus = this.checked;
        $('#form-table input[name="checkbox[]"]').each(function () {
            this.checked = checkStatus;
        });
        showSelectedRowInBulkAction();
    });

   

    //====================================================================================================================================================================================================

//**********************************************************************************************
// Choose columns to display, save this list columns in localStorage,
// Call this function when clicking on configuration on each interface
//**********************************************************************************************
    
    $('.dropdown-menu a').on('click',function(event) { 
        var $target=$(event.currentTarget),
            val=$target.attr('data-value'),
            $inp=$target.find('input'),
            idx;
        if((idx=optionsColumnsToDisplay.indexOf(val))>-1) {
            optionsColumnsToDisplay.splice(idx,1);
            setTimeout(function() {$inp.prop('checked',false)},0);
        } else {
            optionsColumnsToDisplay.push(val);
            setTimeout(function() {$inp.prop('checked',true)},0);
        }
        $(event.target).blur();      
        chooseColumnsToDisplay(optionsColumnsToDisplay);
        return false;
    });
    //====================================================================================================================================================================================================
   
    // numberItemPerPage 
    $("#numberItemPerPage").change(function() {
        setNumberItemPerPage();
    });

});

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 5000,
    padding: '1rem',
});

function activeMenu() {
    let pathname = window.location.pathname;
    var controller = ''; // tim collection nào đang được truy cập
    var action = ''; // tìm hành động (menu con) đang muốn làm
    let arrPathname = pathname.split('/');
    //alert(arrPathname);
    if (arrPathname.length > 1) {
        controller = arrPathname[1];
    }
    if (arrPathname.length > 2) {
        action = arrPathname[2];
    }
    if (action == '')
        action = 'list';
// alert(action);
// alert(controller);

    // alert(controller);
    // alert(action);
    var $navLinkCurrentMenuItemLevel2 = $('.nav-sidebar > .nav-item > .nav-treeview > .nav-item >[data-active="' + action + '"]'); // tim đến thẻ a  [data-active="' + controller + '"]
    var lengthItemLevel2 = $navLinkCurrentMenuItemLevel2.length;  
    if(lengthItemLevel2 > 0){
        $navLinkCurrentMenuItemLevel2.addClass('active');// nếu có thì active lên
        
        var $liNavItem =  $navLinkCurrentMenuItemLevel2.parent(); // cha tag a
        let $ulNavTreeview = $liNavItem.parent();

        $ulNavTreeview.addClass('active');// nếu có tì active lên
        $ulNavTreeview.addClass('menu-open');// nếu có thì menu-open

        var $liNavItemLevel1 =  $ulNavTreeview.parent();
        $liNavItemLevel1.addClass('menu-open');
        var $navLinkLevel1 = $liNavItemLevel1.children(); 
        $navLinkLevel1.addClass('active');
    }
    else
    {
        var $navLinkCurrentMenuItemLevel1 = $('.nav-sidebar > .nav-item > [data-active="' + action + '"]'); // tim đến thẻ a  [data-active="' + controller + '"]
        var lengthItemLevel1 = $navLinkCurrentMenuItemLevel1.length;
        if(lengthItemLevel1>0){
            $navLinkCurrentMenuItemLevel1.addClass('active');// nếu có thì active lên
        }
    }
}
function confirmObj(text, icon, confirmText) {
    return {
        position: 'top',
        title: 'Notify!',
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: 'Hủy',
    };
}



function sortList(field, order) {
    $('input[name="sort_field"]').val(field);
    $('input[name="sort_order"]').val(order);
    let exceptParams = ['page', 'sort_field', 'sort_order'];
    let link = createLink(exceptParams);
    link += `sort_field=${field}&sort_order=${order}`;
    window.location.href = link;
}

function submitForm(link) {
    $('#admin-form').attr('action', link);
    $('#admin-form').submit();
}

function createLink(exceptParams) {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);
    let searchParamsEntries = searchParams.entries();

    let link = pathname + '?';
    for (let pair of searchParamsEntries) {
        if (exceptParams.indexOf(pair[0]) == -1) {
            link += `${pair[0]}=${pair[1]}&`;
        }
    }
    return link;
}

function showToast(type, action) {
    let message = '';
    switch (action) {
        case 'update':
            message = 'Cập nhật thành công!';
            break;
        case 'bulk-action-not-selected-action':
            message = 'Vui lòng chọn action cần thực hiện!';
            break;
        case 'bulk-action-not-selected-row':
            message = 'Vui lòng chọn ít nhất 1 dòng dữ liệu!';
            break;
    }

    Toast.fire({
        icon: type,
        title: ' ' + message,
    });
}

function filePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#admin-preview-image').css('display', 'block');
            $('#admin-preview-image').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function showSelectedRowInBulkAction() {//// Thư viện hiện thông báo sweetalert2
    let checkbox = $('#form-table input[name="checkbox[]"]:checked');
    let navbarBadge = $('#bulk-apply .navbar-badge');
    if (checkbox.length > 0) {
        navbarBadge.html(checkbox.length);
        navbarBadge.css('display', 'inline');
    } else {
        navbarBadge.html('');
        navbarBadge.css('display', 'none');
    }
}



// CONFIRM DELETE
function SwalDelete(linkPrefix, collection, name, id) { // Thư viện hiện thông báo sweetalert2
    var link = linkPrefix + 'delete/' + id;
    swalWithBootstrapButtons.fire({
        title: 'Bạn có muốn xóa?',
        text: "Delete '" + collection.toUpperCase() + "', Name: " + name + ", Id:  " + id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.value)
            window.location.href = link;
    })
    return false;
}
function SwalDelete2(linkPrefix, method, collection, name, id) { // Thư viện hiện thông báo sweetalert2
    var link = linkPrefix + method + '/' + id;
    swalWithBootstrapButtons.fire({
        title: 'Bạn có muốn xóa?',
        text: "Delete '" + collection.toUpperCase() + "', Name: " + name + ", Id:  " + id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.value)
            window.location.href = link;
    })
    return false;
}


const swalWithBootstrapButtons = Swal.mixin({//// Thư viện hiện thông báo sweetalert2
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});

// $('select[name="group_id"]').change(function () {
//     $('input[name="group_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
// });

// $('select[name="category_id"]').change(function () {
//     $('input[name="category_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
// });


// $('select[name="filter_group"]').change(function () {
//     var path = window.location.pathname.split('/');
//     var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-group/' + $(this).val();
//     window.location.pathname = linkRedirect;
// });

// $('select[name="filter_category"]').change(function () {
//     var path = window.location.pathname.split('/');
//     var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-category/' + $(this).val();
//     window.location.pathname = linkRedirect;
// });



// $('input#name_slug').keyup(function () {
//     $('input[name="slug"]').val(change_alias($(this).val()));
// });

// $("form[name=form-upload]").submit(function (event) {
//     let avatar = $(this).find("input[name=avatar]");
//     $(this).find("input[name=avatar]").remove();
//     $(this).append(avatar).css({ 'display': 'none' });
// });

// $("form[name=form-upload]").submit(function (event) {
//     let thumb = $(this).find("input[name=thumb]");
//     $(this).find("input[name=thumb]").remove();
//     $(this).append(thumb).css({ 'display': 'none' });
// });

// Giải mã các chữ có dấu bị mã hóa trong ckeditor
// Decode with  input is  id = content_ckeditor
function htmlDecodeContentCkeditor(controlInput) {
    var text = $("#content_ckeditor").val();
    var txt = document.createElement('textarea');
    txt.innerHTML = text;
    $("#" + controlInput).val(txt.value); // Decoded // input hidden
    return true;
};


function htmlencode(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

//Decode HTML-entities
function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

//Decode HTML-entities (JQuery)
function decodeHTMLEntities(text) {
    return $("<textarea/>").html(text).text();
}

//Encode HTML-entities
function encodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerText = text;
    return textArea.innerHTML;
}

//Encode HTML-entities (JQuery)
function encodeHTMLEntities(text) {
    return $("<textarea/>").text(text).html();
}


//**********************************************************************************************
//pagination
//**********************************************************************************************
function paginationHelper(paginationObj, type, currentStatus, keyword, linkPrefix, divContentPage) {
    let totalItems = paginationObj.totalItems;
    let totalItemsPerPage = paginationObj.totalItemsPerPage;
    let totalPages = Math.ceil(totalItems / totalItemsPerPage);
    let currentPage = paginationObj.currentPage;
    let pageRanges = paginationObj.pageRanges;
    let xhtmlPagination = '';
    let to = totalItemsPerPage * currentPage;
    let from = to - totalItemsPerPage + 1;
    if (to > totalItems) to = totalItems;

    if (totalPages > 1) {
        let xhtmlStart = '', xhtmlPrevious = '', xhtmlPages = '', xhtmlNext = '', xhtmlEnd = '';
        let link = linkPrefix + '/' + type + '/status/' + currentStatus;
        if (keyword !== '') link += '?keyword=' + keyword + '&page=';
        else link += '?page=';

        let middle = Math.ceil(pageRanges / 2);
        let min = currentPage - middle + 1;

        let max = min + pageRanges - 1;
        if (min <= 1) {
            min = 1;
            max = pageRanges;
        }

        if (max >= totalPages) {  // 3
            max = totalPages;
            min = ((max - pageRanges + 1) >= 1) ? (max - pageRanges + 1) : 1;
        }
        //href="#" onclick="MyFunction();return false;"

        if (min > 1) {
            xhtmlStart = `<li class="page-item "><a href="#" onclick="getContentPages(1); return false;"  class="page-link"><i class="fas fa-angle-double-left"></i> Start</a></li>`;
            if (min > 2) {
                xhtmlPrevious = `<li class="page-item "><a  href="#" onclick="getContentPages(${min - 1}); return false;"  class="page-link"><i class="fas fa-angle-left"></i> Previous</a></li>`;
            }
        }

        if (max < totalPages) {
            xhtmlNext = `<li class="page-item"><a class="page-link" href="#" onclick="getContentPages(${(max + 1)}); return false;" ><i class="fas fa-angle-right"></i> Next </a></li>`;
            if ((max + 1) < totalPages) {
                xhtmlEnd = `<li class="page-item"><a class="page-link" href="#" onclick="getContentPages(${totalPages}); return false;" ><i class="fas fa-angle-double-right"> End </i></a></li>`;
            }
        }


        for (let i = min; i <= max; i++) {
            if (i == currentPage) {
                xhtmlPages += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                xhtmlPages += `<li class="page-item"><a class="page-link" href="#" onclick="getContentPages(${i}); return false; ">${i}</a></li>`;
            }
        }

        var xhtmlPagination_PageLisst = '<ul class="pagination pagination-sm m-0 float-right">' + xhtmlStart + xhtmlPrevious + xhtmlPages + xhtmlNext + xhtmlEnd + '</ul>';
        xhtmlPagination = `
            <div class="panel panel-info" id="pagination">
                <div class="panel-heading">
                    Showing<span> ${from} </span> to<span> ${to}</span> of<span> ${totalItems}</span> entries

                   
                   
                </div>
                <div class="panel-body">
                    <div class="infor-pagination">                        
                    <span class="label label-warning">Total pages: ${totalPages}, </span>
                    <span class="label label-danger">Total entries: ${totalItems}</span>
                     ${xhtmlPagination_PageLisst}
                    </div>
                    <div class="ad-pagination">                      
                    </div>
                </div>
            </div>`;
    }
    $("#" + divContentPage + "").html(xhtmlPagination);
    // var ControldivContent = document.getElementById(divContent);
    // ControldivContent.innerHTML  = xhtmlPagination
    //return xhtmlPagination;
    //<p>Number of entries on the page: <span>${totalItemsPerPage}</span></p>
}

function paginationHelperDuTru(paginationObj, type, currentStatus, keyword, linkPrefix, divContent) {
    let totalItems = paginationObj.totalItems;
    let totalItemsPerPage = paginationObj.totalItemsPerPage;
    let totalPages = Math.ceil(totalItems / totalItemsPerPage);
    let currentPage = paginationObj.currentPage;
    let pageRanges = paginationObj.pageRanges;
    let xhtmlPagination = '';
    let to = totalItemsPerPage * currentPage;
    let from = to - totalItemsPerPage + 1;
    if (to > totalItems) to = totalItems;

    if (totalPages > 1) {
        let xhtmlStart = '', xhtmlPrevious = '', xhtmlPages = '', xhtmlNext = '', xhtmlEnd = '';
        let link = linkPrefix + '/' + type + '/status/' + currentStatus;
        if (keyword !== '') link += '?keyword=' + keyword + '&page=';
        else link += '?page=';

        let middle = Math.ceil(pageRanges / 2);
        let min = currentPage - middle + 1;

        let max = min + pageRanges - 1;
        if (min <= 1) {
            min = 1;
            max = pageRanges;
        }

        if (max >= totalPages) {  // 3
            max = totalPages;
            min = ((max - pageRanges + 1) >= 1) ? (max - pageRanges + 1) : 1;
        }

        if (min > 1) {
            xhtmlStart = `<li class="page-item "><a href="${link}1" class="page-link"><i class="fas fa-angle-double-left"></i> Start</a></li>`;
            if (min > 2) {
                xhtmlPrevious = `<li class="page-item "><a href="${link}${min - 1}" class="page-link"><i class="fas fa-angle-left"></i> Previous</a></li>`;
            }
        }

        if (max < totalPages) {
            xhtmlNext = `<li class="page-item"><a class="page-link" href="${link}${(max + 1)}"><i class="fas fa-angle-right"></i> Next </a></li>`;
            if ((max + 1) < totalPages) {
                xhtmlEnd = `<li class="page-item"><a class="page-link" href="${link}${totalPages}"><i class="fas fa-angle-double-right"> End </i></a></li>`;
            }
        }


        for (let i = min; i <= max; i++) {
            if (i == currentPage) {
                xhtmlPages += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                xhtmlPages += `<li class="page-item"><a class="page-link" href="${link}${i}">${i}</a></li>`;
            }
        }

        var xhtmlPagination_PageLisst = '<ul class="pagination pagination-sm m-0 float-right">' + xhtmlStart + xhtmlPrevious + xhtmlPages + xhtmlNext + xhtmlEnd + '</ul>';
        xhtmlPagination = `
            <div class="panel panel-info" id="pagination">
                <div class="panel-heading">
                    Pagination
                    <span class="label label-warning">Total pages: ${totalPages}</span>
                    <span class="label label-danger">Total entries: ${totalItems}</span>
                     ${xhtmlPagination_PageLisst}
                </div>
                <div class="panel-body">
                    <div class="infor-pagination">
                        <p>Number of entries on the page:<span>${totalItemsPerPage}</span></p>
                        <p>Showing<span> ${from} </span> to<span> ${to}</span> of<span> ${totalItems}</span> entries</p>
                    </div>
                    <div class="ad-pagination">                      
                    </div>
                </div>
            </div>`;
    }

    var ControldivContent = document.getElementById(divContent);
    ControldivContent.innerHTML = xhtmlPagination
    return xhtmlPagination;
}
function deleteRows(arrayId, tableId) {
    var arrayLength = arrayId.length;
    for (var i = 0; i < arrayLength; i++) {
        var row = $("#" + tableId + " button[data-id='" + arrayId[i] + "']").parents("tr")[0];
        $(row).remove();
    }
}




//**********************************************************************************************
// Sort data by column, save this sort type in localStorage,
// Call this function when clicking on the header of the data table on the current page
//**********************************************************************************************
function sortByColumn(control) {
    if (typeof(Storage) == 'undefined'){
        return false;
    }
    var columnName=$(control).data("column");
    let $allTagI=$('.columnHeader > .fa');    
    $allTagI.removeClass('fa-sort-desc');
    $allTagI.removeClass('fa-sort-asc');
    $allTagI.removeClass('fa-sort');

    let $currenColumn=$('.columnHeader > [data-column="'+columnName+'"]'); // find tag i [data-column="'+columnName+'"]'
    
    var sort_before=$(control).data("sort");
    let sort_after="";
    let classShort="";
    if(sort_before=='desc') {
        sort_after="asc";
        classShort="fa-sort-asc";
    }
    else {
        sort_after="desc";
        classShort="fa-sort-desc";
    }
    $(control).data("sort",sort_after);// Set data-sort
    $currenColumn.addClass(classShort);

    var linkPrefix=$('#linkPrefix').val();//linkPrefix is ​​created on the page you are visiting
    var sortStorage = {
        linkPrefix: linkPrefix,
        sortColumn:columnName,
        sortType: sort_after
    }
    localStorage.setItem(linkPrefix, JSON.stringify(sortStorage));
    displayDataToTable(); //This function is written in the currently visited page, used to display the data of that page on the table
}
//**********************************************************************************************
// Read data from localStorage, get data sort parameter
//**********************************************************************************************
function getSortType(linkPrefix){
    try{
        var sortStorage;
        if (typeof(Storage) !== 'undefined'){
            var strSortStorage=window.localStorage.getItem(linkPrefix);
            sortStorage=JSON.parse(strSortStorage);
            if(sortStorage==null){
                sortStorage={sortColumn: '',sortType: ''}
            }
        }
        else {
            sortStorage={sortColumn: '',sortType: ''}
        }
        return sortStorage;
    }
    catch(err){console.log(err);}
}
//**********************************************************************************************
//This function will sort the data before presenting it to the interface
//**********************************************************************************************
function sortDataJson() {
    var linkPrefix=$('#linkPrefix').val(); //linkPrefix is ​​created on the page you are visiting
    var sortStorage=getSortType(linkPrefix);   
    if(sortStorage==null) {
        return false;
    }
    if(sortStorage.sortColumn==""){
        return false;
    }
    try {
        //listData: This parameter is generated on the page you are visiting
        var tempListData;
        if(sortStorage.sortType=="desc") {
            tempListData=listData.sort(function(a,b) { // descending
                // return a[sortStorage.sortColumn]-b[sortStorage.sortColumn]; // sort number
                return ((a[sortStorage.sortColumn] == b[sortStorage.sortColumn]) ? 0 : ((a[sortStorage.sortColumn] > b[sortStorage.sortColumn]) ? 1 : -1 ));
            });
        }
        else { // asc							
            tempListData=listData.sort(function(a,b) {
                // return b[sortStorage.sortColumn]-a[sortStorage.sortColumn]; // sort number
                return ((b[sortStorage.sortColumn] == a[sortStorage.sortColumn]) ? 0 : ((b[sortStorage.sortColumn] > a[sortStorage.sortColumn]) ? 1 : -1 ));
                
            });
        }
        listData=tempListData;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}


function getNumberItemPerPage(){
    var numberItemPerPage = getCookie("numberItemPerPage");
    numberItemPerPage = parseInt(numberItemPerPage);   
    if(isNaN(numberItemPerPage)==true)
        numberItemPerPage = 30;    
    if(numberItemPerPage < 1){      
        $('#numberItemPerPage').val(30);       
    } 
    $('#numberItemPerPage').val(numberItemPerPage); 
}
function setNumberItemPerPage(){
    let numberItemPerPage=$('#numberItemPerPage').val(); 
    numberItemPerPage = parseInt(numberItemPerPage);
    if(numberItemPerPage < 1){
        alert('The number of each page must be greater than 0');
        $('#numberItemPerPage').val(30);       
    } 
    setCookie("numberItemPerPage",numberItemPerPage,1000);
}
function setCookie(cname,cvalue,exdays) {
    const d=new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    let expires="expires="+d.toUTCString();
    document.cookie=cname+"="+cvalue+";"+expires+";path=/";
}

function getCookie(cname) {
    let name=cname+"=";
    let ca=document.cookie.split(';');
    for(let i=0;i<ca.length;i++) {
        let c=ca[i];
        while(c.charAt(0)==' ') {
            c=c.substring(1);
        }
        if(c.indexOf(name)==0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}



//**********************************************************************************************
// Choose columns to display, save this list columns in localStorage,
// Call this function when clicking on configuration on each interface
//**********************************************************************************************
function chooseColumnsToDisplay(Columns) {
    var n = Columns.length;
    var linkPrefix = $('#linkPrefix').val();//linkPrefix is ​​created on the page you are visiting
    var key = linkPrefix+ "_ColumnsToDisplay";
    var sortStorage = {
        linkPrefix: linkPrefix,
        Columns:Columns       
    }
    localStorage.setItem(key, JSON.stringify(sortStorage));
   displayDataToTable(); //This function is written in the currently visited page, used to display the data of that page on the table
}



function showAllColumnInTable(idTable) {
    var columns=$('#'+idTable+' thead th');
    var columnsLength=columns.length-1;
    for(var i=0;i<columnsLength;i++) {
        $('td:nth-child('+(i+1)+'),th:nth-child('+(i+1)+')').show();
    }
}
function hideColumnInTable(idTable) {
    var linkPrefix=$('#linkPrefix').val(); //linkPrefix is ​​created on the page you are visiting
    var arrColumn=getColumnToShowInTable(linkPrefix);
    if(arrColumn.length<1) return true;
    var columns=$('#'+idTable+' thead th');
    var columnsLength=columns.length-1;   
    for(var i=1;i<columnsLength;i++) {
        try {
            var attributes=columns[i].attributes;
            var dataColumn=attributes["data-column"].nodeValue;
            const foundColumnShow=arrColumn.find(element => element==dataColumn);
            if(!foundColumnShow) {
                $('td:nth-child('+(i+1)+'),th:nth-child('+(i+1)+')').hide();
            }
        }
        catch(err) {}
    }
}

function getColumnToShowInTable(linkPrefix) {
    linkPrefix=linkPrefix+"_ColumnsToDisplay";
    var arrColumn=[];
    try {
        var sortStorage;
        if(typeof (Storage)!=='undefined') {
            var strSortStorage=window.localStorage.getItem(linkPrefix);
            sortStorage=JSON.parse(strSortStorage);
            arrColumn=sortStorage.Columns;
        }
    }
    catch(err) {console.log(err);}
    return arrColumn;
}

function setUpdateButtonStatus(statusUpdate) {
    $('#btnSave').prop('hidden',statusUpdate);
    $('#btnUpdate').prop('hidden',!statusUpdate);
}

function setSelectedColumnToShowInterface(idTable) {
    var arrColumn=getColumnToShowInTable(linkPrefix);
    var columns=$('#'+idTable+' thead th');
    var columnsLength=columns.length-1;
    for(var i=1;i<columnsLength;i++) {
        try {
            var attributes=columns[i].attributes;
            var columnName=attributes["data-column"].nodeValue;
            const foundColumnShow=arrColumn.find(element => element==columnName);
            if(foundColumnShow) {
                optionsColumnsToDisplay.push(foundColumnShow);
                $('#ckhShowColumn'+foundColumnShow).prop('checked',true);
                $('#ckhShowColumn'+foundColumnShow).val(true);
            }
        }
        catch(err) {}
    }					
}

