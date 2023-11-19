const dbConnection = require(__path_helpers + 'utils-mssql');
const publicFunction = require(__path_helpers + 'publicFunction');
const Mainschemas = require(__path_schemas + 'systemLog');
// const SysPermissionModel = require(__path_models + 'sys_Permission');
const systemConfig = require(__path_configs + 'system');
var moment = require('moment');
const functionBranch = 'SystemLog';



async function saveLog(Action, ImpactZone, IdTable, ContentLog, userLogin) {
	let strContentLog = JSON.stringify(ContentLog);
	let strContentLogMin = "";
	if (strContentLog.length > 1800) {
		strContentLogMin = strContentLog.substring(0, 1800);
	}
	else strContentLogMin = strContentLog;

	if (ImpactZone.length > 55) {
		ImpactZone = ImpactZone.substring(0, 55);
	}

	if (IdTable.length > 24) {
		IdTable = IdTable.substring(0, 24);
	}

	let FullName = userLogin.FirstName + ' ' + userLogin.LastName;
	if (FullName.length > 37) {
		FullName = FullName.substring(0, 37);
	}

	let IP = "";
	let data = {
		Action: Action,
		ImpactZone: ImpactZone,
		IdTable: IdTable,
		ContentLog: strContentLogMin,
		ContentLogMax: strContentLog,
		IP: IP,
		UserId: userLogin.UsersId,
		FullName: FullName,
		DateTimeLog: moment(Date.now()).format(systemConfig.format_time_sql_system),
	};
	await dbConnection.addAnything(Mainschemas.schemas, data);


}



async function deleteById(Id, userLogin = null) {
	// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
	// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true)) {
	// 	return {
	// 		success: false,
	// 		message: 'You have no permission delete'
	// 	};
	// }
	let item_Old = await dbConnection.selectAnyByPrimaryKey(Mainschemas.schemas, Id);
	if (item_Old.User_Id_Created != userLogin.UsersId) {
		return {
			success: false,
			status: 405,
			action: 'delete',
			data: '',
			message: 'You have no permission delete'
		}
	}
	LogModel.saveLog("Delete", Mainschemas.schemas.table, item_Old.Id, item_Old, userLogin);
	return await dbConnection.deleteAnythingByPrimaryKey(Mainschemas.schemas, Id);
}

async function deleteList(arrayId, userLogin = null) {
	try {
		// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
		// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true)) {
		// 	return {
		// 		success: false,
		// 		message: 'You have no permission delete'
		// 	};
		// }
		let listId = arrayId["arrayId[]"];
		let lengthListId = listId.length;
		let deleteSuccess = [];
		let deleteError = [];
		for (let i = 0; i < lengthListId; i++) {
			let resultOne = 'fales';
			try {
				let item_Old = await dbConnection.selectAnyByPrimaryKey(Mainschemas.schemas, listId[i]);
				if (item_Old.User_Id_Created == userLogin.UsersId) {
					LogModel.saveLog("Delete", Mainschemas.schemas.table, item_Old.Id, item_Old, userLogin);
					resultOne = await dbConnection.deleteAnythingByPrimaryKey(Mainschemas.schemas, listId[i]);
				}
			}
			catch (error) { }
			if (resultOne == 'true') {
				deleteSuccess.push(listId[i]);
			}
			else {
				deleteError.push(listId[i]);
			}
		}
		return {
			success: true,
			deleteSuccess,
			deleteError,
			message: 'true'
		};
	}
	catch (error) { }
	return {
		success: false,
		message: 'Error! Delete fail'
	};
}

async function listItems(params, userLogin, options = null) {
	// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
	// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true) && (permissionAccess.ReadOnly != true)) {
	// 	return [];
	// }
	let dataParams = {};
	let skip = (params.pagination.currentPage - 1) * systemConfig.totalItemsPerPage;
	let where = " WHERE (Id != 0) ";
	if (options != null) {
		if (options.Action != "") {
			dataParams.Action = "%" + options.Action + "%";
			where += " and (Action like @Action) ";
		}
		if (options.ImpactZone != "") {
			dataParams.ImpactZone = "%" + options.ImpactZone + "%";
			where += " and (ImpactZone like @ImpactZone) ";
		}
		if (options.IdTable != "") {
			dataParams.IdTable = "%" + options.IdTable + "%";
			where += " and (IdTable like @IdTable) ";
		}
		if (options.ContentLog != "") {
			dataParams.ContentLog = "%" + options.ContentLog + "%";
			where += " and (ContentLog like @ContentLog) ";
		}
		if (options.ContentLogMax != "") {
			dataParams.ContentLogMax = "%" + options.ContentLogMax + "%";
			where += " and (ContentLogMax like @ContentLogMax) ";
		}
		if (options.IP != "") {
			dataParams.IP = "%" + options.IP + "%";
			where += " and (IP like @IP) ";
		}
		if (options.MacAddress != "") {
			dataParams.MacAddress = "%" + options.MacAddress + "%";
			where += " and (MacAddress like @MacAddress) ";
		}
		if (options.HostName != "") {
			dataParams.HostName = "%" + options.HostName + "%";
			where += " and (HostName like @HostName) ";
		}
		if (options.FullName != "") {
			dataParams.FullName = "%" + options.FullName + "%";
			where += " and (FullName like @FullName) ";
		}
	}

	let sql = ` SELECT Id, Action, ImpactZone, IdTable, ContentLog, ContentLogMax, IP, MacAddress, HostName, UserId, FullName, DateTimeLog 
			, COUNT(*) OVER() as TotalRecord
			FROM SystemLog   ${where}
			ORDER BY Id DESC
			offset ${skip} rows
			fetch next ${systemConfig.totalItemsPerPage} rows only`;
	let result = await dbConnection.executeQuerySchemaParam(Mainschemas.schemas, sql, dataParams);
	return result.recordset;
}

