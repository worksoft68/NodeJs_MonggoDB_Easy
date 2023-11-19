const notify  		= require(__path_configs + 'notify');
const util  		= require('util');
let show = (req, res, linkIndex, params=null)=>{
    let notifyContent = '';
    let classnotify = 'success';
    switch(params.task){
        case 'change-status':
            notifyContent = notify.CHANGE_STATUS_SUCCESS;
            break;
        case 'change-multi-status':
            notifyContent = util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, params.total);
            break;

        case 'change-ordering':
            notifyContent = notify.CHANGE_ORDERING_SUCCESS;
            break;

        case 'delete-one':
            notifyContent = notify.DELETE_SUCCESS;
            break;
        case 'delete-one-error':
            notifyContent = notify.ERROR_DELETE;
            classnotify = 'danger';
            break;

        case 'delete-mutli':
            notifyContent = util.format(notify.DELETE_MULTI_SUCCESS, params.total);
            break;

        case 'add':
            notifyContent = notify.ADD_SUCCESS;
            break;
        case 'add-false':
            notifyContent = notify.ADD_ERROR;
            classnotify = 'danger';
            break;

        case 'edit':
            notifyContent = notify.EDIT_SUCCESS;
            break;
        case 'edit-false':
            notifyContent = notify.EDIT_ERROR;
            classnotify = 'danger';
            break;
        case 'change-group-acp':
            notifyContent = notify.CHANGE_GROUP_ACP_SUCCESS;
            break; 
    }
    req.flash(classnotify, notifyContent);
	res.redirect(linkIndex);

}
let showMessage = (req, res, linkIndex, notify)=>{   
    req.flash(notify.classnotify, notify.notifyContent);
	res.redirect(linkIndex);

}
module.exports = {
    show,
    showMessage	
}