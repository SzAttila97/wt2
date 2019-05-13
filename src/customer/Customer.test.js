import {Customer} from "./Customer";
import React from "react";
import * as assert from "assert";
import * as ReactDOM from "react-dom";

describe('Customer unit test', () => {
    let component;
    let div;
    beforeEach(() => {
        div = document.createElement('div');
        component = ReactDOM.render(<Customer />, div);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(div);
        component = null;
    });

    it('state orders should default to empty array', () => {
        assert.equal(component.state.orders.length, 0);
    });
    it('state shutters should default to empty array', () => {
        assert.equal(component.state.shutters.length, 0);
    });
    it('state formWidth should default to empty string', () => {
        assert.equal(component.state.formWidth, '');
    });
    it('state formHeight should default to empty string', () => {
        assert.equal(component.state.formHeight, '');
    });
    it('state formColor should default to Fehér', () => {
        assert.equal(component.state.formColor, 'Fehér');
    });
    it('state formSelectedPreset should default to empty string', () => {
        assert.equal(component.state.formSelectedPreset, '');
    });
    it('state formNet should default to 0', () => {
        assert.equal(component.state.formNet, 0);
    });

    it('should change size on size change event', () => {
        component.onSizeChange({target: {value: '30x20'}});

        assert.equal(component.state.formSelectedPreset, '30x20');
        assert.equal(component.state.formWidth, '30');
        assert.equal(component.state.formHeight, '20');
    });

    it('should change size on size change event but should not update width and height if value is falsy', () => {
        component.onSizeChange({target: {value: '30x20'}});
        component.onSizeChange({target: {value: ''}});

        assert.equal(component.state.formSelectedPreset, '');
        assert.equal(component.state.formWidth, '30');
        assert.equal(component.state.formHeight, '20');
    });

    it('should change height and reset preset on height change event', () => {
        component.onHeightChange({target: {value: '50'}});

        assert.equal(component.state.formSelectedPreset, '');
        assert.equal(component.state.formHeight, '50');
    });

    it('should change width and reset preset on width change event', () => {
        component.onWidthChange({target: {value: '50'}});

        assert.equal(component.state.formSelectedPreset, '');
        assert.equal(component.state.formWidth, '50');
    });
    it('should change color on color change event', () => {
        component.onColorChange({target: {value: 'Barna'}});

        assert.equal(component.state.formColor, 'Barna');
    });
    it('should change net on net change event', () => {
        component.onNetChange({target: {value: '1'}});

        assert.equal(component.state.formNet, '1');
    });

});