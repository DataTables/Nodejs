import { Knex } from 'knex';

export default class StateRestore {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private properties
	 */

	private _columnDefault: string = 'defaultState';

	private _columnId: string = 'id';

	private _columnName: string = 'name';

	private _columnPath: string = 'path';

	private _columnShared: string = 'shared';

	private _columnState: string = 'state';

	private _columnTable: string = 'table';

	private _columnUser: string = 'user';

	private _db: Knex;

	private _result: StateRestoreResponse = {};

	private _set: Record<string, any> = [];

	private _table: string = '';

	private _userId: string = '';

	private _where: Knex.Where[] = [];

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the column name for the default state flag
	 */
	public columnDefault(): string;
	/**
	 * Set the column name for the default state flag
	 * @param column Column name
	 */
	public columnDefault(column: string): this;
	public columnDefault(column?: string) {
		if (!column) {
			return this._columnDefault;
		}

		this._columnDefault = column;
		return this;
	}

	/**
	 * Get the column name for the table's primary key
	 */
	public columnId(): string;
	/**
	 * Set the column name for the table's primary key
	 * @param column Column name
	 */
	public columnId(column: string): this;
	public columnId(column?: string) {
		if (!column) {
			return this._columnId;
		}

		this._columnId = column;
		return this;
	}

	/**
	 * Get the column name for the state's name
	 */
	public columnName(): string;
	/**
	 * Set the column name for the state's name
	 * @param column Column name
	 */
	public columnName(column: string): this;
	public columnName(column?: string) {
		if (!column) {
			return this._columnName;
		}

		this._columnName = column;
		return this;
	}

	/**
	 * Get the column name for the URL (path) of where the state applied
	 */
	public columnPath(): string;
	/**
	 * Set the column name for the URL (path) of where the state applied
	 * @param column Column name
	 */
	public columnPath(column: string): this;
	public columnPath(column?: string) {
		if (!column) {
			return this._columnPath;
		}

		this._columnPath = column;
		return this;
	}

	/**
	 * Get the column name for the shared flag
	 */
	public columnShared(): string;
	/**
	 * Set the column name for the shared flag
	 * @param column Column name
	 */
	public columnShared(column: string): this;
	public columnShared(column?: string) {
		if (!column) {
			return this._columnShared;
		}

		this._columnShared = column;
		return this;
	}

	/**
	 * Get the column name for where the state itself is stored
	 */
	public columnState(): string;
	/**
	 * Set the column name for where the state itself is stored
	 * @param column Column name
	 */
	public columnState(column: string): this;
	public columnState(column?: string) {
		if (!column) {
			return this._columnState;
		}

		this._columnState = column;
		return this;
	}

	/**
	 * Get the column name for where the name of the host DataTable stored
	 */
	public columnTable(): string;
	/**
	 * Set the column name for where the name of the host DataTable stored
	 * @param column Column name
	 */
	public columnTable(column: string): this;
	public columnTable(column?: string) {
		if (!column) {
			return this._columnTable;
		}

		this._columnTable = column;
		return this;
	}

	/**
	 * Get the column name for the name of the column where the user identifier
	 * is stored.
	 */
	public columnUser(): string;
	/**
	 * Set the column name for the name of the column where the user identifier
	 * is stored.
	 * @param column Column name
	 */
	public columnUser(column: string): this;
	public columnUser(column?: string) {
		if (!column) {
			return this._columnUser;
		}

		this._columnUser = column;
		return this;
	}

	/**
	 * Get the data constructed and resulting from this instance being
	 * processed.
	 *
	 * @return The result
	 */
	public data() {
		return this._result;
	}

	/**
	 * Get the database connection assigned to the instance.
	 *
	 * @returns Knex db interface
	 */
	public db(): Knex;
	/**
	 * Set the database connection.
	 * @param db Knex db interface
	 * @returns Self for chaining
	 */
	public db(db: Knex): this;
	public db(db?: Knex): any {
		if (db === undefined) {
			return this._db;
		}

		this._db = db;
		return this;
	}

	public async process(data: StateRestoreSubmit) {
		if (!data || data.action === undefined) {
			this._result = {error: 'Unknown action'};
		}
		else if (data.action === 'state-read') {
			this._result = await this._read(data);
		}
		else if (data.action === 'state-create') {
			this._result = await this._create(data);
		}
		else if (data.action === 'state-edit') {
			this._result = await this._edit(data);
		}
		else if (data.action === 'state-remove') {
			this._result = await this._remove(data);
		}

		return this;
	}

	/**
	 * Get extra column name / value properties to store in the db
	 */
	public set(): Record<string, any>;
	/**
	 * Set the column name / value properties to store in the db as part of the
	 * state. Note that they are not read back from the db as part of loading
	 * the state list.
	 * @param set Column name / value pairs
	 */
	public set(set: Record<string, any>): this;
	public set(set?: Record<string, any>) {
		if (!set) {
			return this._set;
		}

		this._set = set;
		return this;
	}

