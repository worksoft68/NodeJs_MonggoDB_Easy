function replaceAll (strData, find, replace){	
	return strData.replace(new RegExp(find, 'g'), replace);
}

function focusDropdown(textControl){
    try{
        closeAllDropdown();
    }
    catch(err){}
    var Control = document.getElementById(textControl);
    var DivConten     = document.getElementById('DivConten'+textControl);
    DivConten.hidden = false;
    Control.style.background = 'pink';
}

function blurDropdown(textControl){
    var Control = document.getElementById(textControl);   
    Control.style.background = '';
    try{
        var DivConten     = document.getElementById('DivConten'+textControl);
        DivConten.hidden = true;
    }
    catch(err){}
}

function createDataForDropdown(datas, IdControlInput, fieldId, TextControlInput, fieldText, textDefault, option=null){ 
    if(option==null){
        var xhtml = " <a onmousedown=\"GetValueDropdown('-','"+IdControlInput+"','"+textDefault+"', '"+TextControlInput+"')\">"+textDefault+"</a> ";
        datas.forEach(function(data){
            var dateText = replaceAll(data[fieldText],"\n",""); 
            xhtml+="  <a onmousedown=\"GetValueDropdown('"+data[fieldId]+"','"+IdControlInput+"','"+dateText+"', '"+TextControlInput+"')\">"+dateText+" ("+data[fieldId]+")</a> ";
        });  
        $("#DivConten"+TextControlInput).html(xhtml);
    }
    else if(option.showId==false){
        var xhtml = " <a onmousedown=\"GetValueDropdown('-','"+IdControlInput+"','"+textDefault+"', '"+TextControlInput+"')\">"+textDefault+"</a> ";
        datas.forEach(function(data){
            var dateText = replaceAll(data[fieldText],"\n",""); 
            xhtml+="  <a onmousedown=\"GetValueDropdown('"+data[fieldId]+"','"+IdControlInput+"','"+dateText+"', '"+TextControlInput+"')\">"+dateText+"</a> ";
        });  
        $("#DivConten"+TextControlInput).html(xhtml);
    }
    
}
function createDataForDropdownSub(datas, IdControlInput, fieldId, TextControlInput, fieldText, textDefault, idParent, fieldIdParent) { 
    var xhtml = " <a onmousedown=\"GetValueDropdown('-','"+IdControlInput+"','"+textDefault+"', '"+TextControlInput+"')\">"+textDefault+"</a> ";
    datas.forEach(function(data){
        if(data[fieldIdParent] ===idParent){
            var dateText = replaceAll(data[fieldText],"\n",""); 
            xhtml+="  <a onmousedown=\"GetValueDropdown('"+data[fieldId]+"','"+IdControlInput+"','"+dateText+"', '"+TextControlInput+"')\">"+dateText+" ("+data[fieldId]+")</a> ";
        }
    });  
    $("#DivConten"+TextControlInput).html(xhtml);
}

function GetValueDropdown(Id,IdControlInput, Text, TextControlInput) {
    var ControlId = document.getElementById(IdControlInput);
    ControlId.value = Id;

    var ControlText = document.getElementById(TextControlInput);
    ControlText.value = Text;
    var DivConten = document.getElementById('DivConten'+TextControlInput);
    DivConten.hidden = true;
}

function filterSelectBox(ControlText) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(ControlText);
    filter = input.value.toUpperCase();
    div = document.getElementById('divDropdown'+ControlText);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}






