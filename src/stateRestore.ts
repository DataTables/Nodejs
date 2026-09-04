import { Knex } from "knex";

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
	public data(column?: string) {
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


	public process(data: StateRestoreSubmit)
	{
		if (!data || data.action === undefined) {
			this._result = {error: 'Unknown action'};
		} else if (data.action === 'state-read') {
			this._result = this._read(data);
		} else if (data.action === 'state-create') {
			this._result = this._create(data);
		} else if (data.action === 'state-edit') {
			this._result = this._edit(data);
		} else if (data.action === 'state-remove') {
			this._result = this._remove(data);
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
	private _create(data: StateRestoreSubmit): StateRestoreResponse {
		return {};
	}

	private _edit(data: StateRestoreSubmit): StateRestoreResponse {
		return {};
	}

	private _read(data: StateRestoreSubmit): StateRestoreResponse {
		return {};
	}

	private _remove(data: StateRestoreSubmit): StateRestoreResponse {
		return {};
	}
}

export interface StateRestoreSubmit {
	action: string;
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
