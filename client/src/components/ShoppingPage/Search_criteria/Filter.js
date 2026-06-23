import React from "react";
import './Filter.css';
import { Dropdown } from 'react-bootstrap';

//Map the internal sort keys to the labels shown to the user
const SORT_LABELS = {
    'Filter': 'Sort by',
    'Price-low': 'Price: Low to high',
    'Price-high': 'Price: High to low',
    'Alphabetical': 'Alphabetical'
};

function FilterMenu({ setSortType, sortType }) {
    return (
        <div className="toggle_filter">
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {SORT_LABELS[sortType] || 'Sort by'}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => setSortType('Price-low')}>Price: Low to high</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortType('Price-high')}>Price: High to low</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortType('Alphabetical')}>Alphabetical</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setSortType('Filter')}>Clear sorting</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};


export default FilterMenu;