$('a.ajax-group-acp').click(function(e){

    e.preventDefault();// click vào tag a nhưng không chuyển đến trang link href

    let currentElement = $(this);
    let currentClass = currentElement.attr('data-current');  
   let currentClassIcon = currentElement.attr('data-icon-current'); 
    let link = currentElement.attr('href');
   
    $.ajax({
        type: 'GET',
        url: link,
        dataType: "json",
        success: function(data){           
            let groupAcp = data.groupACP; // giá trị groupAcp là yes / no          
           // let dataNotice = data.notify; // thông báo
            let id = data.id;         
            let classGroupAcp = currentElement.data(groupAcp); // class mới 
            let classIconNew = currentElement.data('icon-'+groupAcp); // class mới

            // let iconNew =  '<i class="fas  '+classIconNew+'"></i>';
            // var taga = document.getElementById('a'+id);
            // taga.innerHTML = iconNew;

            let linkGroup = link.replace(link.match('[^/]+$'),groupAcp);//// link mới           
            currentElement.attr('data-current',classGroupAcp); // đổi giá trị hiện tại của  data-current
            currentElement.attr('data-icon-current',classIconNew);

            currentElement.removeClass(currentClass).addClass(classGroupAcp);
            currentElement.children().removeClass(currentClassIcon).addClass(classIconNew);



            currentElement.attr('href',linkGroup);           
            
            // currentElement.notify('Cập nhật thành công!', {
            //     className: 'success',
            //     position: 'right',
            // });
            showNotice(data.notify);
           //notice(currentElement,dataNotice);
        }


    })

});

$('a.ajax-status').click(function(e){  
    e.preventDefault();// click vào tag a nhưng không chuyển đến trang link href
   
    let currentElement = $(this);
    let currentClass = currentElement.attr('data-current');  
    let currentClassIcon = currentElement.attr('data-icon-current'); 
    let link = currentElement.attr('href');
 
    $.ajax({
        type: 'GET',
        url: link,
        dataType: "json",
        success: function(data){           
            let status = data.status; // giá trị groupAcp là yes / no          
            // let dataNotice = data.notify; // thông báo
            // let id = data.id;         
            let classStatus = currentElement.data(status); // class mới 
            let classIconNew = currentElement.data('icon-'+status); // class mới
            let linkGroup = link.replace(link.match('[^/]+$'),status);//// link mới           
            currentElement.attr('data-current',classStatus); // đổi giá trị hiện tại của  data-current
            currentElement.attr('data-icon-current',classIconNew);
            currentElement.removeClass(currentClass).addClass(classStatus);
            currentElement.children().removeClass(currentClassIcon).addClass(classIconNew);
            currentElement.attr('href',linkGroup);   
            
            //ThongBao1('Đã thành công');
           // notice(currentElement,dataNotice);
           showNotice(data.notify);
            
        }


    })

});

$('.ordering').change(function(){
    let current  = $(this);
    let ordering = $(this).val();
    let id = $(this).data('id');
    let link = $(this).data('link');    
    $.ajax({
        type: 'POST',
        url: link,
        data: {'id': id, 'ordering': ordering},
        dataType: "json",
        success: function(data){
            showNotice(data.notify);
        }
    });
});


$('select[name=item_group]').change(function(e){
    let current  = $(this);
    let groupId = current.val();
    let groupName = current.find('option:selected').text();  
    let parentKey = $(this).data('iditem');  
    let link = $(this).data('link');    
  
    $.ajax({
        type: 'POST',
        url: link,
        data: {'id': parentKey, 'group_id': groupId, 'group_name': groupName},
        dataType: "json",
        success: function(data){
            showNotice(data.notify);        
        }
    });
});



function showNotice(data){    
    showPopup(data.title, data.class);
    showNotifyMaster(data.title);
}

function showNoticeDanger(message){
    alert(message);
    $("#divMessage").html(message); 
    showPopup(message, "danger");
    showNotifyMaster(message);
}
function showNoticeSuccess(message){ 
    $("#divMessage").html(message); 
    showPopup(message, "success");
    showNotifyMaster(message);
}


var ExportHtmlToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

    return function (htmlValue, Sheet) {
        try{
            //if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: Sheet || 'Worksheet', table: htmlValue }
            window.location.href = uri + base64(format(template, ctx))
        }
        catch (Error) { }
        
    }
})()

