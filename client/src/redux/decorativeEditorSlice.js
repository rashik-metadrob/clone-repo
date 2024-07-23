import { createSlice } from '@reduxjs/toolkit';

export const decorativeEditorSlice = createSlice({
    name: 'decorativeEditorSlice',
    initialState: {
        decorative: null,
        decorativeEditorMaterials: {},
        decorativeSelectedMaterial: "",
        decorativeTemplateToneMappingExposure: 1,
        decorativeSelectedHdriOfAdminTemplate: "",
    },
    reducers: {
        setDecorativeEditorMaterials: (state, action) => {
            state.decorativeEditorMaterials = action.payload;
        },
        setDecorativeSelectedMaterial: (state, action) => {
            state.decorativeSelectedMaterial = action.payload;
        },
        setDecorativeTemplateToneMappingExposure: (state, action) => {
            state.decorativeTemplateToneMappingExposure = action.payload;
        },
        setDecorativeSelectedHdriOfAdminTemplate: (state, action) => {
            state.decorativeSelectedHdriOfAdminTemplate = action.payload;
        },
        setDecorative: (state, action) => {
            state.decorative = action.payload;
        },
    }
})

export const {
    setDecorativeEditorMaterials,
    setDecorativeSelectedMaterial,
    setDecorativeTemplateToneMappingExposure,
    setDecorativeSelectedHdriOfAdminTemplate,
    setDecorative
} = decorativeEditorSlice.actions;

export const getDecorative = (state) => state.decorativeEditor.decorative
export const getDecorativeSelectedHdriOfAdminTemplate = (state) => state.decorativeEditor.decorativeSelectedHdriOfAdminTemplate
export const getDecorativeEditorMaterials = (state) => state.decorativeEditor.decorativeEditorMaterials
export const getDecorativeSelectedMaterial = (state) => state.decorativeEditor.decorativeSelectedMaterial
export const getDecorativeTemplateToneMappingExposure = (state) => state.decorativeEditor.decorativeTemplateToneMappingExposure

export default decorativeEditorSlice.reducer;