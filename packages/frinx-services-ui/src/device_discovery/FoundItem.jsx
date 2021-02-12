"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var icons_1 = require("@chakra-ui/icons");
var react_1 = require("@chakra-ui/react");
var react_2 = require("react");
var FoundItem = function (_a) {
    var id = _a.id, setCheckedItems = _a.setCheckedItems, checkedItems = _a.checkedItems;
    return (<react_1.Box borderWidth="1px" borderColor="#000000" borderRadius="5px" padding="20px" marginBottom="10px" display="grid" gridTemplateColumns=" 50px 100px 150px 150px 150px 150px auto 25px " gridColumnGap="25px" alignItems="center">
                <react_1.Checkbox onChange={function (e) {
        setCheckedItems(id, e.target.checked);
    }}/>
                10.1.1.1
                <react_1.Select>
                    <option value="NETCONF">NETCONF</option>
                    <option value="CLI">CLI</option>
                </react_1.Select>
                <react_1.Input placeholder="Basic usage" aria-label="test"/>
                <react_1.Input placeholder="Basic usage"/>
                <react_1.Input placeholder="Basic usage"/>
                <div />
                <icons_1.SettingsIcon />
        </react_1.Box>);
};
exports.default = FoundItem;