	/**
	 * Get the database table name that will be used for the state storage.
	 */
	public table(): string;
	/**
	 * Set the database table name that will be used for state storage.
	 * @param name Table name
	 */
	public table(name: string): this;
	public table(name?: string) {
		if (!name) {
			return this._table;
		}

		this._table = name;
		return this;
	}

	/**
	 * Get the value for the current user identifier. This is usually a
	 * user id, but it could be any other unique identifier.
	 */
	public user(): string;
	/**
	 * Set the value for the current user identifier. This is usually a
	 * user id, but it could be any other unique identifier.
	 * @param name User ID
	 */
	public user(name: string): this;
	public user(name?: string) {
		if (!name) {
			return this._userId;
		}

		this._userId = name;
		return this;
	}

	/**
	 * Get the array of conditions applied to the instance.
	 * @returns Knex where conditions.
	 */
	public where(): Knex.Where[];
	/**
	 * Set a condition for the queries Editor will perform. Editor uses Knex
	 * to connect to the database, and exposes the knex object using this method
	 * so you can add any conditions you like that are supported by Knex.
	 * @param cond Knex query condition
	 * @returns Self for chaining.
	 */
	public where(...cond: Knex.Where[]): this;
	public where(...cond: Knex.Where[]): any {
		if (cond.length === 0) {
			return this._where;
		}

		this._where.push(...cond);

		return this;
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Constructor
	 *
	 * @param db Database connector
	 * @param table Database table name for where the states will be stored
	 * @param pkey Primary key column name for that table
	 */
	constructor(db: Knex, table?: string, pkey?: string) {
		this._db = db;

		if (table) {
			this.table(table);
		}

		if (pkey) {
			this.columnId(pkey);
		}
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Validate submitted state data.
	 *
	 * @param data Data to validate
	 * @param prop Property to check
	 * @returns `true` if valid
	 */
	private _assert(data: Record<string, any>, prop: string) {
		return data && typeof data[prop] !== undefined;
	}

	private _assertStateData(data: Record<string, any>) {
		if (!this._assert(data, 'isDefault')) {
			return {error: 'Incomplete data - no default flag'};
		}

		if (!this._assert(data, 'isSharedOut')) {
			return {error: 'Incomplete data - no share flag'};
		}

		if (!this._assert(data, 'name') || !data['name']) {
			return {error: 'Incomplete data - no name'};
		}

		if (!this._assert(data, 'state')) {
			return {error: 'Incomplete data - no valid state'};
		}

		try {
			JSON.parse(data['state']);
			// No op - just needed to check that it parsed!
		} catch (e) {}

		let validate = this._assertStateHost(data);

		if (validate !== true) {
			return validate;
		}

		return true;
	}

	/**
	 * Check the parameters that are submitted for host table information.
	 *
	 * @param data Data to validate
	 * @returns `true` if valid
	 */
	private _assertStateHost(data: Record<string, any>) {
		if (!this._assert(data, 'path') || !data['path']) {
			return {error: 'Incomplete data - no path'};
		}

		if (!this._assert(data, 'table') || !data['table']) {
			return {error: 'Incomplete data - table'};
		}

		return true;
	}

	/**
	 * Add a new state to the database
	 *
	 * @param data State information
	 * @returns
	 */
	private async _create(data: StateRestoreSubmit): Promise<StateRestoreResponse> {
		let validated = this._assertStateData(data);

		if (validated !== true) {
			return validated;
		}

		// Values to set
		let set: Record<string, any> = {
			[this._columnDefault]: this._valueBoolean(data.isDefault),
			[this._columnName]: data['name'],
			[this._columnPath]: data['path'],
			[this._columnShared]: this._valueBoolean(data.isSharedOut),
			[this._columnState]: data['state'],
			[this._columnTable]: data['table']
		};

		if (this._userId) {
			set[this._columnUser] = this._userId;
		}

		// Dev defined values (server-side)
		for (const [key, value] of Object.entries(this._set)) {
			set[key] = value;
		}

		if (set[this._columnDefault]) {
			await this._removeDefault(data);
		}

		let res = await this._db(this._table)
			.insert(set)
			.returning(this._columnId);
		let id = typeof res[0] === 'object' ? res[0][this._columnId].toString() : res[0].toString();

		return this._read(data, id);
	}

	/**
	 * Update a state on the database.
	 *
	 * @param data State information
	 * @returns
	 */
	private async _edit(data: StateRestoreSubmit): Promise<StateRestoreResponse> {
		let validated = this._assertStateData(data);

		if (validated !== true) {
			return validated;
		}

		if (!data.id) {
			return {
				error: 'Incomplete data - no id'
			};
		}

		// Values to set
		let set: Record<string, any> = {
			[this._columnDefault]: this._valueBoolean(data.isDefault),
			[this._columnName]: data['name'],
			[this._columnShared]: this._valueBoolean(data.isSharedOut),
			[this._columnState]: data['state']
		};

		// Dev defined values (server-side)
		for (const [key, value] of Object.entries(this._set)) {
			set[key] = value;
		}

		// Conditions
		let where = {
			[this._columnId]: data['id'],
			[this._columnTable]: data['table'],
			[this._columnPath]: data['path']
		};

		if (this._userId) {
			where[this._columnUser] = this._userId;
		}

		// There can be only one
		if (set[this._columnDefault]) {
			await this._removeDefault(data);
		}

		await this._db(this._table).update(set).where(where);

		return this._read(data, data.id);
	}

	/**
	 * Read the states from the db.
	 *
	 * @param data Submitted data
	 * @param id Limit the read to a specific ID
	 * @returns Read data
	 */
	private async _read(
		data: StateRestoreSubmit,
		id?: string | number
	): Promise<StateRestoreResponse> {
		// Must have the table and path, otherwise all states would be returned!
		let validated = this._assertStateHost(data);

		if (validated !== true) {
			return validated;
		}

		let that = this;
		let q = this._db(this._table);

		q.select(`${this._columnId} as id`);

		if (this._columnDefault) {
			q.select(`${this._columnDefault} as isDefault`);
		}

		if (this._columnName) {
			q.select(`${this._columnName} as name`);
		}

		if (this._columnShared) {
			q.select(`${this._columnShared} as isSharedOut`);
		}

		if (this._columnState) {
			q.select(`${this._columnState} as state`);
		}

		if (this._columnUser) {
			q.select(`${this._columnUser} as user`);
		}

		// Conditions
		q.where({
			[this._columnTable]: data.table,
			[this._columnPath]: data.path
		});

		if (id) {
			q.where({[this._columnId]: id});
		}

		// The user id is optional, but there can't be any separation of user
		// states without it!
		if (this._userId) {
			q.where(function () {
				this.where({[that._columnUser]: that._userId});
				this.orWhere({[that._columnShared]: 1});
			});
		}

		// Dev set conditions
		for (let i = 0; i < this._where.length; i++) {
			q.where(this._where[i]);
		}

		// Run the assembled query
		let res = await q;

		// Map to the JSON structure that StateRestore expects
		let out = res.map((row) => {
			return {
				id: row.id,
				isDefault: row.isDefault,
				isSharedIn: this._userId && row.user != this._userId ? true : false,
				isSharedOut: row.isSharedOut,
				isStatic: false,
				name: row.name,
				state: row.state
			};
		});

		return {data: out};
	}

	/**
	 * Delete states.
	 *
	 * @param data Submitted data with `ids` parameter
	 * @returns 
	 */
	private async _remove(data: StateRestoreSubmit): Promise<StateRestoreResponse> {
		let validated = this._assertStateHost(data);

		if (validated !== true) {
			return validated;
		}

		if (!data.ids || !Array.isArray(data.ids)) {
			return {
				error: 'Invalid submitted data'
			};
		}

		let q = this._db(this._table).where({
			[this._columnTable]: data.table,
			[this._columnPath]: data.path
		});

		if (this._userId) {
			q.where({[this._columnUser]: this._userId});
		}

		q.whereIn(this._columnId, data.ids);
		await q.del();

		return {data: []};
	}

	/**
	 * If there is an existing default, remove it. The client-side will do this
	 * as well, so we don't need to worry about there being two default states
	 * shown, despite only returning a single record.
	 *
	 * @param mixed data Submitted data
	 *
	 * @return void
	 */
	private async _removeDefault(data: StateRestoreSubmit) {
		let validate = this._assertStateHost(data);

		if (validate !== true) {
			return;
		}

		// Values to set
		let set = {
			[this._columnDefault]: 0
		};

		// Conditions
		let where = {
			[this._columnDefault]: 1,
			[this._columnTable]: data['table'],
			[this._columnPath]: data['path']
		};

		if (this._userId) {
			where[this._columnUser] = this._userId;
		}

		await this._db(this._table)
			.update(set)
			.where(where);
	}

	/**
	 * Convert a boolean HTTP value to JS boolean.
	 *
	 * @param data Data to check
	 * @returns Boolean flag
	 */
	private _valueBoolean(data: any) {
		if (data === 'true' || data === 't' || data === '1' || data === 1 || data === true) {
			return 1;
		}

		return 0;
	}
}

export interface StateRestoreSubmit {
	action: string;
	id: string | number;
	ids: Array<string | number>;
	isDefault: boolean;
	isSharedOut: boolean;
	name: string;
	path: string;
	state: string;
	table: string;
}

export interface StateRestoreResponse {
	error?: string;
	data?: State[];
}

export interface State {
	isDefault: boolean;
	isSharedOut: boolean;
	isSharedIn: boolean;
	name: string;
	state: string;
}
