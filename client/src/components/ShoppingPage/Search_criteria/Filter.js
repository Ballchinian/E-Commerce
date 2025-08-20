import React from "react";
import './Filter.css';
import { Dropdown, Button } from 'react-bootstrap';

function FilterMenu({setSortType, sortType}) {
    return (
        <div className="toggle_filter">
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {sortType}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item><Button variant="primary" onClick={() => setSortType('Price-low')}>Price: Low to high</Button></Dropdown.Item>
                <Dropdown.Item><Button variant="primary" onClick={() => setSortType('Price-high')}>Price: High to low</Button></Dropdown.Item>
                <Dropdown.Item><Button variant="primary" onClick={() => setSortType('Alphabetical')}>Alphabetical</Button></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};


export default FilterMenu;