async function search(params, userLogin, options = null) {
	// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
	// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true) && (permissionAccess.ReadOnly != true))
	// 	return [];
	let dataParams = {};
	let skip = (params.pagination.currentPage - 1) * systemConfig.totalItemsPerPage;
	let sql = "select top " + systemConfig.totalItemsPerPage + " * from(" +
		"select * " +
		", ROW_NUMBER() over(order by Id desc) as RowNumber, COUNT(*) OVER() as TotalRecord " +
		" from SystemLog where (Id > 0 )";
	if (options.Action != "") {
		dataParams.Action = "%" + options.Action + "%";
		sql += " and (Action like @Action) ";
	}
	if (options.ImpactZone != "") {
		dataParams.ImpactZone = "%" + options.ImpactZone + "%";
		sql += " and (ImpactZone like @ImpactZone) ";
	}
	if (options.IdTable != "") {
		dataParams.IdTable = "%" + options.IdTable + "%";
		sql += " and (IdTable like @IdTable) ";
	}
	if (options.ContentLog != "") {
		dataParams.ContentLog = "%" + options.ContentLog + "%";
		sql += " and (ContentLog like @ContentLog) ";
	}
	if (options.ContentLogMax != "") {
		dataParams.ContentLogMax = "%" + options.ContentLogMax + "%";
		sql += " and (ContentLogMax like @ContentLogMax) ";
	}
	if (options.IP != "") {
		dataParams.IP = "%" + options.IP + "%";
		sql += " and (IP like @IP) ";
	}
	if (options.MacAddress != "") {
		dataParams.MacAddress = "%" + options.MacAddress + "%";
		sql += " and (MacAddress like @MacAddress) ";
	}
	if (options.HostName != "") {
		dataParams.HostName = "%" + options.HostName + "%";
		sql += " and (HostName like @HostName) ";
	}
	if (options.FullName != "") {
		dataParams.FullName = "%" + options.FullName + "%";
		sql += " and (FullName like @FullName) ";
	}

	sql += ") mainTable where RowNumber > " + skip + " ";
	let result = await dbConnection.executeQuerySchemaParam(Mainschemas.schemas, sql, dataParams);
	return result.recordset;
}

async function getById(Id, userLogin = null) {
	// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
	// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true) && (permissionAccess.ReadOnly != true))
	// 	return {};
	let result = await dbConnection.selectAnyByPrimaryKey(Mainschemas.schemas, Id);
	if (result.User_Id_Created != userLogin.UsersId) {
		return {};
	}
	return result;
}


async function exportData(item, userLogin) {
	// let permissionAccess = await SysPermissionModel.getPermissionByFunction(userLogin.UsersId, functionBranch);
	// if ((permissionAccess.FullAuthority != true) && (permissionAccess.FullOfYourself != true) && (permissionAccess.ReadOnly != true))
	// 	return [];
	let dataParams = {};
	let where = "";
	where = " WHERE (Id != 0) ";
	if (item.Action != "") {
		dataParams.Action = "%" + item.Action + "%";
		where += " and (Action like @Action) ";
	}
	if (item.ImpactZone != "") {
		dataParams.ImpactZone = "%" + item.ImpactZone + "%";
		where += " and (ImpactZone like @ImpactZone) ";
	}
	if (item.IdTable != "") {
		dataParams.IdTable = "%" + item.IdTable + "%";
		where += " and (IdTable like @IdTable) ";
	}
	if (item.ContentLog != "") {
		dataParams.ContentLog = "%" + item.ContentLog + "%";
		where += " and (ContentLog like @ContentLog) ";
	}
	if (item.ContentLogMax != "") {
		dataParams.ContentLogMax = "%" + item.ContentLogMax + "%";
		where += " and (ContentLogMax like @ContentLogMax) ";
	}
	if (item.IP != "") {
		dataParams.IP = "%" + item.IP + "%";
		where += " and (IP like @IP) ";
	}
	if (item.MacAddress != "") {
		dataParams.MacAddress = "%" + item.MacAddress + "%";
		where += " and (MacAddress like @MacAddress) ";
	}
	if (item.HostName != "") {
		dataParams.HostName = "%" + item.HostName + "%";
		where += " and (HostName like @HostName) ";
	}
	if (item.FullName != "") {
		dataParams.FullName = "%" + item.FullName + "%";
		where += " and (FullName like @FullName) ";
	}

	let sql = ` SELECT Id, Action, ImpactZone, IdTable, ContentLog, ContentLogMax, IP, MacAddress, HostName, UserId, FullName, DateTimeLog 
			FROM SystemLog   ${where}
			ORDER BY Id DESC`;
	let result = await dbConnection.executeQuerySchemaParam(Mainschemas.schemas, sql, dataParams);
	return result.recordset;
}

module.exports = {
	saveLog,
	deleteById,
	deleteList,
	listItems,
	search,
	getById,
	exportData
};
