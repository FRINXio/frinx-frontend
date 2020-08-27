import React from "react";
import ReactDOM from "react-dom";
import PoolCard from './pools/PoolCard'
import AllocationStrategies from './configure/AllocationStrategies'

    ReactDOM.render(
        <div>
        <PoolCard/>
        <AllocationStrategies/>
        </div>,
    document.getElementById("root")
    );