import { defineStore } from 'pinia';
import { restApi } from '@/restApi/restMethods.vue';

export const useProductStore = defineStore('product', {
    state: () => {
        return {
            pim: {
                catalogId: null,
                attributes: [],
                union: [],
                isKit: false,
            },
            ozon: {
                catalogId: null,
                attributes: [],
                union: [],
            },
            wildberries: {
                catalogId: null,
                attributes: [],
                union: [],
            },
            statuses: [],
            brands: [],
            productLines: [],
            units: [],
            pimAttributes: [],
            ozonAttributes: [],
            wbAttributes: [],
            pimCategories: [],
            ozonCategories: [],
            wbCategories: [],
            attributeGroups: [],
            pimGroups: [],
            ozonGroups: [],
            wbGroups: [],
            pimProducts: [],
            ozonProducts: [],
            wbProducts: [],
            pimHistory: [],
            ozonHistory: [],
            wbHistory: [],
        }
    },
    actions: {
        async getParams(edit) {
            await restApi.post('/units').then(res => {
                this.units = res.data;
                if (!edit) {
                    this.pim.unitId = this.units[0].unitId;
                }
            });
            await restApi.post('/brands').then(res => {
                this.brands = res.data;
            });
            const statusId = this.pimAttributes.find(el => el.alias === 'status')?.attributeId;
            await restApi.post('/dictionary', {
                source: 'pim',
                catalogId: null,
                attributeId: statusId
            }).then(res => {
                this.statuses = res.data;
            });
        },
        async getAttributes(source, id) {
            if (source === 'wildberries') {
                await restApi.post('/attributes', {
                    source: source,
                    catalogId: null,
                }).then(res => {
                    this.wbAttributes = res.data;
                })
            }
            await restApi.post('/attributes', {
                source: source,
                catalogId: id,
            }).then(res => {
                if (source === 'pim') {
                    this.pimAttributes = res.data;
                } else if (source === 'ozon') {
                    this.ozonAttributes = res.data;
                } else { 
                    this.wbAttributes = this.wbAttributes.concat(res.data);
                }
            });
        },
        async getCatalogs(source) {
            await restApi.post('/catalogs', {
                source: source,
            }).then(res => {
                if (source === 'pim') {
                    this.pimCategories = res.data
                } else if (source === 'ozon') {
                    this.ozonCategories = res.data
                } else {
                    this.wbCategories = res.data
                }
            });
        },
        async getProductLines(id) {
            await restApi.post('/productLines', {
                brandId: id
            }).then(res => {
                this.productLines = res.data
                if (!this.productLines || this.productLines.length === 0) {
                    this.pim.productLineId = null;
                }
            })
        },
        async getCard(id, source) {
            await restApi.post('/product', {
                productId: id,
                source: source,
            }).then(res => {
                if (source === 'pim') {
                    this.pim = res.data
                    this.getProductLines(res.data.brandId)
                } else if (source === 'ozon' && res.data !== null) {
                    this.ozon = res.data
                } else if (res.data !== null) {
                    this.wildberries = res.data
                }
            })
        },
        async getGroups(source) {
            await restApi.post('/attribute-group', {
                source: source,
                catalogId: source === 'ozon' ? this.ozon.catalogId : null
            }).then(res => {
                const groups = res.data.sort((a, b) => {
                    return a.order - b.order
                });
                let attributes = [];
                if (source === 'pim') {
                    attributes = this.pimAttributes
                } else if (source === 'ozon') {
                    attributes = this.ozonAttributes
                } else {
                    attributes = this.wbAttributes
                }
                
                groups.map((group) => {
                    group.groups.map((subGroup) => {
                        subGroup.attributes = attributes.filter(attribute => {
                            if (subGroup.attributes.includes(attribute.attributeId) && attribute.alias !== 'wbUnion' && !attribute.isReadOnly) {
                                return attribute
                            }
                        })
                    })
                })
                if (source === 'pim') {
                    this.pimGroups = groups;
                } else if (source === 'ozon') {
                    this.ozonGroups = groups;
                } else {

                    this.wbGroups = groups;
                }
            })
        },
        async saveProduct(id, source) {
            let api = {}
            const product = {
                productId: id
            }
            if (source === 'pim') {
                api = restApi;
                product.pim = this.pim
            } else if (source === 'ozon') {
                api = restApi;
                product.ozon = this.ozon
            } else {
                api = restApi
                product.wildberries = this.wildberries
            }
            return await api.post('/product/edit', product)
        },
        async getDictionaries(source, catalogId) {
            if (source === 'ozon') {
                await this.ozonAttributes.map(el => {
                    if (el.isDictionary) {
                        restApi.post('/dictionary', {
                            source: source,
                            catalogId: catalogId,
                            attributeId: el.attributeId
                        }).then(res => {el.dictionaries = res.data.map(dictionary => dictionary.value)});
                    }
                });
            } else {
                await this.wbAttributes.map(el => {
                    if (el.isDictionary) {
                        restApi.post('/dictionary', {
                            source: source,
                            catalogId: catalogId,
                            attributeId: el.attributeId
                        }).then(res => {el.dictionaries = res.data.value});
                    }
                });
            }
        },
        getProducts(source) {
            restApi.post('/products', {source: source}).then(res => {
                if (source === 'pim') {
                    this.pimProducts = res.data
                } else if (source === "ozon") {
                    this.ozonProducts = res.data
                } else {
                    this.wbProducts = res.data
                }
            });
        },
        getHistory(source, id, page, perPage) {
            restApi.post('attributes/history', {
                source: source,
                productId: id,
                page: page,
                perPage: perPage,
            }).then(res => {
                if (source === 'pim') {
                    this.pimHistory = res.data
                } else if (source === 'ozon') {
                    this.ozonHistory = res.data
                } else {
                    this.wbHistory = res.data
                }
            })
        }
    },
    getters: {
        statusList: (state) => {
            return state.statuses.map(el => el.value);
        },
        brandsList: (state) => {
            return state.brands.map(el => el.name);
        },
        unitsList: (state) => {
            return state.units.map(el => el.name);
        },
        productLinesList: (state) => {
            return state.productLines.map(el => el.name);
        },
        activeStatus: (state) => {
            const id = state.pimAttributes?.find((el) => el.alias === 'status')?.attributeId;
            const status = state.pim.attributes?.find((el) => el.attributeId === id)?.value;
            return status ? status : 'Черновик';
        },
        groupsList: (state) => {
            return state.attributeGroups.map(el => el.name);
        },
        isHeaderValid: (state) => {
            const nameId = state.pimAttributes?.find((el) => el.alias === 'name')?.attributeId;
            const name = state.pim.attributes?.find((el) => el.attributeId === nameId)?.value;
            return name !== null && name !== "" && (state.pim.brandId && state.pim.brandId !== null) && (state.pim.unitId && state.pim.unitId !== null);
        },
        isFormValid: (state) => {
            const ozonRequiredAttributes = state.ozonAttributes.filter(el => el.isRequired);
            const wbRequiredAttributes = state.wbAttributes.filter(el => el.isRequired);
            let isOzonValid = false;
            let isWbValid = false;
            if (state.ozon.catalogId) {
                isOzonValid = ozonRequiredAttributes.every((el) => {
                    const attribute = state.ozon.attributes?.find(attr => attr.attributeId === el.attributeId);
                    return attribute && attribute.value !== null && attribute.value !== '';
                });
            }
            if (state.wildberries.catalogId) {
                isWbValid = wbRequiredAttributes.every((el) => {
                    const attribute = state.wildberries.attributes?.find(attr => attr.attributeId === el.attributeId);
                    return attribute && attribute.value !== null && attribute.value !== '';
                });
            }
            return isOzonValid && isWbValid;
        },
    }
})