
module.exports = {
    port : 443,
    prefixOpenApi: 'openapi',    
    prefixAdmin: 'admin',    // hdsdnsk
    prefixApiAdmin: 'api',    // hdsdnsk
    prefixBlog: '',
    prefixChat: 'chat',
    prefixUrl: '',
    env: 'dev', // production dev
    format_long_time: 'DD-MM-YYYY hh:mm',
    format_time_frontend: 'DD-MM-YYYY',
    format_time_chat: 'HH:mm DD-MM-YYYY',
    format_time_sql_system: 'yyyy-MM-DD HH:mm:ss.SSS',  // can not change, this format in sert to MSSQL
    totalItemsPerPage: 30,
    pageRanges: 3,
    //====================================================================
    JWT_SECRET : '686868686868686',
    JWT_EXP    : '30d',
    COOKIE_EXP : 30,
    //====================================================================

    SMTP_HOST  : 'smtp.office365.com',
    SMTP_PORT  : 587,
    SMTP_EMAIL : 'system@microsoft.com',
    SMTP_PASS  : 'system@123',
    FORM_EMAIL : 'system@microsoft.com', // Email hệ thống
    FORM_NAME  : 'Software',
    maxAge_Cookie_Language: 60000, // 10 * 60 * 1000 // 10 phút = 600000

};