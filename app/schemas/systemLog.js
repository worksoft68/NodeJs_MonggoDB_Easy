let schemas = {
	table			: 'SystemLog',
	primaryKeyColumn: 'Id',
	Id				: 'Int64',
	Action			: 'string',
	ImpactZone		: 'string',
	IdTable			: 'string',
	ContentLog		: 'string',
	ContentLogMax	: 'string',
	IP				: 'string',
	MacAddress		: 'string',
	HostName		: 'string',
	UserId			: 'Int64',
	FullName		: 'string',
	DateTimeLog		: 'DateTime',
};
module.exports = {
	schemas
}; 
