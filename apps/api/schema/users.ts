import * as sqlite from 'drizzle-orm/sqlite-core'
import { Base, baseSchema } from './base'
import { relations } from 'drizzle-orm'
import { Role } from './roles'
import { userRoles } from './user-roles'
import { Unit, units } from './units'

export const users = sqlite.sqliteTable(
	'users',
	{
		...baseSchema,
		username: sqlite.text().notNull().unique(),
		password: sqlite.text().notNull(),
		displayName: sqlite.text().notNull().default(''),
		unitId: sqlite
			.int()
			.notNull()
			.default(7)
			.references(() => units.id)
	},
	(t) => [
		sqlite.unique('class_unit_unique_constraint').on(t.username, t.unitId)
	]
)

export const usersRelations = relations(users, ({ one, many }) => ({
	roles: many(userRoles),
	unit: one(units, { fields: [users.unitId], references: [units.id] })
}))

export interface UserDB extends Base {
	username: string
	password: string
	displayName: string
}

export interface User extends UserDB {
	roles?: Role[]
}

export interface CreateUserRequest {
	username: string
	password: string
	roleIds?: number[]
	displayName: string
}

export interface UpdateUserRequest {
	id: number
	username?: string
	password?: string
	roleIds?: number[]
	displayName: string
}

export interface AssignRoleRequest {
	userId: number
	roleIds: number[]
}

export interface BulkAssignRolesRequest {
	userIds: number[]
	roleIds: number[]
}

export interface UserPermissions {
	permissionName: string
	resourceName: string
	actionName: string
}
