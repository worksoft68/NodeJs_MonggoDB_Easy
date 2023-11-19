//Create slug input // Lọc bỏ dấu, tạo link
function change_alias_search(alias) {
    var str = alias;    
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ *? /g,"-");
    str = str.trim(); 
    return str;
}


  
