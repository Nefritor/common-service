import {readFile} from 'node:fs/promises';
import {publishError} from './utils.js';

function error(message) {
    publishError(errors, message);
}

function getRouterData(_navigation) {
    return _navigation.reduce((acc, { key, type, component }) => {
        if (type === 'page') {
            acc.push({ key, component });
        }
        return acc;
    }, []);
}

function getHierarchy(_navigation) {
    return _navigation.reduce((acc, item) => {
        if (item.parent) {
            const parent = acc.find((_item) => _item.key === item.parent);
            if (!parent.children) {
                Object.assign(parent, { children: [] });
            }
            parent.children.push(item);
            return acc.filter((_item) => _item.key !== item.key);
        }
        return acc;
    }, _navigation.map((item) => Object.create(item)));
}

function getMenuNavigationData(hierarchyData) {
    return hierarchyData.map((item) => {
        const menuItem = {
            key: item.key,
            label: item.title,
            icon: item.icon,
            path: item.path
        };
        if (item.children) {
            Object.assign(menuItem, { children: getMenuNavigationData(item.children) });
        }
        return menuItem;
    });
}

function _getBreadcrumbItem({ key, title, type, icon }) {
    const breadcrumb = { key, title, icon };
    if (type === 'page') {
        Object.assign(breadcrumb, { path: `/${key}` });
    }
    return breadcrumb;
}

function _getBreadcrumbItemChildren(parentKey, currentKey) {
    return data.navigation
        .filter((item) => item.parent === parentKey && item.key !== currentKey)
        .map((item) => _getBreadcrumbItem(item));
}

function _fillBreadcrumbs(breadcrumbs, leafItem, currentKey) {
    const breadcrumbItem = _getBreadcrumbItem(leafItem);
    if (leafItem.type === 'node') {
        Object.assign(breadcrumbItem, { children: _getBreadcrumbItemChildren(leafItem.key, currentKey) });
    }
    breadcrumbs.unshift(breadcrumbItem);
    if (leafItem.parent) {
        const nextLeaf = data.navigation.find((item) => item.key === leafItem.parent);
        if (nextLeaf) {
            _fillBreadcrumbs(breadcrumbs, nextLeaf, currentKey);
        } else {
            error(`_fillBreadcrumbs: found navigation item parent "${leafItem.parent}", but there is no parent data`);
        }
    }
}

function getBreadcrumbsData(meta = {}) {
    const breadcrumbs = [];
    const currentKey = meta.path?.match(new RegExp('^\/([\\S\-]*)$')).pop();
    if (currentKey) {
        const item = data.navigation.find((item) => item.key === currentKey);
        if (item) {
            _fillBreadcrumbs(breadcrumbs, item, currentKey);
        } else {
            error(`getBreadcrumbsData: cannot find navigation item by path "${meta.path}"`);
        }
    }
    return breadcrumbs;
}

export const data = {};
export const errors = [];

export async function init(currentLocation) {
    Object.defineProperty(
        data,
        'navigation',
        {
            value: JSON.parse(await readFile(`${currentLocation}/Navigation.json`, { encoding: 'utf8' }))
        }
    );
    Object.defineProperty(
        data,
        'hierarchy',
        {
            value: getHierarchy(data.navigation)
        }
    );
    Object.defineProperty(
        data,
        'routerData',
        {
            value: getRouterData(data.navigation)
        }
    );
    Object.defineProperty(
        data,
        'menuNavigationData',
        {
            value: getMenuNavigationData(data.hierarchy)
        }
    );
}

export const methods = {
    GetRouterData: () => data.routerData,
    GetMenuNavigationData: () => data.menuNavigationData,
    GetBreadcrumbsData: getBreadcrumbsData
};