function dateToStringMMM(date, style) {
    try{
        const  mydate =  new Date(date);
        let monthNames =["Jan","Feb","Mar","Apr",
                        "May","Jun","Jul","Aug",
                        "Sep", "Oct","Nov","Dec"];
        var day = mydate.getDate();
        var monthIndex = mydate.getMonth();
        var monthName = monthNames[monthIndex];
        var year = mydate.getFullYear()
        if(year < 2000) return '';
        return day + style + monthName + style + year;  
    }
    catch(err){}
    return ""; 
}

function dateToStringMMMHH(date, style) {
    if(date == null) return "";
    try{
        date = date.replace("T"," ");
        date = date.replace("Z","");
        const  mydate =  new Date(date);
        let monthNames =["Jan","Feb","Mar","Apr",
                        "May","Jun","Jul","Aug",
                        "Sep", "Oct","Nov","Dec"];
        var day = mydate.getDate();
        var monthIndex = mydate.getMonth();
        var monthName = monthNames[monthIndex];
        var year = mydate.getFullYear()
        if(year < 2000) return '';
        var hours = mydate.getHours();
        var minute = mydate.getMinutes();
        var seconds = mydate.getSeconds();
        return day + style + monthName + style + year + " "+ hours + "h:"+minute+":"+seconds ; 
    } 
    catch(err){}
    return ""; 
}


function getDate(time) { 
    var date = new Date(time);       
    let day = (date.getDate()<10)? '0'+date.getDate(): date.getDate();       
    let month = ((date.getMonth()+1)<10)? '0'+(date.getMonth()+1): date.getMonth()+1;
    let year = date.getFullYear();
    let data = year + '-'+month +'-'+ day;       
    return data;
} 

function formatMessage(message,min, max){
	message = message.replace("%d", min);
	message = message.replace("%d", max);
	//alert(message);
	return message;
}
function showErrorMessageSave(response, message){
	try {
		var responseJSON 	= response.responseJSON;
		var errors 			= responseJSON.error;
		var messageErrorDiv = message + " ";
		var messageError 	= message + ", ";
        if(errors != undefined){
            Object.keys(errors).forEach(function(key) {
                var arrWord = key.split("_");
                var strWord = '';
                arrWord.forEach((word) => {
                    strWord += word.charAt(0).toUpperCase() + word.slice(1) + " ";
                });
                messageErrorDiv += " <li><b>"+ strWord +"</b>: "+ errors[key]+"</li>";
                messageError += strWord +": "+ errors[key]+", ";
            });
        }
        if(errors == undefined){
            messageErrorDiv += " <li>"+ responseJSON.data.message + "</li>";
            messageError +=  responseJSON.data.message;
        }
		showNoticeSuccess(messageErrorDiv);
		alert(messageError);
	}
	catch(err){
		showNoticeDanger(message);
	}
}

function createLinkImage(branch){
    protocol = window.location.protocol					
    var host = window.location.hostname;
    var port = window.location.port;
    if ((port != "80") && (port != "")) {
        port = ":" + port;
    }
    else port = "";
    var link = protocol + "//" + host + port + "/uploads/" + branch+"/";
    return link;
}

//Full Refresh of page - Ctrl+F5
function RefreshPage(){   
    window.location.reload(true);
}

// function ThongBao1(TieuDe){    
//     Swal.fire({
//         toast: true,
//         icon: 'success',
//         title: TieuDe,
//         animation: false,
//         position: 'bottom',
//         showConfirmButton: false,
//         timer: 8000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//         toast.addEventListener('mouseenter', Swal.stopTimer)
//         toast.addEventListener('mouseleave', Swal.resumeTimer)
//         }
//     })
     
// };

// function showNotice(current, data){
//     showPopup(data.title);
//     showNotifyMaster(data.title);
//     // current.notify(data.title, {
//     //     className: data.class,
//     //     position: 'right',
//     // });

// }



// current.notify(data.title, {
//     className: data.class,
//     position: 'top-center',
// });