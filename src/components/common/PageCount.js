import React, {Component} from 'react';
import Pagination from "react-bootstrap/Pagination";

class PageCount extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return(
            <Pagination style={{float: "left"}}>
                <Pagination.Item active={this.props.defaultPages === 20}
                                 onClick={(e) => {
                                     let data = this.props.data;
                                     let pagesCount = data.length === 0 ? 0 : ~~(data.length / 20) + 1;
                                     this.props.handler(20, pagesCount);
                                     }}
                >20 </Pagination.Item>
                <Pagination.Item active={this.props.defaultPages === 50}
                                 onClick={(e) => {
                                     let data = this.props.data;
                                     let pagesCount = data.length === 0 ? 0 : ~~(data.length / 50) + 1;
                                     this.props.handler(50, pagesCount);
                                 }}
                >50 </Pagination.Item>
                <Pagination.Item active={this.props.defaultPages === 100}
                                 onClick={(e) => {
                                     let data = this.props.data;
                                     let pagesCount = data.length === 0 ? 0 : ~~(data.length / 100) + 1;
                                     this.props.handler(100, pagesCount);
                                 }}
                >100 </Pagination.Item>
            </Pagination>
        )
    }
}

export default PageCount