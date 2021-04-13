/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
const { schemaKeyToTable: schema, asyncSchemaSync } = require('./schema');
const { camelCase } = require('change-case')

let _wasRefsCreated = false;

function createRelationShips(left, relationship, right, options) {
    let left_ = left;
    let right_ = right;
    if (Array.isArray(left)) {
        const [_1, getLeft_] = left;
        left_ = getLeft_();
    }
    if (Array.isArray(right)) {
        const [_2, getRight_] = right;
        right_ = getRight_();
    }
    if (relationship === '<') {
        return left_.hasMany(right_, options)
    } else if (relationship === '-') {
        return left_.hasOne(right_, options)
    } else if (relationship === '->') {
        return left_.belongsTo(right_, options)
    }
    throw new Error(`undefined relationship '${relationship}'`);
}

function createRelationShipsFromString(refString, options) {
    const [leftRaw, relationship, rightRaw] = refString.split(' ');
    const left = leftRaw.split('.').map(str => JSON.parse(str));
    const right = rightRaw.split('.').map(str => JSON.parse(str));
    const [leftSchemaKey, leftTableKey] = left;
    const [rightSchemaKey, rightTableKey] = right;

    try {
        if (relationship.trim() === '<') {
            return createRelationShips(schema[camelCase(leftSchemaKey)], relationship.trim(), schema[camelCase(rightSchemaKey)], {
                ...options,
                targetKey: leftTableKey,
                foreignKey: rightTableKey
            })
        } else if (relationship.trim() === '-') {
            return createRelationShips(schema[camelCase(leftSchemaKey)], relationship.trim(), schema[camelCase(rightSchemaKey)], {
                ...options,
                targetKey: leftTableKey,
                foreignKey: rightTableKey
            })
        } else if (relationship.trim() === '->') {
            return createRelationShips(schema[camelCase(leftSchemaKey)], relationship.trim(), schema[camelCase(rightSchemaKey)], {
                ...options,
                targetKey: rightTableKey,
                foreignKey: leftTableKey
            })
        }
    } catch (error) {
        throw new Error(`${error.message} in ${refString}`);
    }


    throw new Error(`undefined relationship '${relationship}' in ${refString}`);
}

exports.createRefsInitial = async function () {
    if (_wasRefsCreated) {
        throw new Error('sequelize refs only needs to create once!');
    }
    _wasRefsCreated = true;

    // screen config

    await asyncSchemaSync();

    const screensWithConfig = createRelationShipsFromString(
        `"screens"."config_id" -> "config_of_screens"."id"`, { as: 'config' }
    );

    const screensPreviewsWithOwnScreen = createRelationShipsFromString(
        `"screen_previews"."screen_id" -> "screens"."id"`, { as: 'screen' }
    );

    const screensWithRelease = createRelationShipsFromString(
        `"screens"."screen_release_id" -> "screen_releases"."id"`, { as: 'release' }
    );

    const screensReleasesWithConfig = createRelationShipsFromString(
        `"screen_releases"."share_config_id" -> "config_of_screens"."id"`, { as: 'config' }
    );

    const templateWithConfig = createRelationShipsFromString(
        `"scope_templates"."template_id" -> "config_of_templates"."id"`, { as: 'config' }
    );

    // scope

    const scopeProjectsWithScopeGroups = createRelationShipsFromString(
       `"scope_projects"."id" < "scope_groups"."project_id"`, { as: 'groups' }
    )

    const scopeProjectsWithScreens = createRelationShipsFromString(
        `"scope_projects"."id" < "screens"."project_id"`, { as: 'screens' }
    );

    const scopeGroupsWithScreens = createRelationShipsFromString(
        `"scope_groups"."id" < "screens"."group_id"`, { as: 'screens' }
    );

    const scopeWorkspacesWithScopeProjects = createRelationShipsFromString(
        `"scope_workspaces"."id" < "scope_projects"."workspace_id"`, { as: 'projects' }
    );

    // user

    const userWithTemplates = createRelationShipsFromString(
        `"users"."id" < "scope_templates"."user_id"`, { as: 'templates' }
    )

    const userWithComponents = createRelationShipsFromString(
        `"users"."id" < "components"."user_id"`, { as: 'components' }
    )

    const userWithWorkspaces = createRelationShipsFromString(
        `"users"."id" < "scope_workspaces"."user_id"`, { as: 'workspaces' }
    )

    // component

    const componentsWithType = createRelationShipsFromString(
        `"components"."type_id" - "component_types"."id"`, { as: 'type' }
    )

    const componentsWithVersions = createRelationShipsFromString(
        `"components"."id" < "component_versions"."component_id"`, { as: 'versions' }
    )

    const datasourceWithType = createRelationShipsFromString(
        `"datasources"."datasource_type" - "datasource_types"."id"`, { as: 'type' }
    )

    return {
        scopeProjectsWithScopeGroups,
        scopeProjectsWithScreens,
        scopeGroupsWithScreens,
        scopeWorkspacesWithScopeProjects,
        screensWithConfig,
        screensWithRelease,
        screensReleasesWithConfig,
        templateWithConfig,
        userWithTemplates,
        userWithComponents,
        userWithWorkspaces,
        componentsWithType,
        componentsWithVersions,
        datasourceWithType,

        screensPreviewsWithOwnScreen
    };
}
