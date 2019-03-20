import { constants } from '../../config';

const base = constants.BASE_URL;

async function sendRequest(path, params = {}, queryParams = null) {
    let paramsString = '';
    if (queryParams) {
        paramsString = '?';
        Object.keys(queryParams).forEach((key, index) => {
            if (index !== 0) {
                paramsString += '&';
            }
            paramsString += `${key}=${queryParams[key]}`;
        });
    }
    const response = await fetch(`${base}/${path}${paramsString}`, {
        method: 'GET',
        credentials: 'include',
        ...params,
    });
    if (!response || !response.json) {
        console.log('No response data');
        return null;
    } else if (response.ok) {
        try {
            const r = await response.json();
            return r;
        } catch (e) {
            console.warn(e);
            return {};
        }
    }
    console.warn('Something wrong! Check response');
    console.log(response);
    return {
        error: true,
        errorText: response.statusText,
    };
}
/* eslint-disable import/prefer-default-export */

/*
params = {
    name: String
    new_editor: Boolean
    pages_count: Number
    product_kind: Number
    template_id: Number
    tmc_id: Number
}
*/
export const createProject = (params = {}) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    return sendRequest('api/create_project', {
        method: 'POST',
        body: JSON.stringify(params),
        headers,
    });
};
